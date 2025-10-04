# Developer Hub CRM - Architecture Docs

Quick reference for LLMs working on this codebase.

## Core Patterns

This project uses modern SvelteKit + Svelte 5 patterns with minimal
boilerplate:

- **Remote Functions** (`*.remote.ts`) - Type-safe client-server
  communication
- **Batched Queries** (`query.batch()`) - Automatic request batching
  for parameterized queries
- **Raw SQL** - No ORM, direct SQLite queries with better-sqlite3
- **Better Auth** - Authentication without hooks.server.ts
- **Error Boundaries** - Graceful error handling at component level
- **Await Expressions** - Direct async/await in markup
- **Svelte 5 Runes** - `$state`, `$derived`, and `page` from
  `$app/state`

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

### [deployment.md](./deployment.md)

**Read this before deploying to production**

Covers:

- ORIGIN environment variable (critical for CSRF)
- Native module setup (better-sqlite3)
- Vite SSR configuration
- Common production issues and fixes
- Coolify/Docker deployment
- Database persistence

## Quick Start Checklist

When implementing a new feature:

1. ✅ Create `*.remote.ts` file for server logic
2. ✅ Use `query.batch()` for parameterized queries
3. ✅ Use raw SQL queries with prepared statements
4. ✅ Add error boundary in component
5. ✅ Use `await` directly in markup
6. ✅ Add type definitions for database rows
7. ✅ Use `page` from `$app/state` for route params (Svelte 5)

## Key Principles

1. **No hooks.server.ts** - Use `getRequestEvent()` in remote
   functions
2. **No +page.server.ts** - Use remote functions instead
3. **No ORM** - Raw SQL with better-sqlite3
4. **No API routes** - Remote functions handle everything
5. **Use query.batch()** - For all parameterized query functions
6. **Use $app/state** - Not $app/stores (deprecated in Svelte 5)
7. **Type safety everywhere** - TypeScript for all database operations
8. **snake_case for functions/variables** - Use snake_case naming
9. **kebab-case for file names** - Use kebab-case for all file names
10. **lang="ts" in Svelte files** - Always use TypeScript in
    components

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
│   │   ├── auth.ts            # Better Auth setup
│   │   └── auth-helpers.ts    # Auth helper functions
│   └── types/
│       └── db.ts              # Database type definitions
└── routes/
    ├── (app)/                 # Protected routes layout
    │   ├── contacts/
    │   │   ├── contacts.remote.ts       # Server functions with query.batch()
    │   │   ├── +page.svelte             # Contacts list
    │   │   ├── new/
    │   │   │   └── +page.svelte         # Create contact form
    │   │   └── [id]/
    │   │       ├── +page.svelte         # Contact detail
    │   │       └── edit/
    │   │           └── +page.svelte     # Edit contact form
    │   └── dashboard/
    │       ├── dashboard.remote.ts      # Dashboard queries
    │       └── +page.svelte             # Dashboard UI
    └── (auth)/                # Public auth routes layout
        ├── login/
        │   └── +page.svelte             # Login form
        └── register/
            └── +page.svelte             # Register form
```

## Common Tasks

### Add a new database table

1. Create migration in `migrations/`
2. Add TypeScript interface in `lib/types/db.ts`
3. Create `*.remote.ts` with queries using `query.batch()`

### Add a protected route

1. Use `guarded_query` or `guarded_form` from auth-helpers.ts
2. Wrap component in error boundary
3. Handle redirects in remote function

### Add a form

1. Create form function with valibot schema
2. Use `{...form_function}` spread in component
3. Handle errors with error boundary

### Add a query with parameters

1. Use `query.batch()` with valibot schema for validation
2. Batch database queries for efficiency
3. Return lookup function from batch handler
4. Call with parameters in component:
   `{#await get_item(id) then item}`

### Access route parameters

1. Import `page` from `$app/state` (not `$app/stores`)
2. Use `$derived()` to create reactive param:
   `const id = $derived(page.params.id)`
3. Guard with `{#if id}` before passing to queries

## Official Docs

- [Svelte 5 Docs](https://svelte.dev/docs)
- [SvelteKit Remote Functions](https://svelte.dev/docs/kit/remote-functions)
- [Better Auth](https://better-auth.com)
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
