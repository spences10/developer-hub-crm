---
name: database-patterns
description: SQLite operations using better-sqlite3 with prepared statements. Use for CRUD operations, timestamps, and user-scoped queries with row-level security.
---

# Database Patterns

## Core Principles

- Use prepared statements for all queries
- Generate IDs with nanoid()
- Store timestamps as Unix epoch (Date.now())
- Always include user_id for row-level security
- Use transactions for multi-table operations

## Quick Start

```typescript
import { db } from '$lib/server/db';
import { nanoid } from 'nanoid';

// SELECT single row
const stmt = db.prepare('SELECT * FROM contacts WHERE id = ? AND user_id = ?');
const contact = stmt.get(id, user_id) as Contact | undefined;

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
const stmt = db.prepare('DELETE FROM contacts WHERE id = ? AND user_id = ?');
stmt.run(id, user_id);
```

## Tables

See [references/schema.md](references/schema.md) for complete schema with all columns, types, and relationships.

## Common Patterns

### User-Scoped Queries (Row-Level Security)

Always include user_id in WHERE clause:

```typescript
// ✅ Correct - includes user_id
const stmt = db.prepare('SELECT * FROM contacts WHERE id = ? AND user_id = ?');
const contact = stmt.get(id, user_id);

// ❌ Wrong - missing user_id (security issue)
const stmt = db.prepare('SELECT * FROM contacts WHERE id = ?');
const contact = stmt.get(id);
```

For joins, transactions, and advanced patterns, see [references/query-examples.md](references/query-examples.md).

## Timestamp Handling

All timestamps use Unix epoch milliseconds:

```typescript
const now = Date.now(); // e.g., 1697654400000
const created_at = now;
const updated_at = now;

// Display: format with date-fns
import { format } from 'date-fns';
format(created_at, 'MMM dd, yyyy'); // "Oct 19, 2024"
```

## ID Generation

Use nanoid for all primary keys:

```typescript
import { nanoid } from 'nanoid';

const id = nanoid(); // e.g., "V1StGXR8_Z5jdHi6B-myT"
```

## Reference Files

- [references/schema.md](references/schema.md) - Complete schema with all columns and types
- [references/relationships.md](references/relationships.md) - Table relationships and foreign keys
- [references/query-examples.md](references/query-examples.md) - Joins, transactions, and advanced patterns

## Notes

- better-sqlite3 is synchronous - no async/await needed
- Prepared statements are reusable - create once, run many times
- Transactions are all-or-nothing - failure rolls back all changes
- Always bind parameters (never string concatenation for SQL injection prevention)
- CASCADE deletes configured via foreign keys - deleting user deletes all their data
