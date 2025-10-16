# Remote Functions - Practical Reference

> For deep understanding of why remote functions exist and advanced
> patterns, see
> [remote-functions-deep-dive.md](./remote-functions-deep-dive.md)

Remote functions provide type-safe client-server communication in
SvelteKit without needing to pass around `locals` or event objects.

## Quick Start

### Enable in Config

```javascript
// svelte.config.js
export default {
	kit: {
		experimental: {
			remoteFunctions: true,
			async: true, // ← Highly recommended! Enables Async Svelte
		},
	},
};
```

### File Naming

Remote functions must be in files ending with `.remote.ts`:

```
src/routes/auth/auth.remote.ts
src/lib/server/contacts.remote.ts
```

### Four Types

1. **query** - Fetch data from server (read-only)
2. **form** - Handle form submissions with validation (progressive
   enhancement)
3. **command** - Execute server-side mutations (requires JavaScript)
4. **prerender** - Pre-render data at build time (static)

## Query Functions

### Simple Queries (No Parameters)

Use for reading data from the server without parameters.

```typescript
// contacts.remote.ts
import { query } from '$app/server';

export const get_all_contacts = query(async () => {
	const contacts = await db.query('SELECT * FROM contacts');
	return contacts;
});
```

```svelte
<!-- +page.svelte -->
<script lang="ts">
	import { get_all_contacts } from './contacts.remote';
</script>

<ul>
	{#each await get_all_contacts() as contact}
		<li>{contact.name}</li>
	{/each}
</ul>
```

### Batched Queries (With Parameters)

**IMPORTANT:** Use `query.batch()` when you need to solve N+1 query
problems (e.g., fetching related data for each item in a list). This
batches multiple calls into a single request.

**Only use `query.batch` if you're actually batching** - if you're
just returning a function that executes queries individually, use
regular `query()` instead.

```typescript
// contacts.remote.ts
import { query } from '$app/server';
import * as v from 'valibot';

export const get_contact = query.batch(
	v.pipe(v.string(), v.minLength(1)), // Validation schema for the parameter
	async (ids) => {
		// This function receives ALL requested IDs in a single batch
		const contacts = await db
			.prepare(
				`
			SELECT * FROM contacts WHERE id IN (${ids.map(() => '?').join(',')})
		`,
			)
			.all(...ids);

		// Return a lookup function that finds the contact for each ID
		return (id) => contacts.find((c) => c.id === id);
	},
);
```

```svelte
<!-- +page.svelte -->
<script lang="ts">
	import { page } from '$app/state'; // Svelte 5
	import { get_contact } from './contacts.remote';

	const contact_id = $derived(page.params.id);
</script>

{#if contact_id}
	{#await get_contact(contact_id) then contact}
		<h1>{contact.name}</h1>
	{/await}
{/if}
```

**Benefits of `query.batch()`:**

- **Automatic batching** - Multiple calls are batched into a single
  request
- **Type-safe parameters** - Full TypeScript support with validation
- **Performance** - Reduces database queries when fetching multiple
  records
- **N+1 prevention** - Avoids the N+1 query problem

**Example with optional parameters:**

```typescript
export const get_contacts = query.batch(
	v.optional(v.string(), ''), // Optional search parameter
	async (searches) => {
		// Return function that performs the query
		return (search = '') => {
			let sql = 'SELECT * FROM contacts WHERE user_id = ?';
			const params = [user_id];

			if (search) {
				sql += ' AND name LIKE ?';
				params.push(`%${search}%`);
			}

			return db.prepare(sql).all(...params);
		};
	},
);
```

## Form Functions

Use for form submissions with validation.

```typescript
// auth.remote.ts
import { form, getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';
import * as v from 'valibot';

export const login = form(
	v.object({
		email: v.pipe(v.string(), v.email()),
		password: v.pipe(v.string(), v.minLength(8)),
	}),
	async ({ email, password }) => {
		const event = getRequestEvent();

		// Your auth logic here
		const user = await authenticate_user(email, password);

		// Set session cookie
		event.cookies.set('session', user.session_id, { path: '/' });

		redirect(303, '/dashboard');
	},
);
```

```svelte
<!-- login.svelte -->
<script lang="ts">
	import { login } from './auth.remote';
</script>

<form {...login}>
	<input name="email" type="email" />
	<input name="password" type="password" />
	<button>Login</button>
</form>
```

### Refreshing Data After Mutations

**Default Behaviors:**

