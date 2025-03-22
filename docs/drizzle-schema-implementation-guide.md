# Drizzle Schema Implementation Guide

## Overview

This guide outlines how to implement the database schema for our
Developer Hub CRM using Drizzle ORM with Turso (SQLite). We'll follow
our data model as defined in the plan.md file.

## Current Schema

Currently, we have implemented the following tables:

```typescript
// From src/lib/server/db/schema.ts
export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
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
```

## Implementing the Full Schema

### Step 1: Import Required Drizzle Components

```typescript
import {
	sqliteTable,
	text,
	integer,
	real,
	blob,
} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
```

### Step 2: Define Timestamp Helper Functions

```typescript
// Helper for created_at and updated_at fields
const timestamps = {
	created_at: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`),
	updated_at: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`),
};
```

### Step 3: Complete the Schema Implementation

Here's the full schema implementation based on our plan:

```typescript
// src/lib/server/db/schema.ts
import {
	sqliteTable,
	text,
	integer,
	real,
	blob,
} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Helper for created_at and updated_at fields
const timestamps = {
	created_at: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`),
	updated_at: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`),
};

// Users table
export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	...timestamps,
});

// Sessions table
export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
});

// Contacts table
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
	vip: integer('vip', { mode: 'boolean' }).notNull().default(0),
	lastUpdate: integer('last_update', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`),
	lastContacted: integer('last_contacted', { mode: 'timestamp' }),
	status: text('status').notNull().default('active'),
	...timestamps,
});

// Interactions table
export const interaction = sqliteTable('interaction', {
	id: text('id').primaryKey(),
	contactId: text('contact_id')
		.notNull()
		.references(() => contact.id),
	type: text('type').notNull(),
	date: integer('date', { mode: 'timestamp' }).notNull(),
	notes: text('notes'),
	...timestamps,
});

// Background table (for VIPs)
export const background = sqliteTable('background', {
	id: text('id').primaryKey(),
	contactId: text('contact_id')
		.notNull()
		.references(() => contact.id),
	family: text('family'),
	company: text('company'),
	likesDislikes: text('likes_dislikes'),
	miscNotes: text('misc_notes'),
	...timestamps,
});

// ContactInfo table (for VIPs)
export const contactInfo = sqliteTable('contact_info', {
	id: text('id').primaryKey(),
	contactId: text('contact_id')
		.notNull()
		.references(() => contact.id),
	mainApp: text('main_app'),
	email: text('email'),
	phoneNumber: text('phone_number'),
	socialLinks: text('social_links'), // JSON stored as TEXT
	...timestamps,
});

// Type inference
export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Contact = typeof contact.$inferSelect;
export type Interaction = typeof interaction.$inferSelect;
export type Background = typeof background.$inferSelect;
export type ContactInfo = typeof contactInfo.$inferSelect;

// Insert types
export type NewUser = typeof user.$inferInsert;
export type NewSession = typeof session.$inferInsert;
export type NewContact = typeof contact.$inferInsert;
export type NewInteraction = typeof interaction.$inferInsert;
export type NewBackground = typeof background.$inferInsert;
export type NewContactInfo = typeof contactInfo.$inferInsert;
```

## Setting Up Migrations

### Step 1: Install Drizzle Kit

```bash
npm install -D drizzle-kit
```

### Step 2: Create Migration Script in package.json

```json
"scripts": {
  "db:generate": "drizzle-kit generate:sqlite",
  "db:migrate": "node -r dotenv/config src/lib/server/db/migrate.js",
  "db:studio": "drizzle-kit studio"
}
```

### Step 3: Create drizzle.config.ts

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

### Step 4: Create Migration Runner

```typescript
// src/lib/server/db/migrate.js
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';

const client = createClient({
	url: process.env.DATABASE_URL || 'file:./local.db',
	authToken: process.env.DATABASE_AUTH_TOKEN,
});

const db = drizzle(client);

async function main() {
	try {
		console.log('Running migrations...');
		await migrate(db, {
			migrationsFolder: './src/lib/server/db/migrations',
		});
		console.log('Migrations completed successfully');
		process.exit(0);
	} catch (error) {
		console.error('Error performing migrations:', error);
		process.exit(1);
	}
}

main();
```

## Running Migrations

To generate and apply migrations:

1. Generate migration files:

   ```bash
   npm run db:generate
   ```

2. Apply migrations to the database:

   ```bash
   npm run db:migrate
   ```

3. Explore your database with Drizzle Studio:
   ```bash
   npm run db:studio
   ```

## Best Practices

1. **Use Type Inference**: Always use the `$inferSelect` and
   `$inferInsert` types for type safety.

2. **Timestamps**: Use the timestamps helper for consistent created_at
   and updated_at fields.

3. **Foreign Keys**: Always define proper foreign key relationships
   between tables.

4. **Migrations**: Generate and apply migrations for any schema
   changes rather than modifying the database directly.

5. **Validation**: Implement validation before inserting or updating
   data in the database.

## Next Steps

Once the schema is implemented, we'll need to:

1. Create repositories or services for each entity to handle CRUD
   operations
2. Implement form actions in SvelteKit for database operations
3. Create UI components for interacting with the data
4. Set up proper error handling and validation
