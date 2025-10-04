# Remote Functions Pattern

Remote functions provide type-safe client-server communication in
SvelteKit without needing to pass around `locals` or event objects.

## Core Concepts

### File Naming

Remote functions must be in files ending with `.remote.ts`:

```
src/routes/auth/auth.remote.ts
src/lib/server/contacts.remote.ts
```

### Three Types

1. **query** - Fetch data from server
2. **form** - Handle form submissions with validation
3. **command** - Execute server-side mutations

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

**IMPORTANT:** For query functions that accept parameters, use
`query.batch()` instead of `query()`. This enables automatic request
batching and proper TypeScript typing.

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

## Command Functions

Use for mutations without forms (like button clicks).

```typescript
// contacts.remote.ts
import { command } from '$app/server';
import * as v from 'valibot';

export const delete_contact = command(
	v.string(), // Validate the contact ID
	async (id) => {
		await db.query('DELETE FROM contacts WHERE id = ?', [id]);
	},
);
```

```svelte
<script lang="ts">
	import { delete_contact } from './contacts.remote';
</script>

<button onclick={() => delete_contact(contact.id)}> Delete </button>
```

## Re-fetching Data After Mutations

After mutations (create/update/delete), trigger data re-fetch using
`refresh_key` with `{#key}` blocks:

```svelte
<script lang="ts">
	import {
		delete_contact,
		get_all_contacts,
	} from './contacts.remote';

	let refresh_key = $state(0);

	async function handle_delete(id: string) {
		await delete_contact(id);
		refresh_key++; // Triggers re-fetch
	}
</script>

{#key refresh_key}
	{#await get_all_contacts() then contacts}
		<ul>
			{#each contacts as contact}
				<li>
					{contact.name}
					<button onclick={() => handle_delete(contact.id)}>
						Delete
					</button>
				</li>
			{/each}
		</ul>
	{/await}
{/key}
```

**Why this works:**

- `{#key}` block destroys and recreates its contents when the key
  changes
- Incrementing `refresh_key` triggers a fresh call to
  `get_all_contacts()`
- Maintains scroll position and component state outside the `{#key}`
  block

**❌ Anti-pattern:** Never use `window.location.reload()`

- Loses scroll position
- Clears all component state
- Provides poor user experience
- Defeats Svelte's reactivity system

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
2. **Type-safe** - Full TypeScript support
3. **Automatic validation** - Built-in schema validation with valibot
4. **Progressive enhancement** - Forms work without JavaScript
5. **Simple** - No need for API routes or +page.server.ts
6. **Automatic batching** - `query.batch()` optimizes multiple calls
