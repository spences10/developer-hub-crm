# Authentication Pattern with Remote Functions

This guide shows how to implement authentication using remote
functions and Better Auth, without needing hooks.server.ts or passing
around locals.

## Three Patterns for Protected Routes

### Pattern 1: Inline Check

Check authentication directly in each query:

```typescript
// auth.remote.ts
import { query, getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';

export const get_secret_data = query(() => {
	const event = getRequestEvent();

	const session = event.cookies.get('session');
	if (!session) {
		redirect(307, '/login');
	}

	return 'Secret data';
});
```

### Pattern 2: Reusable Helper

Create a helper function to check auth:

```typescript
// auth.remote.ts
import { query, getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';

const check_auth = query(() => {
	const event = getRequestEvent();
	const session = event.cookies.get('session');
	if (!session) {
		redirect(307, '/login');
	}
});

export const get_contacts = query(() => {
	check_auth(); // Validate first
	return db.query('SELECT * FROM contacts');
});

export const get_interactions = query(() => {
	check_auth(); // Reuse
	return db.query('SELECT * FROM interactions');
});
```

### Pattern 3: Higher-Order Function (Recommended)

Wrap queries with authentication logic:

```typescript
// lib/server/auth-helpers.ts
import { query, getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';

export const guarded_query = <T>(fn: () => T) => {
	return query(() => {
		const event = getRequestEvent();
		const session = event.cookies.get('session');

		if (!session) {
			redirect(307, '/login');
		}

		return fn();
	});
};
```

Usage:

```typescript
// contacts.remote.ts
import { guarded_query } from '$lib/server/auth-helpers';

export const get_contacts = guarded_query(() => {
	return db.query('SELECT * FROM contacts');
});

export const get_contact = guarded_query(async (id: string) => {
	return db.query('SELECT * FROM contacts WHERE id = ?', [id]);
});
```

## Login/Logout Flow

```typescript
// auth.remote.ts
import { form, command, getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';
import * as v from 'valibot';
import { auth } from '$lib/server/auth'; // Better Auth instance

export const login = form(
	v.object({
		email: v.pipe(v.string(), v.email()),
		password: v.pipe(v.string(), v.minLength(8)),
	}),
	async ({ email, password }) => {
		const event = getRequestEvent();

		// Better Auth handles session creation
		const session = await auth.api.signInEmail({
			body: { email, password },
		});

		// Better Auth sets cookies automatically
		redirect(303, '/dashboard');
	},
);

export const logout = command(async () => {
	const event = getRequestEvent();

	// Better Auth handles session cleanup
	await auth.api.signOut({ headers: event.request.headers });

	redirect(303, '/');
});
```

## Component Usage

```svelte
<!-- login/+page.svelte -->
<script lang="ts">
	import { login } from './auth.remote';
</script>

<form {...login}>
	<input name="email" type="email" />
	<input name="password" type="password" />
	<button>Login</button>
</form>
```

```svelte
<!-- dashboard/+page.svelte -->
<script lang="ts">
	import { get_contacts } from './contacts.remote';
	import { logout } from './auth.remote';
</script>

<button onclick={logout}>Logout</button>

<ul>
	{#each await get_contacts() as contact}
		<li>{contact.name}</li>
	{/each}
</ul>
```

## Getting Current User

```typescript
// auth.remote.ts
import { query, getRequestEvent } from '$app/server';
import { auth } from '$lib/server/auth';

export const get_current_user = query(async () => {
	const event = getRequestEvent();

	const session = await auth.api.getSession({
		headers: event.request.headers,
	});

	return session?.user ?? null;
});
```

```svelte
<script lang="ts">
	import { get_current_user } from './auth.remote';
</script>

{#await get_current_user() then user}
	{#if user}
		<p>Welcome, {user.email}</p>
	{:else}
		<a href="/login">Login</a>
	{/if}
{/await}
```

## Key Advantages

1. **No hooks.server.ts needed** - Auth checks happen in remote
   functions
2. **No locals passing** - Use `getRequestEvent()` directly
3. **Type-safe** - Full TypeScript support
4. **Composable** - Reusable auth patterns
5. **Simple** - Less boilerplate than traditional SvelteKit auth
