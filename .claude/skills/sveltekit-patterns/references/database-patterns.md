# Database Access Patterns in Remote Functions

How to safely query the database within SvelteKit remote functions.

## Basic Query Pattern

```typescript
import { query } from '$app/server';
import { db } from '$lib/server/db';
import { getRequestEvent } from '$app/server';
import { auth } from '$lib/server/auth';

export const get_contacts = query(async () => {
	// Get authenticated user
	const event = getRequestEvent();
	const session = await auth.api.getSession({
		headers: event.request.headers,
	});
	const user_id = session?.user?.id;

	// User-scoped query
	const stmt = db.prepare(`
    SELECT * FROM contacts WHERE user_id = ?
  `);

	return stmt.all(user_id);
});
```

## Row-Level Security

Always include `user_id` in WHERE clauses:

```typescript
// ✅ Correct - user-scoped
const stmt = db.prepare(`
  SELECT * FROM contacts WHERE id = ? AND user_id = ?
`);
const contact = stmt.get(contact_id, user_id);

// ❌ Wrong - security vulnerability!
const stmt = db.prepare(`
  SELECT * FROM contacts WHERE id = ?
`);
const contact = stmt.get(contact_id);
```

## Batched Queries (N+1 Prevention)

Use `query.batch()` for loading multiple items:

```typescript
export const get_profiles = query.batch(
	v.string(), // Validation for each ID
	async (usernames: string[]) => {
		// Fetch ALL usernames in ONE query
		const stmt = db.prepare(`
      SELECT * FROM user_profiles
      WHERE username IN (${usernames.map(() => '?').join(',')})
    `);

		const profiles = stmt.all(...usernames);

		// Return lookup function
		return (username: string) => {
			return profiles.find((p) => p.username === username) ?? null;
		};
	},
);

// Usage on client:
// const profile1 = get_profiles('john');
// const profile2 = get_profiles('jane');
// Both execute in ONE database query!
```

## Transactions

For multi-table mutations:

```typescript
import { form } from '$app/server';
import { db } from '$lib/server/db';

export const create_contact_with_tags = form(
	v.object({
		name: v.string(),
		tag_ids: v.array(v.string()),
	}),
	async ({ name, tag_ids }) => {
		const user_id = await getUserId();

		// Wrap in transaction
		const insert_contact_with_tags = db.transaction(() => {
			// Insert contact
			const contact_id = nanoid();
			db.prepare(
				`
        INSERT INTO contacts (id, user_id, name, created_at)
        VALUES (?, ?, ?, ?)
      `,
			).run(contact_id, user_id, name, Date.now());

			// Insert contact_tags
			const tag_stmt = db.prepare(`
        INSERT INTO contact_tags (id, contact_id, tag_id, created_at)
        VALUES (?, ?, ?, ?)
      `);

			for (const tag_id of tag_ids) {
				tag_stmt.run(nanoid(), contact_id, tag_id, Date.now());
			}

			return contact_id;
		});

		// Execute transaction
		const contact_id = insert_contact_with_tags();

		redirect(303, `/contacts/${contact_id}`);
	},
);
```

## JOIN Patterns

```typescript
export const get_contacts_with_stats = query(async () => {
	const user_id = await getUserId();

	const stmt = db.prepare(`
    SELECT
      c.*,
      COUNT(i.id) as interaction_count,
      MAX(i.created_at) as last_interaction
    FROM contacts c
    LEFT JOIN interactions i ON c.id = i.contact_id
    WHERE c.user_id = ?
    GROUP BY c.id
    ORDER BY last_interaction DESC
  `);

	return stmt.all(user_id);
});
```

## Pagination

```typescript
export const get_contacts_paginated = query(
	v.object({
		page: v.pipe(v.number(), v.minValue(1)),
		per_page: v.pipe(v.number(), v.minValue(1), v.maxValue(100)),
	}),
	async ({ page, per_page }) => {
		const user_id = await getUserId();
		const offset = (page - 1) * per_page;

		// Count total
		const count_stmt = db.prepare(`
      SELECT COUNT(*) as total FROM contacts WHERE user_id = ?
    `);
		const { total } = count_stmt.get(user_id);

		// Fetch page
		const stmt = db.prepare(`
      SELECT * FROM contacts
      WHERE user_id = ?
      LIMIT ? OFFSET ?
    `);
		const contacts = stmt.all(user_id, per_page, offset);

		return {
			contacts,
			pagination: {
				total,
				page,
				per_page,
				total_pages: Math.ceil(total / per_page),
			},
		};
	},
);
```

## Helper Function

Create a reusable auth helper:

```typescript
// src/lib/server/remote-helpers.ts
import { getRequestEvent } from '$app/server';
import { auth } from '$lib/server/auth';
import { error } from '@sveltejs/kit';

export async function getUserId(): Promise<string> {
	const event = getRequestEvent();
	const session = await auth.api.getSession({
		headers: event.request.headers,
	});

	if (!session?.user?.id) {
		throw error(401, 'Unauthorized');
	}

	return session.user.id;
}

// Usage in remote functions:
export const get_data = query(async () => {
	const user_id = await getUserId();
	// ...
});
```

## Best Practices

1. **Always use prepared statements** - Never string concatenation
2. **Always scope by user_id** - Prevent cross-user data access
3. **Use transactions for multi-table ops** - All-or-nothing
   consistency
4. **Batch queries when possible** - Use `query.batch()` to prevent
   N+1
5. **Validate inputs** - Use valibot schemas
6. **Handle errors** - Return error objects from forms/commands

## See Also

- `database-patterns` skill for general DB operations
- `auth.remote.ts` for auth function examples
