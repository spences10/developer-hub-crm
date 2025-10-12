# Remote Functions - Practical Reference

> For deep understanding of why remote functions exist and advanced patterns, see [remote-functions-deep-dive.md](./remote-functions-deep-dive.md)

Remote functions provide type-safe client-server communication in SvelteKit without needing to pass around `locals` or event objects.

## Quick Start

### Enable in Config

```javascript
// svelte.config.js
export default {
  kit: {
    experimental: {
      remoteFunctions: true,
      async: true  // ← Highly recommended! Enables Async Svelte
    }
  }
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
2. **form** - Handle form submissions with validation (progressive enhancement)
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

**IMPORTANT:** Use `query.batch()` when you need to solve N+1 query problems (e.g., fetching related data for each item in a list). This batches multiple calls into a single request.

**Only use `query.batch` if you're actually batching** - if you're just returning a function that executes queries individually, use regular `query()` instead.

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
- **Forms**: Automatically refresh ALL queries on the page (mirrors non-JS behavior)
- **Commands**: Refresh NOTHING by default (must explicitly opt-in)

#### Single-Flight Mutation (Recommended for Performance)

Call `.refresh()` on queries from within the form/command handler to refresh specific data in the same request:

```typescript
// contacts.remote.ts
export const get_contacts = query(async () => {
  const user_id = await get_current_user_id();
  return db.query('SELECT * FROM contacts WHERE user_id = ?', [user_id]);
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
    await get_contacts.refresh();

    return { success: true };
  }
);
```

**Why this is better:**
- **Without**: 2 round trips (mutation request + separate refresh request)
- **With**: 1 round trip (mutation with embedded refresh data in response)

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

Use for mutations without forms (like button clicks). Commands require JavaScript and **do not refresh anything by default**.

**IMPORTANT:** Commands must return a value for `await` to properly complete. Always return `{ success: true }` or an error object.

```typescript
// contacts.remote.ts
import { command } from '$app/server';
import * as v from 'valibot';

export const delete_contact = command(
  v.string(), // Validate the contact ID
  async (id) => {
    const user_id = await get_current_user_id();
    await db.query('DELETE FROM contacts WHERE id = ? AND user_id = ?', [id, user_id]);

    // ✅ Explicitly refresh queries (commands don't refresh by default)
    await get_contacts.refresh();

    return { success: true }; // ✅ Required for proper async completion
  }
);
```

```svelte
<script lang="ts">
  import { delete_contact, get_contacts } from './contacts.remote';

  const contacts = await get_contacts();
</script>

<button onclick={() => delete_contact(contact.id)}>
  Delete
</button>
```

**Why return values matter:**

Without a return value, the command may not fully complete before the next operation, causing UI updates to fail. Always return either:

- `{ success: true }` for successful operations
- `{ error: 'message' }` for errors

## Client-Side Cache & Deduplication

Remote functions use a hidden client-side cache:

**Cache Key**: `remote_function_id + stringified_payload`

**Example**:
```svelte
<script>
  // Called 3 times across different components
  const user1 = await get_user('user-123');  // Fetches from server
  const user2 = await get_user('user-123');  // Cache hit!
  const user3 = await get_user('user-456');  // Different ID, fetches
</script>
```

**Benefits:**
- No need to hoist data loading to parent components
- Use queries wherever you need them
- Automatic deduplication across components
- Reduces network requests

## Async Svelte & Boundaries

When you enable the `async` flag, you get access to Boundary components for coordinated loading states:

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

**Without Boundary**: Multiple loading spinners (bad UX)
**With Boundary**: Single coordinated loading screen (good UX)

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

1. **No locals passing** - Access request context directly via `getRequestEvent()`
2. **Type-safe** - Full TypeScript support without magic
3. **Automatic validation** - Built-in schema validation with valibot
4. **Progressive enhancement** - Forms work without JavaScript
5. **Simple** - No need for API routes or +page.server.ts
6. **Automatic caching** - Client-side cache with deduplication
7. **Single-flight mutations** - Refresh data in same request (performance!)
8. **Flexible refresh** - Granular control over what refreshes when

## Best Practices

✅ **DO:**
- Enable the `async` flag in config for Boundary components
- Use single-flight mutations (call `.refresh()` in form/command handlers)
- Use `query.batch()` for actual batching (N+1 prevention)
- Always validate with schemas (endpoints are public!)
- Use auth helpers for consistent authentication
- Verify ownership in all mutations
- Return values from commands (`{ success: true }`)

❌ **DON'T:**
- Use `query.batch()` if you're not actually batching
- Forget that commands don't refresh by default
- Use `window.location.reload()` (defeats reactivity)
- Forget that remote functions are public endpoints
- Assume route-based protection works

## See Also

- [remote-functions-deep-dive.md](./remote-functions-deep-dive.md) - Complete guide with rationale and advanced patterns
- [auth-helpers.ts](../src/lib/server/auth-helpers.ts) - Authentication wrapper examples
- [Svelte Radio: Remote Functions Interview](../transcript.md)
