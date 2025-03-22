# Drizzle Schema Implementation Guide

## Overview

This guide outlines how to implement the database schema for our
Developer Hub CRM using Drizzle ORM with Turso (SQLite). We'll follow
our data model as defined in the plan.md file.

## Current Schema Implementation

We have implemented a complete schema with the following tables:

```typescript
// From src/lib/server/db/schema.ts
// User and session tables for authentication
export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	...timestamps,
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
});

// Contacts table for managing developer contacts
export const contact = sqliteTable('contact', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	name: text('name').notNull(),
	relationship: text('relationship'),
	birthday: integer('birthday', { mode: 'timestamp' }),
	industry: text('industry'),
	location: text('location'),
	vip: integer('vip', { mode: 'boolean' }).notNull().default(sql`0`),
	lastUpdate: integer('last_update', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`),
	lastContacted: integer('last_contacted', { mode: 'timestamp' }),
	status: text('status').notNull().default('active'),
	...timestamps,
});

// Additional tables for VIP features and interaction tracking
export const interaction = sqliteTable('interaction', { /* fields */ });
export const background = sqliteTable('background', { /* fields */ });
export const contactInfo = sqliteTable('contact_info', { /* fields */ });
```

## Schema Design Principles

1. **Timestamps**: All tables include `created_at` and `updated_at` fields using a reusable timestamps helper.
2. **Foreign Keys**: Tables maintain proper relationships with foreign key constraints.
3. **Type Safety**: We use Drizzle's type inference for compile-time type checking.
4. **Boolean Fields**: For SQLite, boolean values are stored as integers using `{ mode: 'boolean' }`.

## Database Schema Components

### Timestamps Helper

```typescript
const timestamps = {
	created_at: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`),
	updated_at: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`),
};
```

### Type Inference

```typescript
// Type inference for select operations
export type User = typeof user.$inferSelect;
export type Contact = typeof contact.$inferSelect;

// Type inference for insert operations
export type NewUser = typeof user.$inferInsert;
export type NewContact = typeof contact.$inferInsert;
```

## Database Management

### Available Scripts

Our project includes the following database-related scripts in package.json:

```json
"scripts": {
  "db:generate": "drizzle-kit generate:sqlite",
  "db:migrate": "node -r dotenv/config src/lib/server/db/migrate.js",
  "db:studio": "drizzle-kit studio"
}
```

### Drizzle Configuration

The database configuration is defined in `drizzle.config.ts`:

```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/server/db/schema.ts',
	out: './src/lib/server/db/migrations',
	driver: 'libsql',
	dbCredentials: {
		url: process.env.DATABASE_URL || 'file:./local.db',
	},
} satisfies Config;
```

## Working with the Database

### Direct Schema Changes (Development)

During development, you can push schema changes directly to the database:

```bash
npm run db:generate
npm run db:migrate
```

This will update your database schema without creating migration files.

### Migration-based Changes (Production)

For production environments, use the migration workflow:

1. Generate migration files:
   ```bash
   npm run db:generate
   ```

2. Apply migrations:
   ```bash
   npm run db:migrate
   ```

### Using Drizzle Studio

Drizzle Studio provides a visual interface to manage your database:

```bash
npm run db:studio
```

This will start a local web server (typically at http://localhost:4983) where you can:

- Browse all tables and their data
- Perform CRUD operations through the UI
- Filter and search data
- Visualize relationships between tables
- Execute custom SQL queries

Drizzle Studio is particularly useful for:
- Debugging data issues
- Quick data entry during development
- Verifying schema changes
- Understanding table relationships

## Best Practices

1. **Schema Changes**: Always update the schema.ts file first, then apply changes to the database.

2. **Type Safety**: Use the generated types (e.g., `User`, `NewUser`) throughout your application.

3. **Migrations**: For production, always use migrations rather than direct schema pushes.

4. **Validation**: Implement validation before inserting or updating data.

5. **Transactions**: Use transactions for operations that modify multiple tables.

## Next Steps

With our schema implemented, we'll now:

1. Create repositories or services for each entity to handle CRUD operations
2. Implement form actions in SvelteKit for database operations
3. Create UI components for interacting with the data
4. Set up proper error handling and validation
