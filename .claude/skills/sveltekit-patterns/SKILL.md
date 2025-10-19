---
name: sveltekit-patterns
description: SvelteKit patterns for devhub-crm including routing, server functions, form actions, and remote functions. Use when building pages, handling forms, or implementing server-side logic with SvelteKit.
---

# SvelteKit Patterns

<!-- ============================================ -->
<!-- PROGRESSIVE DISCLOSURE GUIDELINES            -->
<!-- ============================================ -->
<!-- This file uses the 3-level loading system:   -->
<!--                                              -->
<!-- Level 1: Metadata (above) - Always loaded    -->
<!--   ~100 tokens: name + description            -->
<!--                                              -->
<!-- Level 2: This body - Loaded when triggered   -->
<!--   Recommended: <1000 words (<1300 tokens)    -->
<!--   Maximum: <5000 words (<6500 tokens)        -->
<!--   What to include: Quick start, core patterns-->
<!--   What to exclude: Full docs, many examples  -->
<!--                                              -->
<!-- Level 3: references/ - Loaded as needed      -->
<!--   Unlimited: Detailed guides, API docs,      -->
<!--   extensive examples, schemas                -->
<!-- ============================================ -->

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

### Pattern 1: Remote Functions (Server-Side)

Remote functions provide type-safe RPC between client and server:

```typescript
// *.remote.ts files export server functions
import { query, form, command, getRequestEvent } from '$app/server';

// query: Read operations (batching supported)
export const get_items = query.batch(
  v.string(),
  async (ids) => {
    // Fetch all IDs in one query
    const items = db.prepare('...').all(...ids);
    // Return lookup function
    return (id: string) => items.find(i => i.id === id);
  }
);

// form: Mutations with validation + redirects
export const save_item = form(
  v.object({ name: v.string() }),
  async (data) => {
    // Mutation logic
    redirect(303, '/success');
  }
);

// command: Mutations without redirects
export const update_item = command(
  v.object({ id: v.string() }),
  async (data) => {
    // Mutation logic
    return { success: true };
  }
);
```

**Key points:**
- All server logic stays in `.remote.ts` files
- Validation with valibot schemas
- Forms handle redirects, commands return data
- Use `getRequestEvent()` for headers/cookies

### Pattern 2: API Routes

Standard SvelteKit API routes in `+server.ts` for external APIs:

```typescript
// src/routes/api/endpoint/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, params }) => {
  // Server logic
  return json({ status: 'ok', data });
};

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  // Handle mutation
  return json({ success: true });
};
```

**When to use:**
- REST API endpoints for external clients
- Webhooks
- Health checks
- File uploads

### Pattern 3: Database Access

Always use prepared statements with user-scoped queries:

```typescript
import { db } from '$lib/server/db';
import { getRequestEvent } from '$app/server';
import { auth } from '$lib/server/auth';

export const get_data = query(async () => {
  const event = getRequestEvent();
  const session = await auth.api.getSession({
    headers: event.request.headers
  });
  const user_id = session?.user?.id;

  const stmt = db.prepare('SELECT * FROM table WHERE user_id = ?');
  return stmt.all(user_id);
});
```

## Common Mistakes to Avoid

❌ Don't fetch data in `+page.svelte` - use remote functions
❌ Don't skip validation schemas on forms/commands
❌ Don't forget user_id in database queries (security!)
❌ Don't use `form` when you need to return data (use `command`)

✅ Do use `.remote.ts` for all server logic
✅ Do validate with valibot schemas
✅ Do use `query.batch()` for N+1 query optimization
✅ Do use `redirect()` only in `form` handlers

## Advanced Usage

For comprehensive documentation, see:
- [references/remote-functions.md](references/remote-functions.md) - Complete remote functions API
- [references/routing.md](references/routing.md) - File-based routing patterns
- [references/database-patterns.md](references/database-patterns.md) - Advanced DB queries

## Notes

- Remote functions auto-generate type-safe client hooks
- Forms handle progressive enhancement automatically
- Commands are useful for AJAX-style mutations
- Always use prepared statements for SQL queries
