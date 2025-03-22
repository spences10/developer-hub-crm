# Turso Database Guide

## Overview

Turso is a distributed SQLite database built on libSQL, designed for
edge computing and global applications. It provides low-latency access
to data from anywhere in the world.

## Current Implementation

Our project uses Turso with:

- LibSQL client for connection
- Drizzle ORM for database operations
- Environment variables for configuration

## Key Components

### Database Connection

```typescript
// From src/lib/server/db/index.ts
import { createClient } from '@libsql/client';

// Environment variables for connection
if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
if (!dev && !env.DATABASE_AUTH_TOKEN)
	throw new Error('DATABASE_AUTH_TOKEN is not set');

const client = createClient({
	url: env.DATABASE_URL,
	authToken: env.DATABASE_AUTH_TOKEN,
});
```

## Environment Setup

The following environment variables are required:

```
DATABASE_URL=libsql://your-database-name.turso.io
DATABASE_AUTH_TOKEN=your-auth-token
```

In development mode, you can use a local SQLite file:

```
DATABASE_URL=file:./local.db
```

## Features and Benefits

### Edge-Ready Database

- Globally distributed data
- Low-latency reads and writes
- Serverless-friendly

### SQLite Compatibility

- Full SQLite feature set
- Familiar SQL syntax
- Broad tool compatibility

### Scalability

- Scales from development to production
- Handles high read/write loads
- Replicates data globally

## Best Practices

1. **Use environment variables**: Keep connection strings and auth
   tokens in environment variables.

2. **Local development**: Use a local SQLite file for development to
   avoid network latency.

3. **Connection pooling**: Reuse the database connection across
   requests.

4. **Error handling**: Always handle database connection errors
   gracefully.

5. **Transactions**: Use transactions for operations that need to be
   atomic.

## Integration with SvelteKit

- Initialize the database connection in a server-only module
- Use hooks.server.ts to handle database connection errors
- Keep database operations in server-side code (load functions, form
  actions, API routes)

## Common Operations

### Basic Queries

```typescript
// Direct SQL execution (without Drizzle)
const result = await client.execute({
	sql: 'SELECT * FROM users WHERE username = ?',
	args: [username],
});
```

### With Drizzle ORM

```typescript
// Using Drizzle ORM (recommended approach)
const users = await db
	.select()
	.from(table.user)
	.where(eq(table.user.username, username));
```

## Limitations

- No support for certain SQLite extensions
- Limited full-text search capabilities compared to dedicated search
  engines
- Eventual consistency model for replicated data

## Resources

- [Turso Documentation](https://docs.turso.tech/)
- [LibSQL Client Documentation](https://github.com/libsql/libsql-client-ts)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
