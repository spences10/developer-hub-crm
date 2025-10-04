# Authentication Usage Patterns

Practical patterns for implementing authentication in your app.

See [auth-setup.md](./auth-setup.md) for installation and
configuration.

## Registration and Login

### Cookie Handling (Critical)

Better Auth returns cookies in the Response when using
`asResponse: true`. You must manually transfer these cookies to the
user.

```typescript
// routes/(auth)/auth.remote.ts
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
			return { error: error.message || 'Registration failed' };
		}

		// Redirect MUST be outside try/catch
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

			// Transfer cookies (same as register)
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
			return { error: error.message || 'Invalid email or password' };
		}

		redirect(303, '/dashboard');
	},
);
```

### Logout

```typescript
export const logout = command(async () => {
	const event = getRequestEvent();

	await auth.api.signOut({
		headers: event.request.headers,
	});

	// Commands cannot redirect - return success and use goto() on client
	return { success: true };
});
```

### Get Current User

```typescript
export const get_current_user = query(async () => {
	const event = getRequestEvent();

	const session = await auth.api.getSession({
		headers: event.request.headers,
	});

	return session?.user ?? null;
});
```

## Protected Routes

Use helper functions to protect queries:

```typescript
// dashboard/dashboard.remote.ts
import { guarded_query } from '$lib/server/auth-helpers';

export const get_dashboard_data = guarded_query(() => {
	// Only authenticated users can access this
	return {
		message: 'Welcome to your protected dashboard!',
		timestamp: Date.now(),
	};
});
```

### Protected Forms

```typescript
import { guarded_form } from '$lib/server/auth-helpers';
import * as v from 'valibot';

export const create_item = guarded_form(
	v.object({
		title: v.string(),
		description: v.string(),
	}),
	async ({ title, description }) => {
		// User is authenticated here
		const user_id = await get_current_user_id();

		// Create item for user
		db.prepare(
			`
      INSERT INTO items (id, user_id, title, description)
      VALUES (?, ?, ?, ?)
    `,
		).run(crypto.randomUUID(), user_id, title, description);
	},
);
```

### Protected Commands

```typescript
import { guarded_command } from '$lib/server/auth-helpers';
import * as v from 'valibot';

export const update_settings = guarded_command(
	v.object({
		theme: v.string(),
		notifications: v.boolean(),
	}),
	async ({ theme, notifications }) => {
		const user_id = await get_current_user_id();

		db.prepare(
			`
      UPDATE user_settings
      SET theme = ?, notifications = ?
      WHERE user_id = ?
    `,
		).run(theme, notifications ? 1 : 0, user_id);
	},
);
```

## Component Usage

### Login Page

```svelte
<!-- routes/(auth)/login/+page.svelte -->
<script lang="ts">
	import { login } from '../auth.remote';
</script>

<form {...login}>
	<fieldset class="fieldset">
		<legend class="fieldset-legend">Email</legend>
		<label class="input w-full">
			<input type="email" name="email" class="grow" required />
		</label>
	</fieldset>

	<fieldset class="fieldset">
		<legend class="fieldset-legend">Password</legend>
		<label class="input w-full">
			<input type="password" name="password" class="grow" required />
		</label>
	</fieldset>

	{#if login.error}
		<div class="alert alert-error">
			<span>{login.error}</span>
		</div>
	{/if}

	<button class="btn btn-block btn-primary" type="submit"
		>Login</button
	>
</form>
```

### Protected Dashboard

```svelte
<!-- routes/(app)/dashboard/+page.svelte -->
<script lang="ts">
	import { get_current_user, logout } from '../../(auth)/auth.remote';
	import { get_dashboard_data } from './dashboard.remote';
	import { goto } from '$app/navigation';

	async function handle_logout() {
		await logout();
		goto('/login');
	}
</script>

<svelte:boundary>
	<div>
		<button class="btn" onclick={handle_logout}>Logout</button>

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

### Show User Info

```svelte
<script lang="ts">
	import { get_current_user } from './auth.remote';
</script>

{#await get_current_user() then user}
	{#if user}
		<div class="dropdown">
			<label tabindex="0" class="btn btn-ghost">
				{user.name}
			</label>
			<ul class="dropdown-content menu">
				<li><a href="/profile">Profile</a></li>
				<li><button onclick={handle_logout}>Logout</button></li>
			</ul>
		</div>
	{:else}
		<a href="/login" class="btn">Login</a>
	{/if}
{/await}
```

## Layout-Based Protection

Protect entire route groups with layout guards:

```typescript
// routes/(app)/layout.remote.ts
import { guarded_query } from '$lib/server/auth-helpers';

export const verify_auth = guarded_query(() => {
	// Just check authentication - redirect if not logged in
	return { authenticated: true };
});
```

```svelte
<!-- routes/(app)/+layout.svelte -->
<script lang="ts">
	import { verify_auth } from './layout.remote';
</script>

<svelte:boundary>
	{#await verify_auth()}
		<div class="loading">Loading...</div>
	{:then}
		<slot />
	{/await}

	{#snippet failed()}
		<!-- User will be redirected to login -->
	{/snippet}
</svelte:boundary>
```

## Key Points

1. **Redirect outside try/catch** - SvelteKit's `redirect()` throws an
   error
2. **Commands cannot redirect** - Use `goto()` client-side for logout
3. **Cookie transfer required** - Must manually transfer Better Auth
   cookies
4. **Use guarded helpers** - Simplifies protected route implementation
5. **Layout guards** - Protect entire route groups efficiently
