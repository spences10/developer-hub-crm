---
name: SvelteKit Remote Functions
description:
  Guide for working with SvelteKit remote functions pattern in this
  project. Use when creating server-side queries, forms, or commands,
  or when implementing type-safe client-server communication.
---

# SvelteKit Remote Functions

## Quick Start

**Simple query:**

```typescript
// contacts.remote.ts
import { query } from '@sveltejs/kit/server';

export const get_contacts = query(async () => {
	const user_id = await get_current_user_id();
	return db
		.prepare('SELECT * FROM contacts WHERE user_id = ?')
		.all(user_id);
});
```

**Use in component:**

```svelte
{#await get_contacts() then contacts}
	{#each contacts as contact}
		<div>{contact.name}</div>
	{/each}
{/await}
```

## Core Patterns

### Query with Parameters

Use `query.batch()` for parameterized queries:

```typescript
import * as v from 'valibot';

export const get_contact = query.batch(v.string(), async ([ids]) => {
	const stmt = db.prepare(
		`SELECT * FROM contacts WHERE id IN (${ids.map(() => '?').join(',')})`,
	);
	const contacts = stmt.all(...ids);
	return (id: string) => contacts.find((c) => c.id === id);
});
```

### Form

```typescript
import { form } from '@sveltejs/kit/server';

const schema = v.object({
	name: v.string(),
	email: v.optional(v.string()),
});

export const create_contact = form(schema, async (data) => {
	// ... insert logic
	return redirect('/contacts');
});
```

Component usage: `<form method="POST" {...create_contact}>`

### Command

```typescript
import { command } from '@sveltejs/kit/server';

export const delete_contact = command(v.string(), async (id) => {
	// ... delete logic
	await get_contacts.refresh(); // Single-flight mutation
	return { success: true };
});
```

## Authentication

Use guarded helpers from `lib/server/auth-helpers.ts`:

```typescript
import {
	guarded_query,
	guarded_form,
} from '$lib/server/auth-helpers';

export const get_contacts = guarded_query(async (user_id) => {
	return db
		.prepare('SELECT * FROM contacts WHERE user_id = ?')
		.all(user_id);
});
```

## Key Rules

1. File naming: `*.remote.ts` in route directories
2. No `+page.server.ts` or `+server.ts` - use remote functions
3. Forms auto-refresh all queries; commands refresh nothing (call
   `.refresh()` explicitly)
4. Use `guarded_*` helpers for protected routes
5. Import `page` from `$app/state` (not `$app/stores`)

For detailed examples and patterns, see [REFERENCE.md](REFERENCE.md).