- **Forms**: Automatically refresh ALL queries on the page (mirrors
  non-JS behavior)
- **Commands**: Refresh NOTHING by default (must explicitly opt-in)

#### Single-Flight Mutation (Recommended for Performance)

Call `.refresh()` on queries from within the form/command handler to
refresh specific data in the same request:

```typescript
// contacts.remote.ts
export const get_contacts = query(async () => {
	const user_id = await get_current_user_id();
	return db.query('SELECT * FROM contacts WHERE user_id = ?', [
		user_id,
	]);
});

export const create_contact = form(
	v.object({
		name: v.string(),
		email: v.string(),
	}),
	async (data) => {
		const user_id = await get_current_user_id();
		await db.insert('contacts', { ...data, user_id });

		// ✅ Single-flight mutation: refresh in same request
		await get_contacts().refresh();

		return { success: true };
	},
);
```

**Why this is better:**

- **Without**: 2 round trips (mutation request + separate refresh
  request)
- **With**: 1 round trip (mutation with embedded refresh data in
  response)

#### Alternative: Redirect After Save

If you redirect, the new page fetches fresh data automatically:

```typescript
export const create_contact = form(schema, async (data) => {
	const id = await db.insert('contacts', data);
	redirect(303, `/contacts/${id}`); // New page loads fresh data
});
```

**Trade-off:** Causes full page navigation but guarantees fresh data.

## Command Functions

Use for mutations without forms (like button clicks). Commands require
JavaScript and **do not refresh anything by default**.

**IMPORTANT:** Commands must return a value for `await` to properly
complete. Always return `{ success: true }` or an error object.

```typescript
// contacts.remote.ts
import { command } from '$app/server';
import * as v from 'valibot';

export const delete_contact = command(
	v.string(), // Validate the contact ID
	async (id) => {
		const user_id = await get_current_user_id();
		await db.query(
			'DELETE FROM contacts WHERE id = ? AND user_id = ?',
			[id, user_id],
		);

		// ✅ Explicitly refresh queries (commands don't refresh by default)
		await get_contacts().refresh();

		return { success: true }; // ✅ Required for proper async completion
	},
);
```

```svelte
<script lang="ts">
	import { delete_contact, get_contacts } from './contacts.remote';

	const contacts = await get_contacts();
</script>

<button onclick={() => delete_contact(contact.id)}> Delete </button>
```

**Why return values matter:**

Without a return value, the command may not fully complete before the
next operation, causing UI updates to fail. Always return either:

- `{ success: true }` for successful operations
- `{ error: 'message' }` for errors

## Reactive UI Updates

**IMPORTANT:** When remote functions call `.refresh()`, components
update automatically. You do **NOT** need manual refresh triggers.

### Using `.current` for Non-Blocking Updates (Recommended)

**The Problem with `{#await}`:** When you use `{#await query()}` and
call `.refresh()`, it re-renders the entire block, causing scroll
jumps and visual disruption.

**The Solution:** Use the `.current` property to access data
non-blockingly. This keeps previous data visible while new data loads.

#### ❌ **BAD** - Blocking Pattern (Causes Page Jumps):

```svelte
<script lang="ts">
	import { get_interactions, update_interaction } from './interactions.remote';

	let edit_id = $state<string | null>(null);

	async function save_edit() {
		await update_interaction({ id: edit_id, ... });
		edit_id = null;
		await get_interactions().refresh(); // ⚠️ Causes page jump!
	}
</script>

<!-- ❌ Re-renders entire block on .refresh() -->
{#await get_interactions() then interactions}
	{#each interactions as interaction}
		{#if edit_id === interaction.id}
			<!-- edit form -->
			<button onclick={save_edit}>Save</button>
		{:else}
			<!-- view mode -->
		{/if}
	{/each}
{/await}
```

**Why this is bad:**

- Page scrolls to top when `.refresh()` is called
- Entire list disappears then reappears (jarring UX)
- Edit state is lost during re-render
- Component structure is completely recreated

#### ✅ **GOOD** - Non-Blocking Pattern with `.current`:

