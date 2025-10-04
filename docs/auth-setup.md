# Authentication Setup with Better Auth

Setting up Better Auth with Remote Functions - no hooks.server.ts
needed.

## Installation

```bash
pnpm add better-auth better-sqlite3
pnpm rebuild better-sqlite3
```

## Configure Better Auth

Create auth instance with database and cookies:

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
```

### Production

```env
AUTH_SECRET=your-production-secret
AUTH_BASE_URL=https://yourdomain.com
ORIGIN=https://yourdomain.com  # Critical for CSRF protection
```

**Critical:** The `ORIGIN` environment variable MUST be set in
production to avoid CSRF 403 errors on form submissions.

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
