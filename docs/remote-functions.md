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

Use for reading data from the server.

```typescript
// contacts.remote.ts
import { query } from '$app/server';

export const get_contacts = query(async () => {
	// Access request context
	const event = getRequestEvent();

	const contacts = await db.query('SELECT * FROM contacts');
	return contacts;
});
```

```svelte
<!-- +page.svelte -->
<script lang="ts">
	import { get_contacts } from './contacts.remote';
</script>

<ul>
	{#each await get_contacts() as contact}
		<li>{contact.name}</li>
	{/each}
</ul>
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

## Key Benefits

1. **No locals passing** - Access request context directly via
   `getRequestEvent()`
2. **Type-safe** - Full TypeScript support
3. **Automatic validation** - Built-in schema validation with valibot
4. **Progressive enhancement** - Forms work without JavaScript
5. **Simple** - No need for API routes or +page.server.ts