```svelte
<script lang="ts">
	import { get_interactions, update_interaction } from './interactions.remote';

	// Store query in a variable
	const interactions_query = get_interactions();

	let edit_id = $state<string | null>(null);

	async function save_edit() {
		await update_interaction({ id: edit_id, ... });
		edit_id = null;
		await interactions_query.refresh(); // ✅ Updates in place!
	}
</script>

<!-- ✅ Only show spinner on INITIAL load -->
{#if interactions_query.error}
	<p>Error loading data</p>
{:else if interactions_query.loading && interactions_query.current === undefined}
	<p>Loading...</p>
{:else}
	{@const interactions = interactions_query.current ?? []}

	<!-- Optional: Add subtle loading indicator during refresh -->
	<div class:opacity-60={interactions_query.loading}>
		{#each interactions as interaction}
			{#if edit_id === interaction.id}
				<!-- edit form -->
				<button onclick={save_edit}>Save</button>
			{:else}
				<!-- view mode -->
			{/if}
		{/each}
	</div>
{/if}
```

**Why this is better:**

- **`.current` retains previous data during refresh** - Unlike
  `await`, which re-renders everything, `.current` keeps showing the
  old data while loading new data
- **Scroll position preserved** - No component recreation means no
  scroll jump
- **Smooth updates** - Data updates in place without visual disruption
- **Better UX** - Optional `opacity-60` class shows loading state
  without hiding content
- **Initial load detection** - Check `.current === undefined` to show
  spinner only on first load

#### Key Properties of Query Objects:

```typescript
const query = get_data();

query.loading; // boolean - true when fetching
query.error; // Error | null - error state
query.current; // T | undefined - latest data (persists during refresh!)
```

**The pattern:**

1. **Initial load** (`.current === undefined`): Show loading spinner
2. **During refresh** (`.current` has data + `.loading === true`):
   Keep showing data with optional opacity
3. **After refresh**: New data in `.current`, `.loading` becomes false

This pattern is especially important for:

- Inline editing (prevents scroll jumps)
- Real-time updates
- Optimistic UI updates
- Anywhere you need smooth data transitions

### ❌ **DON'T** Do This (Manual Refresh Pattern):

```svelte
<script lang="ts">
	import { get_tags, create_tag } from './tags.remote';

	let refresh_key = $state(0); // ❌ Don't use manual refresh keys

	async function handle_create(name: string, color: string) {
		await create_tag({ name, color });
		refresh_key++; // ❌ Don't manually increment keys
	}
</script>

{#key refresh_key}
	<!-- ❌ Don't wrap queries in {#key} blocks -->
	{#await get_tags() then tags}
		<!-- content -->
	{/await}
{/key}
```

**Why this is wrong:**

- Forces complete re-render of the entire block
- Feels like a page reload
- Defeats reactive updates
- Creates visual flash/jarring UX

### ✅ **DO** This (Reactive Pattern):

```svelte
<script lang="ts">
	import { get_tags, create_tag } from './tags.remote';

	// No manual refresh state needed!

	async function handle_create(name: string, color: string) {
		await create_tag({ name, color });
		// That's it! Component updates automatically
	}
</script>

<!-- Just await the query directly - updates reactively when .refresh() is called -->
{#await get_tags() then tags}
	<!-- content -->
{/await}
```

**Why this works:**

- Your remote function calls `.refresh()` internally:
  ```typescript
  export const create_tag = guarded_command(schema, async (data) => {
  	await db.insert('tags', data);
  	await get_tags().refresh(); // ← This triggers UI update
  	return { success: true };
  });
  ```
- Component updates **in place** without re-rendering
- Smooth, reactive UI updates
- No visual flash or reload feeling

### Component Callbacks Are Unnecessary

**❌ DON'T** pass `on_change` callbacks to child components:

```svelte
<!-- Parent: contacts/[id]/edit/+page.svelte -->
<script lang="ts">
	const contact_query = $derived(get_contact(contact_id));
</script>

<!-- ❌ Don't do this -->
<SocialLinksManager
	on_add={add_social_link}
	on_delete={delete_social_link}
	on_change={() => contact_query?.refresh()}  <!-- ❌ Unnecessary! -->
/>
```

**✅ DO** just call the remote functions directly:

```svelte
<!-- Parent: contacts/[id]/edit/+page.svelte -->
<script lang="ts">
	const contact_query = $derived(get_contact(contact_id));
</script>

<!-- ✅ Just pass the remote functions -->
<SocialLinksManager
	on_add={add_social_link}
	on_delete={delete_social_link}
	<!-- No on_change needed! -->
/>
```

**Why this works:**

- Remote functions already call `.refresh()` internally
- Parent component updates reactively automatically
- Less boilerplate, cleaner code

## Client-Side Cache & Deduplication

Remote functions use a hidden client-side cache:

**Cache Key**: `remote_function_id + stringified_payload`

