---
name: database-patterns
description:
  SQLite operations using better-sqlite3 with prepared statements. Use
  for CRUD operations, timestamps, and user-scoped queries with
  row-level security.
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

// SELECT with user_id (row-level security)
const contact = db
	.prepare('SELECT * FROM contacts WHERE id = ? AND user_id = ?')
	.get(id, user_id) as Contact | undefined;

// INSERT with nanoid and timestamps
const stmt = db.prepare(
	'INSERT INTO contacts (id, user_id, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
);
stmt.run(nanoid(), user_id, name, Date.now(), Date.now());
```

## Tables

See [references/schema.md](references/schema.md) for complete schema
with all columns, types, and relationships.

## Common Patterns

### User-Scoped Queries (Row-Level Security)

Always include `user_id` in WHERE clause:
`WHERE id = ? AND user_id = ?`. Never query by ID alone.

### Timestamp Handling

Use `Date.now()` for all timestamps (Unix epoch milliseconds). Format
for display with `date-fns`.

### ID Generation

Use `nanoid()` for all primary keys. Never use auto-increment.

## Reference Files

- [references/schema.md](references/schema.md) - Complete schema with
  all columns and types
- [references/relationships.md](references/relationships.md) - Table
  relationships and foreign keys
- [references/query-examples.md](references/query-examples.md) -
  Joins, transactions, and advanced patterns

## Notes

- better-sqlite3 is synchronous - no async/await needed
- Prepared statements are reusable - create once, run many times
- Transactions are all-or-nothing - failure rolls back all changes
- Always bind parameters (never string concatenation for SQL injection
  prevention)
- CASCADE deletes configured via foreign keys - deleting user deletes
  all their data
