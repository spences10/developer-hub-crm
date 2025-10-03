# Authentication Pattern with Better Auth & Remote Functions

This guide shows how to implement authentication using Better Auth
with remote functions, without needing hooks.server.ts or passing
around locals.

## Setup Better Auth

### 1. Install Dependencies

```bash
pnpm add better-auth better-sqlite3
pnpm rebuild better-sqlite3
```

### 2. Configure Better Auth

```typescript
// lib/server/auth.ts
import { betterAuth } from 'better-auth';
import Database from 'better-sqlite3';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';

// Create database instance for Better Auth
const auth_db = new Database('local.db');

export const auth = betterAuth({
	database: auth_db, // Pass database instance directly
	emailAndPassword: {
		enabled: true,
	},
	secret:
		process.env.AUTH_SECRET || 'dev-secret-change-in-production',
	baseURL: process.env.AUTH_BASE_URL || 'http://localhost:5173',
	plugins: [
		sveltekitCookies(getRequestEvent), // Automatically handles cookies
	],
});
```

### 3. Generate and Run Migrations

```bash
# Generate schema
npx @better-auth/cli@latest generate

# Apply migrations
npx @better-auth/cli@latest migrate
```

Better Auth will create the necessary tables: `user`, `session`,
`account`, `verification`.

## Authentication Remote Functions

### Registration and Login with Cookie Handling

**Critical:** Better Auth returns cookies in the Response when using
`asResponse: true`. You must manually transfer these cookies to the
user.

```typescript
// routes/auth/auth.remote.ts
import { form, command, query, getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';
import * as v from 'valibot';
import { auth } from '$lib/server/auth';

export const register = form(
	v.object({
		name: v.pipe(v.string(), v.minLength(1, 'Name is required')),
		email: v.pipe(v.string(), v.email('Invalid email address')),
		password: v.pipe(
			v.string(),
			v.minLength(8, 'Password must be at least 8 characters'),
		),
	}),
	async ({ name, email, password }) => {
		const event = getRequestEvent();

		try {
			const response = await auth.api.signUpEmail({
				body: { name, email, password },
				asResponse: true,
				headers: event.request.headers,
			});

			// Transfer cookies from Better Auth response to user response
			const cookies = response.headers.get('set-cookie');
			if (cookies) {
				const all_cookies = response.headers.getSetCookie?.() || [
					cookies,
				];

				for (const cookie_str of all_cookies) {
					const [name_value, ...options] = cookie_str.split(';');
					const [name, value] = name_value.trim().split('=');

					// Parse cookie options
					const cookie_options: any = { path: '/' };
					for (const option of options) {
						const [key, val] = option.trim().split('=');
						const lower_key = key.toLowerCase();
						if (lower_key === 'max-age') {
							cookie_options.maxAge = parseInt(val);
						} else if (lower_key === 'httponly') {
							cookie_options.httpOnly = true;
						} else if (lower_key === 'secure') {
							cookie_options.secure = true;
						} else if (lower_key === 'samesite') {
							cookie_options.sameSite = val.toLowerCase();
						}
					}

					event.cookies.set(name, value, cookie_options);
				}
			}
		} catch (error: any) {
			return {
				error: error.message || 'Registration failed',
			};
		}

		// Redirect MUST be outside try/catch - redirect throws an error
		redirect(303, '/dashboard');
	},
);

export const login = form(
	v.object({
		email: v.pipe(v.string(), v.email('Invalid email address')),
		password: v.pipe(
			v.string(),
			v.minLength(1, 'Password is required'),
		),
	}),
	async ({ email, password }) => {
		const event = getRequestEvent();

		try {
			const response = await auth.api.signInEmail({
				body: { email, password },
				asResponse: true,
				headers: event.request.headers,
			});

			// Transfer cookies from Better Auth response
			const cookies = response.headers.get('set-cookie');
			if (cookies) {
				const all_cookies = response.headers.getSetCookie?.() || [
					cookies,
				];

				for (const cookie_str of all_cookies) {
					const [name_value, ...options] = cookie_str.split(';');
					const [name, value] = name_value.trim().split('=');

					const cookie_options: any = { path: '/' };
					for (const option of options) {
						const [key, val] = option.trim().split('=');
						const lower_key = key.toLowerCase();
						if (lower_key === 'max-age') {
							cookie_options.maxAge = parseInt(val);
						} else if (lower_key === 'httponly') {
							cookie_options.httpOnly = true;
						} else if (lower_key === 'secure') {
							cookie_options.secure = true;
						} else if (lower_key === 'samesite') {
							cookie_options.sameSite = val.toLowerCase();
						}
					}

					event.cookies.set(name, value, cookie_options);
				}
			}
		} catch (error: any) {
			return {
				error: error.message || 'Invalid email or password',
			};
		}

		redirect(303, '/dashboard');
	},
);

export const logout = command(async () => {
	const event = getRequestEvent();

	await auth.api.signOut({
		headers: event.request.headers,
	});

	// Commands cannot redirect - return success and use goto() on client
	return { success: true };
});

export const get_current_user = query(async () => {
	const event = getRequestEvent();

	const session = await auth.api.getSession({
		headers: event.request.headers,
	});

	return session?.user ?? null;
});
```

