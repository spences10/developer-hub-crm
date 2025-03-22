# Drizzle ORM Guide

## Overview

Drizzle ORM is a TypeScript ORM for SQL databases with a focus on type
safety. In our project, it's used with Turso (LibSQL) as the database
provider.

## Current Implementation

Our implementation uses Drizzle ORM with:

- LibSQL client for Turso database connection
- Schema definition with type inference
- Type-safe query building

## Key Components

### Database Connection

```typescript
// From src/lib/server/db/index.ts
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

const client = createClient({
	url: env.DATABASE_URL,
	authToken: env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, {
	schema,
});
```

### Schema Definition

```typescript
// From src/lib/server/db/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
});

// Type inference
export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
```

## Query Examples

### Select Queries

```typescript
// Simple select
const users = await db.select().from(table.user);

// Select with where clause
const user = await db
	.select()
	.from(table.user)
	.where(eq(table.user.username, username));

// Join query
const results = await db
	.select({
		user: { id: table.user.id, username: table.user.username },
		session: table.session,
	})
	.from(table.session)
	.innerJoin(table.user, eq(table.session.userId, table.user.id))
	.where(eq(table.session.id, sessionId));
```

### Insert Queries

```typescript
// Insert a user
await db
	.insert(table.user)
	.values({ id: userId, username, passwordHash });

// Insert a session
await db.insert(table.session).values(session);
```

### Update Queries

```typescript
// Update a session
await db
	.update(table.session)
	.set({ expiresAt: session.expiresAt })
	.where(eq(table.session.id, session.id));
```

### Delete Queries

```typescript
// Delete a session
await db.delete(table.session).where(eq(table.session.id, sessionId));
```

## Schema Migration

Drizzle provides tools for schema migrations:

```bash
# Generate migrations
npm run db:migrate

# Apply migrations to database
npm run db:push

# Open Drizzle Studio to manage database
npm run db:studio
```

## Type Safety

One of Drizzle's key features is type safety:

- Table schemas define the structure and types of your data
- `$inferSelect` and `$inferInsert` provide type inference for queries
- TypeScript errors for mismatched types or missing fields
- Autocomplete for table and column names

## Best Practices

1. **Define schemas explicitly**: Always define your schemas with
   proper types and constraints.

2. **Use type inference**: Leverage Drizzle's type inference for
   type-safe queries.

3. **Use prepared statements**: For user input, use prepared
   statements to prevent SQL injection.

4. **Transactions**: Use transactions for operations that need to be
   atomic.

5. **Schema migrations**: Use Drizzle's migration tools to manage
   schema changes.

## Integration with SvelteKit

- Database queries are typically performed in load functions or form
  actions
- Use server-side endpoints for database operations
- Keep database logic in separate files from UI components
