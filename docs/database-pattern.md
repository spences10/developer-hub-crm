# Database Pattern - Raw SQL with SQLite

This project uses raw SQL queries with SQLite - no ORM, just pure SQL.

## Database Setup

```typescript
// lib/server/db.ts
import Database from 'better-sqlite3';

const db = new Database('local.db');

// Enable foreign keys
db.pragma('foreign_keys = ON');

export { db };
```

## Query Patterns

### Simple Select

```typescript
// contacts.remote.ts
import { query } from '$app/server';
import { db } from '$lib/server/db';

export const get_contacts = query(() => {
	const stmt = db.prepare('SELECT * FROM contacts ORDER BY name');
	return stmt.all();
});
```

### Parameterized Query

Always use parameterized queries to prevent SQL injection:

```typescript
export const get_contact = query((id: string) => {
	const stmt = db.prepare('SELECT * FROM contacts WHERE id = ?');
	return stmt.get(id);
});
```

### Insert with Return

```typescript
import { command } from '$app/server';
import * as v from 'valibot';

export const create_contact = command(
	v.object({
		name: v.string(),
		email: v.pipe(v.string(), v.email()),
	}),
	({ name, email }) => {
		const stmt = db.prepare(`
      INSERT INTO contacts (id, name, email, created_at)
      VALUES (?, ?, ?, ?)
    `);

		const id = crypto.randomUUID();
		const now = Date.now();

		stmt.run(id, name, email, now);

		return { id };
	},
);
```

### Update

```typescript
export const update_contact = command(
	v.object({
		id: v.string(),
		name: v.string(),
		email: v.pipe(v.string(), v.email()),
	}),
	({ id, name, email }) => {
		const stmt = db.prepare(`
      UPDATE contacts
      SET name = ?, email = ?, updated_at = ?
      WHERE id = ?
    `);

		stmt.run(name, email, Date.now(), id);
	},
);
```

### Delete

```typescript
export const delete_contact = command(v.string(), (id) => {
	const stmt = db.prepare('DELETE FROM contacts WHERE id = ?');
	stmt.run(id);
});
```

## Transactions

Use transactions for multiple related operations:

```typescript
export const create_contact_with_interaction = command(
	v.object({
		name: v.string(),
		email: v.pipe(v.string(), v.email()),
		note: v.string(),
	}),
	({ name, email, note }) => {
		const create_contact = db.prepare(`
      INSERT INTO contacts (id, name, email, created_at)
      VALUES (?, ?, ?, ?)
    `);

		const create_interaction = db.prepare(`
      INSERT INTO interactions (id, contact_id, type, note, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);

		// Wrap in transaction
		const transaction = db.transaction(() => {
			const contact_id = crypto.randomUUID();
			const now = Date.now();

			create_contact.run(contact_id, name, email, now);

			const interaction_id = crypto.randomUUID();
			create_interaction.run(
				interaction_id,
				contact_id,
				'note',
				note,
				now,
			);

			return { contact_id, interaction_id };
		});

		return transaction();
	},
);
```

## Joins

```typescript
export const get_contacts_with_interactions = query(() => {
	const stmt = db.prepare(`
    SELECT
      c.id,
      c.name,
      c.email,
      COUNT(i.id) as interaction_count,
      MAX(i.created_at) as last_interaction
    FROM contacts c
    LEFT JOIN interactions i ON c.id = i.contact_id
    GROUP BY c.id, c.name, c.email
    ORDER BY last_interaction DESC
  `);

	return stmt.all();
});
```

## Type Safety

Define types for your database rows:

```typescript
// lib/types/db.ts
export interface Contact {
	id: string;
	name: string;
	email: string;
	phone?: string;
	company?: string;
	is_vip: number; // SQLite uses 0/1 for booleans
	created_at: number;
	updated_at: number;
}

export interface Interaction {
	id: string;
	contact_id: string;
	type: 'meeting' | 'call' | 'email' | 'message';
	note: string;
	created_at: number;
}
```

Use types in queries:

```typescript
import type { Contact } from '$lib/types/db';

export const get_contacts = query((): Contact[] => {
	const stmt = db.prepare('SELECT * FROM contacts ORDER BY name');
	return stmt.all() as Contact[];
});

export const get_contact = query((id: string): Contact | undefined => {
	const stmt = db.prepare('SELECT * FROM contacts WHERE id = ?');
	return stmt.get(id) as Contact | undefined;
});
```

## Migrations

Keep migrations in separate SQL files:

```sql
-- migrations/001_initial.sql
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  company TEXT,
  is_vip INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS interactions (
  id TEXT PRIMARY KEY,
  contact_id TEXT NOT NULL,
  type TEXT NOT NULL,
  note TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);

CREATE INDEX idx_interactions_contact_id ON interactions(contact_id);
CREATE INDEX idx_interactions_created_at ON interactions(created_at);
```

Run migrations:

```typescript
// lib/server/migrate.ts
import { db } from './db';
import { readFileSync } from 'fs';

export function migrate() {
	const migration = readFileSync(
		'migrations/001_initial.sql',
		'utf-8',
	);
	db.exec(migration);
}
```

## Best Practices

1. **Always use prepared statements** - Prevents SQL injection
2. **Use transactions** - For multiple related operations
3. **Add indexes** - On frequently queried columns
4. **Type your queries** - Define interfaces for database rows
5. **Timestamps as integers** - Use `Date.now()` for SQLite
   compatibility
6. **Boolean as integers** - SQLite uses 0/1 for true/false
7. **Foreign keys** - Enable with `PRAGMA foreign_keys = ON`
8. **IDs as UUIDs** - Use `crypto.randomUUID()` for unique IDs

## Common Patterns

### Search

```typescript
export const search_contacts = query((search: string) => {
	const stmt = db.prepare(`
    SELECT * FROM contacts
    WHERE name LIKE ? OR email LIKE ?
    ORDER BY name
  `);

	const term = `%${search}%`;
	return stmt.all(term, term);
});
```

### Pagination

```typescript
export const get_contacts_paginated = query(
	(page: number, limit: number = 20) => {
		const offset = (page - 1) * limit;

		const stmt = db.prepare(`
    SELECT * FROM contacts
    ORDER BY name
    LIMIT ? OFFSET ?
  `);

		return stmt.all(limit, offset);
	},
);
```

### Upsert

```typescript
export const upsert_contact = command(
	v.object({
		email: v.pipe(v.string(), v.email()),
		name: v.string(),
	}),
	({ email, name }) => {
		const stmt = db.prepare(`
      INSERT INTO contacts (id, email, name, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET
        name = excluded.name,
        updated_at = excluded.updated_at
    `);

		const now = Date.now();
		stmt.run(crypto.randomUUID(), email, name, now, now);
	},
);
```
