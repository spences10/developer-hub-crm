---
name: sveltekit-patterns
description: SvelteKit patterns for devhub-crm including routing, server functions, form actions, and remote functions. Use when building pages, handling forms, or implementing server-side logic with SvelteKit.
---

# SvelteKit Patterns

## Quick Start

devhub-crm uses SvelteKit's remote functions for type-safe server-client communication:

```typescript
// src/routes/contacts.remote.ts
import { query, form, command } from '$app/server';
import { db } from '$lib/server/db';
import * as v from 'valibot';

// Query: Fetch data (GET-like)
export const get_contacts = query(async () => {
  const stmt = db.prepare('SELECT * FROM contacts WHERE user_id = ?');
  return stmt.all(user_id);
});

// Form: Validated mutations with redirects
export const create_contact = form(
  v.object({
    name: v.pipe(v.string(), v.minLength(1)),
    email: v.pipe(v.string(), v.email()),
  }),
  async ({ name, email }) => {
    const stmt = db.prepare('INSERT INTO contacts ...');
    stmt.run(id, name, email);
    redirect(303, '/contacts');
  }
);

// Command: Mutations without redirects
export const delete_contact = command(
  v.pipe(v.string(), v.minLength(1)),
  async (id) => {
    const stmt = db.prepare('DELETE FROM contacts WHERE id = ?');
    stmt.run(id);
    return { success: true };
  }
);
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

✅ Use `.remote.ts` for all server logic
✅ Validate with valibot schemas
✅ Include user_id in all database queries
✅ Use `redirect()` only in `form` handlers
✅ Use `query.batch()` for N+1 optimization

## Reference Files

- [references/remote-functions.md](references/remote-functions.md) - Complete remote functions API
- [references/routing.md](references/routing.md) - File-based routing patterns
- [references/database-patterns.md](references/database-patterns.md) - Advanced DB queries

## Notes

- Remote functions auto-generate type-safe client hooks
- Forms handle progressive enhancement automatically
- Commands are useful for AJAX-style mutations
- Always use prepared statements for SQL queries
