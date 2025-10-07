# Authentication Setup with Better Auth

Setting up Better Auth with Remote Functions - no hooks.server.ts
needed.

## Installation

```bash
pnpm add better-auth better-sqlite3 resend
pnpm rebuild better-sqlite3
```

## Configure Better Auth

Create auth instance with database, cookies, and email verification:

```typescript
// lib/server/auth.ts
import { getRequestEvent } from '$app/server';
import { env } from '$env/dynamic/private';
import { betterAuth } from 'better-auth';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import Database from 'better-sqlite3';
import { resend } from './resend';

// Create database instance for Better Auth
const auth_db = new Database('local.db');

// Enable WAL mode for better concurrency
auth_db.pragma('journal_mode = WAL');
auth_db.pragma('busy_timeout = 5000');
auth_db.pragma('synchronous = NORMAL');

export const auth = betterAuth({
	database: auth_db,
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url }) => {
			await resend.emails.send({
				from: 'Your App <notifications@yourdomain.com>',
				to: user.email,
				subject: 'Verify your email address',
				html: `
					<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
						<h2>Welcome!</h2>
						<p>Hi ${user.name},</p>
						<p>Please verify your email address to get started.</p>
						<p>
							<a href="${url}" style="background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
								Verify Email Address
							</a>
						</p>
						<p>Or copy this link: ${url}</p>
					</div>
				`,
			});
		},
	},
	emailVerification: {
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
	},
	secret: env.AUTH_SECRET || 'dev-secret-change-in-production',
	baseURL: env.AUTH_BASE_URL || 'http://localhost:5173',
	plugins: [sveltekitCookies(getRequestEvent)],
});
```

Create Resend helper:

```typescript
// lib/server/resend.ts
import { env } from '$env/dynamic/private';
import { Resend } from 'resend';

export const resend = new Resend(env.RESEND_API_KEY);
```

## Generate Database Schema

Better Auth manages its own tables:

```bash
# Generate schema
npx @better-auth/cli@latest generate

# Apply migrations
npx @better-auth/cli@latest migrate
```

Better Auth creates: `user`, `session`, `account`, `verification`
tables.

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

## Environment Variables

### Development

```env
AUTH_SECRET=your-random-secret-here
AUTH_BASE_URL=http://localhost:5173
RESEND_API_KEY=your-resend-api-key
```

### Production

```env
AUTH_SECRET=your-production-secret
AUTH_BASE_URL=https://yourdomain.com
ORIGIN=https://yourdomain.com  # Critical for CSRF protection
RESEND_API_KEY=your-production-resend-api-key
```

**Critical:**

- The `ORIGIN` environment variable MUST be set in production to avoid
  CSRF 403 errors
- Get your Resend API key from https://resend.com
- Configure your domain in Resend for sending emails

## Authentication Helper Functions

Create reusable auth helpers:

```typescript
// lib/server/auth-helpers.ts
import { query, form, command, getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { auth } from './auth';

/**
 * Get current user ID or redirect to login
 */
export async function get_current_user_id(): Promise<string> {
	const event = getRequestEvent();

	const session = await auth.api.getSession({
		headers: event.request.headers,
	});

	if (!session?.user) {
		redirect(302, '/login');
	}

	return session.user.id;
}

/**
 * Wrap a query function with authentication
 */
export const guarded_query = <T>(fn: () => T | Promise<T>) => {
	return query(async () => {
		const event = getRequestEvent();

		const session = await auth.api.getSession({
			headers: event.request.headers,
		});

		if (!session) {
			redirect(302, '/login');
		}

		return fn();
	});
};

/**
 * Wrap a form function with authentication
 */
export const guarded_form = <Schema, Result>(
	schema: Schema,
	handler: (data: any) => Result | Promise<Result>,
) => {
	return form(schema, async (data) => {
		const event = getRequestEvent();

		const session = await auth.api.getSession({
			headers: event.request.headers,
		});

		if (!session) {
			redirect(302, '/login');
		}

		return handler(data);
	});
};

/**
 * Wrap a command function with authentication
 */
export const guarded_command = <Schema, Result>(
	schema: Schema,
	handler: (data: any) => Result | Promise<Result>,
) => {
	return command(schema, async (data) => {
		const event = getRequestEvent();

		const session = await auth.api.getSession({
			headers: event.request.headers,
		});

		if (!session) {
			redirect(302, '/login');
		}

		return handler(data);
	});
};
```

## Key Concepts

1. **Direct database instance** - Pass Better Auth a direct `Database`
   instance
2. **sveltekitCookies plugin** - Handles cookie management
   automatically
3. **getRequestEvent** - Access request context in remote functions
4. **No hooks needed** - Authentication is handled in remote functions
5. **Use Better Auth CLI** - Let Better Auth manage its schema

## Security Considerations

- Always set `AUTH_SECRET` to a strong random value in production
- Set `ORIGIN` environment variable in production
- Use HTTPS in production (`AUTH_BASE_URL`)
- Enable secure cookies in production (automatic with HTTPS)
- Keep `better-auth` package updated for security patches

## Common Issues

### CSRF 403 Errors

**Problem:** Forms fail with 403 in production

**Solution:** Set `ORIGIN` environment variable to match your domain

### Cookie Not Set

**Problem:** Login succeeds but user not authenticated

**Solution:** Ensure `sveltekitCookies(getRequestEvent)` plugin is
configured

### Database Locked

**Problem:** Database locked errors during concurrent requests

**Solution:** Better Auth uses its own database instance - this is
normal. SQLite locks are temporary.
