---
name: SQLite Database Pattern
description:
  Guide for database operations using better-sqlite3 in this project.
  Use when writing SQL queries, performing CRUD operations, or working
  with the SQLite database. No ORM - raw SQL only.
---

# SQLite Database Pattern

## Quick Start

```typescript
import { db } from '$lib/server/db';
import { nanoid } from 'nanoid';

// SELECT single row
const stmt = db.prepare('SELECT * FROM contacts WHERE id = ?');
const contact = stmt.get(id) as Contact | undefined;

// SELECT multiple rows
const stmt = db.prepare('SELECT * FROM contacts WHERE user_id = ?');
const contacts = stmt.all(user_id) as Contact[];

// INSERT
const stmt = db.prepare(`
  INSERT INTO contacts (id, user_id, name, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?)
`);
const id = nanoid();
const now = Date.now();
stmt.run(id, user_id, name, now, now);

// UPDATE
const stmt = db.prepare(`
  UPDATE contacts SET name = ?, updated_at = ? WHERE id = ? AND user_id = ?
`);
stmt.run(name, Date.now(), id, user_id);

// DELETE
const stmt = db.prepare(
	'DELETE FROM contacts WHERE id = ? AND user_id = ?',
);
stmt.run(id, user_id);
```

## Key Conventions

- **Tables**: `snake_case` plural (contacts, follow_ups)
- **Columns**: `snake_case` (user_id, created_at)
- **IDs**: nanoid() strings
- **Timestamps**: Integer milliseconds (Date.now())
- **Booleans**: Integer 0/1 (is_vip, completed)
- **Foreign keys**: `{table}_id` (contact_id, user_id)

## Booleans

SQLite stores booleans as 0/1:

```typescript
// Write
const is_vip = data.is_vip ? 1 : 0;
stmt.run(id, name, is_vip);

// Read
const contact = stmt.get(id) as Contact;
const is_vip_bool = Boolean(contact.is_vip);
```

## Type Safety

Define interfaces in `lib/types/db.ts`:

```typescript
export interface Contact {
	id: string;
	user_id: string;
	name: string;
	is_vip: number; // 0 or 1
	created_at: number;
	updated_at: number;
}
```

Use with queries: `stmt.get(id) as Contact | undefined`

For detailed patterns (JOINs, transactions, search, pagination), see
[QUERIES.md](QUERIES.md).
