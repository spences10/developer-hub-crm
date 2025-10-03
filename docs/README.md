# Developer Hub CRM - Architecture Docs

Quick reference for LLMs working on this codebase.

## Core Patterns

This project uses modern SvelteKit patterns with minimal boilerplate:

- **Remote Functions** (`*.remote.ts`) - Type-safe client-server
  communication
- **Raw SQL** - No ORM, direct SQLite queries with better-sqlite3
- **Better Auth** - Authentication without hooks.server.ts
- **Error Boundaries** - Graceful error handling at component level
- **Await Expressions** - Direct async/await in markup

## Documentation Files

### [remote-functions.md](./remote-functions.md)

**Read this first if you're implementing any server logic**

Covers:

- Query functions (reading data)
- Form functions (validated submissions)
- Command functions (mutations)
- How to use `getRequestEvent()` instead of passing locals

### [auth-pattern.md](./auth-pattern.md)

**Read this for authentication implementation**

Covers:

- Three auth patterns (inline, helper, higher-order)
- Login/logout with Better Auth
- Protected routes without hooks
- Getting current user in components

### [database-pattern.md](./database-pattern.md)

**Read this for any database work**

Covers:

- Raw SQL query patterns
- Parameterized queries
- Transactions
- Type safety without ORM
- Migrations

### [error-handling.md](./error-handling.md)

**Read this for error handling and loading states**

Covers:

- Error boundaries with `<svelte:boundary>`
- Await expressions in markup
- Loading states with pending snippets
- Form error handling
- Nested boundaries

### [forms-pattern.md](./forms-pattern.md)

**Read this when creating forms**

Covers:

- daisyUI v5 form structure (changed from v4!)
- **Important CSS fix for @tailwindcss/forms plugin conflict**
- Fieldset and input patterns
- Full-width inputs (important!)
- Validation with validator class
- Common input types (text, email, password, etc.)
- Select, checkbox, radio patterns

## Quick Start Checklist

When implementing a new feature:

1. ✅ Create `*.remote.ts` file for server logic
2. ✅ Use raw SQL queries with prepared statements
3. ✅ Add error boundary in component
4. ✅ Use `await` directly in markup
5. ✅ Add type definitions for database rows

## Key Principles

1. **No hooks.server.ts** - Use `getRequestEvent()` in remote
   functions
2. **No +page.server.ts** - Use remote functions instead
3. **No ORM** - Raw SQL with better-sqlite3
4. **No API routes** - Remote functions handle everything
5. **Type safety everywhere** - TypeScript for all database operations
6. **snake_case for functions/variables** - Use snake_case naming
7. **kebab-case for file names** - Use kebab-case for all file names
8. **lang="ts" in Svelte files** - Always use TypeScript in components

## Tech Stack

- **Frontend**: SvelteKit + Svelte 5 + Tailwind v4 + daisyUI v5
- **Database**: SQLite (better-sqlite3)
- **Auth**: Better Auth
- **Validation**: Valibot
- **Hosting**: Coolify

## File Structure

```
src/
├── lib/
│   ├── server/
│   │   ├── db.ts              # Database instance
│   │   └── auth.ts            # Better Auth setup
│   └── types/
│       └── db.ts              # Database type definitions
└── routes/
    ├── contacts/
    │   ├── contacts.remote.ts # Server functions
    │   └── +page.svelte       # Component with error boundaries
    └── auth/
        ├── auth.remote.ts     # Auth server functions
        └── +page.svelte       # Auth UI
```

## Common Tasks

### Add a new database table

1. Create migration in `migrations/`
2. Add TypeScript interface in `lib/types/db.ts`
3. Create `*.remote.ts` with queries

### Add a protected route

1. Use `guarded_query` from auth-pattern.md
2. Wrap component in error boundary
3. Handle redirects in remote function

### Add a form

1. Create form function with valibot schema
2. Use `{...form_function}` spread in component
3. Handle errors with error boundary

## Official Docs

- [Svelte 5 Docs](https://svelte.dev/docs)
- [SvelteKit Remote Functions](https://svelte.dev/docs/kit/remote-functions)
- [Better Auth](https://better-auth.com)
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
