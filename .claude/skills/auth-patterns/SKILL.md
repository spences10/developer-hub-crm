---
name: auth-patterns
description:
  Better-auth integration for authentication. Use when implementing
  login, registration, protected routes, or email verification.
---

# Auth Patterns

## Quick Start

```typescript
// routes/(auth)/auth.remote.ts
import { form, command, query, getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';
import * as v from 'valibot';
import { auth } from '$lib/server/auth';

// Login
export const login = form(
	v.object({
		email: v.pipe(v.string(), v.email()),
		password: v.pipe(v.string(), v.minLength(1)),
	}),
	async ({ email, password }) => {
		const event = getRequestEvent();
		await auth.api.signInEmail({
			body: { email, password },
			headers: event.request.headers,
		});
		redirect(303, '/dashboard');
	},
);

// Get current user
export const get_current_user = query(async () => {
	const event = getRequestEvent();
	const session = await auth.api.getSession({
		headers: event.request.headers,
	});
	return session?.user ?? null;
});
```

## Core Principles

- Use `sveltekitCookies` plugin for automatic cookie handling
- Redirect MUST be outside try/catch (throws error)
- Use `getRequestEvent()` to access headers
- Commands cannot redirect - use goto() client-side
- Protect routes with guarded helpers

## Common Patterns

### Protected Routes

Use helper functions to protect queries, forms, and commands:

```typescript
import { guarded_query } from '$lib/server/auth-helpers';

export const get_dashboard_data = guarded_query(() => {
	// Only authenticated users reach here
	return { message: 'Protected data' };
});
```

### Email Verification

Users must verify email before accessing the app. Use
`sendVerificationEmail` for resending.

## Reference Files

- [references/auth-setup.md](references/auth-setup.md) - Complete
  better-auth configuration
- [references/auth-usage.md](references/auth-usage.md) - All patterns:
  login, register, protected routes
- [references/email-verification.md](references/email-verification.md) -
  Email verification flow

## Notes

- `sveltekitCookies` plugin handles session cookies automatically
- Redirect outside try/catch because it throws an error
- Use `guarded_query/form/command` for protected endpoints
- Email verification is required before login
