# Remote Functions Reference

Complete API documentation for SvelteKit remote functions used in
devhub-crm.

## Overview

Remote functions provide type-safe RPC between client and server with
automatic type inference.

## Function Types

### query

Read-only operations that fetch data.

**Basic usage:**

```typescript
export const get_items = query(async () => {
	return db.prepare('SELECT * FROM items').all();
});
```

**With validation:**

```typescript
export const get_item = query(
	v.pipe(v.string(), v.minLength(1)),
	async (id: string) => {
		return db.prepare('SELECT * FROM items WHERE id = ?').get(id);
	},
);
```

**Batching (N+1 optimization):**

```typescript
export const get_items = query.batch(
	v.string(), // Input validation schema
	async (ids: string[]) => {
		const items = db
			.prepare(
				`SELECT * FROM items WHERE id IN (${ids.map(() => '?').join(',')})`,
			)
			.all(...ids);

		// Return lookup function
		return (id: string) => items.find((item) => item.id === id);
	},
);
```

### form

Mutations with validation and redirects. Used for traditional form
submissions.

**Structure:**

```typescript
export const action_name = form(
	validationSchema,
	async (validatedData) => {
		// Mutation logic
		redirect(303, '/success-path');
	},
);
```

**Example:**

```typescript
export const create_contact = form(
	v.object({
		name: v.pipe(v.string(), v.minLength(1, 'Name required')),
		email: v.pipe(v.string(), v.email('Invalid email')),
	}),
	async ({ name, email }) => {
		const event = getRequestEvent();
		const session = await auth.api.getSession({
			headers: event.request.headers,
		});

		const user_id = session?.user?.id;
		const id = nanoid();

		db.prepare(
			`
      INSERT INTO contacts (id, user_id, name, email, created_at)
      VALUES (?, ?, ?, ?, ?)
    `,
		).run(id, user_id, name, email, Date.now());

		redirect(303, '/contacts');
	},
);
```

**Error handling:**

```typescript
export const save_item = form(
	v.object({ name: v.string() }),
	async (data) => {
		try {
			// Mutation
		} catch (error) {
			return { error: error.message };
		}
		redirect(303, '/success');
	},
);
```

### command

Mutations that return data instead of redirecting. Used for AJAX-style
interactions.

**Basic usage:**

```typescript
export const delete_item = command(
	v.pipe(v.string(), v.minLength(1)),
	async (id: string) => {
		db.prepare('DELETE FROM items WHERE id = ?').run(id);
		return { success: true };
	},
);
```

**Complex return:**

```typescript
export const update_settings = command(
	v.object({
		theme: v.string(),
		notifications: v.boolean(),
	}),
	async (settings) => {
		// Save settings
		return {
			success: true,
			message: 'Settings saved',
			updated_at: Date.now(),
		};
	},
);
```

## Accessing Request Context

Use `getRequestEvent()` to access headers, cookies, URL params:

```typescript
import { getRequestEvent } from '$app/server';

export const my_function = query(async () => {
	const event = getRequestEvent();

	// Access headers
	const userAgent = event.request.headers.get('user-agent');

	// Access URL params
	const searchParam = event.url.searchParams.get('q');

	// Access session
	const session = await auth.api.getSession({
		headers: event.request.headers,
	});

	return { userAgent, searchParam, user: session?.user };
});
```

## Client Usage

Remote functions are automatically available on the client:

```svelte
<script lang="ts">
	import {
		get_items,
		create_contact,
		delete_item,
	} from './functions.remote';

	// Query: Returns promise
	const items = get_items();

	// Form: Use with <form> element
	const { data, submitting, errors } = create_contact();

	// Command: Call programmatically
	async function handleDelete(id: string) {
		const result = await delete_item(id);
		if (result.success) {
			// Handle success
		}
	}
</script>

<!-- Form usage -->
<form method="POST" use:data>
	<input name="name" />
	<input name="email" type="email" />
	<button disabled={$submitting}>Create</button>
	{#if $errors.name}<span>{$errors.name}</span>{/if}
</form>

<!-- Query usage -->
{#await items}
	Loading...
{:then data}
	{#each data as item}
		<div>{item.name}</div>
	{/each}
{/await}
```

## Best Practices

1. **Always validate inputs** - Use valibot schemas for all user input
2. **Use batching for lists** - Prevents N+1 queries
3. **Handle errors gracefully** - Return error objects from
   forms/commands
4. **Include user_id** - Always scope database queries by user
5. **Use transactions** - For multi-step mutations
6. **Redirect in forms only** - Commands should return data

## Examples from devhub-crm

See actual implementations in:

- `src/routes/auth.remote.ts` - Authentication flows
- `src/routes/@[username]/profile.remote.ts` - Profile queries with
  batching
- Database patterns skill for query construction