## Protected Routes

Create a helper to wrap queries with authentication:

```typescript
// lib/server/auth-helpers.ts
import { query, getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { auth } from './auth';

export const guarded_query = <T>(fn: () => T) => {
	return query(async () => {
		const event = getRequestEvent();

		const session = await auth.api.getSession({
			headers: event.request.headers,
		});

		if (!session) {
			redirect(307, '/login');
		}

		return fn();
	});
};
```

Usage:

```typescript
// dashboard/dashboard.remote.ts
import { guarded_query } from '$lib/server/auth-helpers';

export const get_dashboard_data = guarded_query(() => {
	// This function is protected - only authenticated users can access
	return {
		message: 'Welcome to your protected dashboard!',
		timestamp: Date.now(),
	};
});
```

## Component Usage

### Login Page

```svelte
<!-- routes/auth/login/+page.svelte -->
<script lang="ts">
	import { login } from '../auth.remote';
</script>

<form {...login}>
	<input name="email" type="email" required />
	<input name="password" type="password" required />

	{#if login.error}
		<div class="alert alert-error">
			<span>{login.error}</span>
		</div>
	{/if}

	<button type="submit">Login</button>
</form>
```

### Protected Dashboard

```svelte
<!-- routes/dashboard/+page.svelte -->
<script lang="ts">
	import { get_current_user, logout } from '../auth/auth.remote';
	import { get_dashboard_data } from './dashboard.remote';
	import { goto } from '$app/navigation';

	async function handle_logout() {
		await logout();
		goto('/login');
	}
</script>

<svelte:boundary>
	<div>
		<button onclick={handle_logout}>Logout</button>

		{#await get_current_user() then user}
			{#if user}
				<p>Welcome, {user.name}!</p>
			{/if}
		{/await}

		{#await get_dashboard_data() then data}
			<p>{data.message}</p>
		{/await}
	</div>

	{#snippet pending()}
		<div class="loading">Loading...</div>
	{/snippet}

	{#snippet failed(error, reset)}
		<div class="error">
			<p>Error: {error.message}</p>
			<button onclick={reset}>Retry</button>
		</div>
	{/snippet}
</svelte:boundary>
```

## Key Points

1. **Direct database instance** - Pass Better Auth a direct `Database`
   instance, not wrapped
2. **sveltekitCookies plugin** - Automatically handles cookie
   management, no manual transfer needed
3. **Redirect outside try/catch** - SvelteKit's `redirect()` throws an
   error that must propagate
4. **Use Better Auth CLI** - Let Better Auth manage schema with
   `generate` and `migrate` commands
5. **No hooks needed** - Access session via `auth.api.getSession()` in
   remote functions
6. **Commands cannot redirect** - Use `command()` for logout but
   handle navigation client-side with `goto()`
7. **ORIGIN required in production** - Set `ORIGIN` environment
   variable to avoid CSRF 403 errors on forms

## Enable Remote Functions

Add to `svelte.config.js`:

```javascript
kit: {
  adapter: adapter(),
  experimental: {
    remoteFunctions: true
  }
}
```
