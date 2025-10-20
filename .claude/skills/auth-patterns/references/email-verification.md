# Email Verification

Users must verify their email address before accessing the
application.

## Configuration

In `src/lib/server/auth.ts`:

```typescript
export const auth = betterAuth({
	emailVerification: {
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url }) => {
			await resend.emails.send({
				from: 'Your App <updates@yourdomain.com>',
				to: user.email,
				subject: 'Verify your email address',
				html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to Your App!</h2>
            <p>Hi ${user.name},</p>
            <p>Thanks for signing up. Please verify your email address to get started.</p>
            <p>
              <a href="${url}" style="background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Verify Email Address
              </a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="color: #666; font-size: 14px;">${url}</p>
            <p>This link will expire in 24 hours.</p>
          </div>
        `,
			});
		},
	},
});
```

## Resending Verification Email

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

## Handling Unverified Users

Show a resend button when users try to login without verifying:

```svelte
<!-- routes/(auth)/login/+page.svelte -->
<script lang="ts">
	import { login, resend_verification_email } from '../auth.remote';
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

	<button class="btn btn-block btn-primary" type="submit"
		>Login</button
	>
</form>
```

## Login Error Handling

Check for verification errors:

```typescript
export const login = form(
	v.object({
		email: v.pipe(v.string(), v.email()),
		password: v.pipe(v.string(), v.minLength(1)),
	}),
	async ({ email, password }) => {
		const event = getRequestEvent();

		try {
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

## Registration Success Page

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

## Best Practices

1. **Always require verification** - Set
   `requireEmailVerification: true`
2. **Auto sign-in after verification** - Set
   `autoSignInAfterVerification: true`
3. **Provide resend option** - Allow users to resend verification
   emails
4. **Clear error messages** - Tell users they need to verify
5. **Email templates** - Use branded, professional HTML templates
6. **Expiry time** - Set appropriate link expiration (24 hours
   recommended)
