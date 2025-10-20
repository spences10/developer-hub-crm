---
name: sveltekit-patterns
description:
  SvelteKit patterns for devhub-crm. Use for remote functions (query,
  form, command), routing, and server-side logic.
---

# SvelteKit Patterns

## Quick Start

```typescript
// src/routes/contacts.remote.ts
import { query, form, command } from '$app/server';
import * as v from 'valibot';

// Query: Fetch data
export const get_contacts = query(async () => {
	return db
		.prepare('SELECT * FROM contacts WHERE user_id = ?')
		.all(user_id);
});

// Form: Validated mutations with redirects
export const create_contact = form(
	v.object({
		name: v.string(),
		email: v.pipe(v.string(), v.email()),
	}),
	async ({ name, email }) => {
		db.prepare('INSERT INTO contacts ...').run(id, name, email);
		redirect(303, '/contacts');
	},
);

// Command: Mutations without redirects
export const delete_contact = command(v.string(), async (id) => {
	db.prepare('DELETE FROM contacts WHERE id = ?').run(id);
	return { success: true };
});
```

## Core Patterns

### Remote Functions

Three types for server-client communication:

- `query` - Read operations (supports batching)
- `form` - Mutations with validation + redirects
- `command` - Mutations without redirects

All use valibot for validation and stay in `.remote.ts` files.

### API Routes

Use `+server.ts` for REST endpoints, webhooks, and external APIs.

### Database Access

Always use prepared statements with user_id for row-level security.

## Best Practices

✅ Use `.remote.ts` for all server logic ✅ Validate with valibot
schemas ✅ Include user_id in all database queries ✅ Use `redirect()`
only in `form` handlers ✅ Use `query.batch()` for N+1 optimization

## Reference Files

- [references/remote-functions.md](references/remote-functions.md) -
  Complete remote functions API
- [references/routing.md](references/routing.md) - File-based routing
  patterns
- [references/database-patterns.md](references/database-patterns.md) -
  Advanced DB queries

## Notes

- Remote functions auto-generate type-safe client hooks
- Forms handle progressive enhancement automatically
- Commands are useful for AJAX-style mutations
- Always use prepared statements for SQL queries