**Example**:

```svelte
<script>
	// Called 3 times across different components
	const user1 = await get_user('user-123'); // Fetches from server
	const user2 = await get_user('user-123'); // Cache hit!
	const user3 = await get_user('user-456'); // Different ID, fetches
</script>
```

**Benefits:**

- No need to hoist data loading to parent components
- Use queries wherever you need them
- Automatic deduplication across components
- Reduces network requests
- Reactive updates when `.refresh()` is called

## Async Svelte & Boundaries

When you enable the `async` flag, you get access to Boundary
components for coordinated loading states:

```svelte
<script>
	import { Boundary } from 'svelte';
	import { get_contacts, get_stats } from './data.remote';

	// Both awaits coordinate through boundary
	const contacts = await get_contacts();
	const stats = await get_stats();
</script>

<Boundary>
	{#snippet pending()}
		<!-- Single loading screen while ANY async work pending -->
		<div>Loading dashboard...</div>
	{/snippet}

	<!-- Main content shows when ALL async work complete -->
	<h1>Contacts: {contacts.length}</h1>
	<p>Total interactions: {stats.interactions}</p>
</Boundary>
```

**Without Boundary**: Multiple loading spinners (bad UX) **With
Boundary**: Single coordinated loading screen (good UX)

## Accessing Request Context

Use `getRequestEvent()` to access cookies, headers, etc:

```typescript
import { query, getRequestEvent } from '$app/server';

export const get_current_user = query(() => {
	const event = getRequestEvent();

	// Access cookies
	const session_id = event.cookies.get('session');

	// Access headers
	const user_agent = event.request.headers.get('user-agent');

	return { session_id, user_agent };
});
```

## Accessing Route Parameters (Svelte 5)

In Svelte 5, use `page` from `$app/state` instead of the deprecated
`$app/stores`:

```svelte
<script lang="ts">
	import { page } from '$app/state'; // ✅ Svelte 5
	// import { page } from '$app/stores'; // ❌ Deprecated

	// Access route params
	const contact_id = $derived(page.params.id);

	// Access query params
	const search = $derived(page.url.searchParams.get('q'));
</script>
```

**Key differences:**

- Import from `$app/state` instead of `$app/stores`
- No `$` prefix needed (`page.params` not `$page.params`)
- Use `$derived()` rune for reactive values

## Key Benefits

1. **No locals passing** - Access request context directly via
   `getRequestEvent()`
2. **Type-safe** - Full TypeScript support without magic
3. **Automatic validation** - Built-in schema validation with valibot
4. **Progressive enhancement** - Forms work without JavaScript
5. **Simple** - No need for API routes or +page.server.ts
6. **Automatic caching** - Client-side cache with deduplication
7. **Single-flight mutations** - Refresh data in same request
   (performance!)
8. **Flexible refresh** - Granular control over what refreshes when

## Best Practices

✅ **DO:**

- **Use `.current` pattern for inline editing** - Prevents page jumps
  and provides smooth updates
- **Store queries in variables** - `const query = get_data()` instead
  of calling inline
- **Show spinner only on initial load** - Check
  `.current === undefined` to avoid hiding content during refresh
- Enable the `async` flag in config for Boundary components
- Use single-flight mutations (call `.refresh()` in form/command
  handlers)
- Let queries update reactively - no manual refresh keys needed
- Use `query.batch()` for actual batching (N+1 prevention)
- Always validate with schemas (endpoints are public!)
- Use auth helpers for consistent authentication
- Verify ownership in all mutations
- Return values from commands (`{ success: true }`)

❌ **DON'T:**

- **Use `{#await}` for inline editing** - Causes page jumps and
  re-renders entire blocks
- **Hide content during refresh** - Show spinners only when
  `.current === undefined`
- Use manual refresh keys (`refresh_key++`) or `{#key}` blocks around
  queries
- Pass `on_change` callbacks to trigger manual refreshes
- Use `query.batch()` if you're not actually batching
- Forget that commands don't refresh by default
- Use `window.location.reload()` (defeats reactivity)
- Forget that remote functions are public endpoints
- Assume route-based protection works

## See Also

- [remote-functions-deep-dive.md](./remote-functions-deep-dive.md) -
  Complete guide with rationale and advanced patterns
- [auth-helpers.ts](../src/lib/server/auth-helpers.ts) -
  Authentication wrapper examples
- [Svelte Radio: Remote Functions Interview](../transcript.md)
