# Authentication Usage Patterns

Practical patterns for implementing authentication in your app.

See [auth-setup.md](./auth-setup.md) for installation and
configuration.

## Registration and Login

### Registration and Login Forms

The `sveltekitCookies` plugin handles cookies automatically - no manual cookie transfer needed.

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
			await auth.api.signUpEmail({
				body: { name, email, password },
				headers: event.request.headers,
			});
		} catch (error: any) {
			console.error('Registration error:', error);
			return {
				error: error.message || 'Registration failed',
			};
		}

		// Redirect MUST be outside try/catch because it throws an error
		redirect(303, '/register/success');
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
			// sveltekitCookies plugin handles cookies automatically
			await auth.api.signInEmail({
				body: { email, password },
				headers: event.request.headers,
			});
		} catch (error: any) {
			// Check if error is due to unverified email
			if (
				error.message?.includes('verify') ||
				error.message?.includes('verification')
			) {
				return {
					error:
						'Please verify your email address before logging in.',
					unverified: true,
					email,
				};
			}
			return {
				error: error.message || 'Invalid email or password',
			};
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

## Email Verification

### Resend Verification Email

```typescript
// auth.remote.ts
export const resend_verification_email = command(
	v.pipe(v.string(), v.email('Invalid email address')),
	async (email: string) => {
		const event = getRequestEvent();

		try {
			await auth.api.sendVerificationEmail({
				body: { email, callbackURL: '/dashboard' },
				headers: event.request.headers,
			});

			return {
				success: true,
				message: 'Verification email sent! Please check your inbox.',
			};
		} catch (error: any) {
			return {
				error: error.message || 'Failed to send verification email',
			};
		}
	},
);
```

### Handle Unverified Users in Login

Show a resend button when users try to login without verifying:

```svelte
<!-- routes/(auth)/login/+page.svelte -->
<script lang="ts">
	import { login, resend_verification_email } from '../auth.remote';
</script>

<form {...login}>
	<!-- email and password fields -->

	{#if login.error}
		<div class="alert alert-error">
			<span>{login.error}</span>
		</div>

		{#if login.unverified}
			<button
				class="btn btn-sm"
				onclick={(e) => {
					e.preventDefault();
					resend_verification_email(login.email);
				}}
			>
				Resend Verification Email
			</button>
		{/if}
	{/if}

	<button class="btn btn-primary" type="submit">Login</button>
</form>
```

### Registration Success Page

Redirect to a success page after registration:

```svelte
<!-- routes/(auth)/register/success/+page.svelte -->
<div class="card">
	<h1>Check Your Email</h1>
	<p>We've sent a verification link to your email address.</p>
	<p>Please click the link to verify your account and get started.</p>
	<a href="/login" class="btn btn-primary">Go to Login</a>
</div>
```

## Key Points

1. **Remote Functions** - SvelteKit's recommended approach for server-side logic
2. **Automatic Cookies** - `sveltekitCookies` plugin handles session cookies automatically
3. **Redirect outside try/catch** - SvelteKit's `redirect()` throws an error
4. **Commands cannot redirect** - Use `goto()` client-side for logout
5. **Use guarded helpers** - Simplifies protected route implementation
6. **Layout guards** - Protect entire route groups efficiently
7. **Email verification** - Users must verify email before accessing the app
