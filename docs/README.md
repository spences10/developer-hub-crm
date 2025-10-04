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

### Core Patterns

#### [remote-functions.md](./remote-functions.md)

**Read this first for server logic**

Query functions, form functions, commands, and `getRequestEvent()`
patterns.

#### [database-pattern.md](./database-pattern.md)

**Database operations**

Raw SQL queries, parameterized queries, transactions, type safety,
migrations.

#### [error-handling.md](./error-handling.md)

**Error handling & loading**

Error boundaries, await expressions, loading states, form errors.

### Authentication

#### [auth-setup.md](./auth-setup.md)

**Better Auth installation & config**

Install dependencies, configure auth, generate schema, environment
variables, helpers.

#### [auth-usage.md](./auth-usage.md)

**Auth patterns & usage**

Registration, login, logout, protected routes, component patterns,
layout guards.

### Forms

#### [forms-daisy-ui-v5.md](./forms-daisy-ui-v5.md)

**daisyUI v5 patterns (start here)**

Critical v4→v5 changes, basic structure, validation, error handling,
common mistakes.

#### [forms-inputs.md](./forms-inputs.md)

**Input types reference**

Complete guide to all input types: text, email, password, textarea,
select, checkbox, radio, file, etc.

### External Integrations

#### [integrations.md](./integrations.md)

**Third-party integrations**

GitHub contact import, API patterns, rate limits, future enhancements.

### Deployment

#### [deployment.md](./deployment.md)

**Production deployment**

ORIGIN variable (critical!), native modules, Vite SSR, Coolify/Docker,
troubleshooting.

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
7. **Type safety everywhere** - TypeScript for all database
   operations, use proper types instead of `any`
8. **Proper reactivity** - Use `refresh_key` with `{#key}` blocks,
   never `window.location.reload()`
9. **Shared utilities** - Extract reusable functions to `lib/utils/`
10. **snake_case for functions/variables** - Use snake_case naming
11. **kebab-case for file names** - Use kebab-case for all file names
12. **lang="ts" in Svelte files** - Always use TypeScript in
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
│   ├── types/
│   │   └── db.ts              # Database type definitions
│   └── utils/
│       └── date-helpers.ts    # Shared utility functions
└── routes/
    ├── (app)/                 # Protected routes layout
    │   ├── contacts/
    │   │   ├── contacts.remote.ts       # Server functions with query.batch()
    │   │   ├── +page.svelte             # Contacts list
    │   │   ├── new/
    │   │   │   └── +page.svelte         # Create contact form
    │   │   └── [id]/
    │   │       ├── +page.svelte         # Contact detail (with interactions)
    │   │       └── edit/
    │   │           └── +page.svelte     # Edit contact form
    │   ├── interactions/
    │   │   ├── interactions.remote.ts   # Interaction CRUD + batched queries
    │   │   ├── +page.svelte             # Interactions list with filters
    │   │   └── new/
    │   │       └── +page.svelte         # Log interaction form
    │   ├── follow-ups/
    │   │   ├── follow-ups.remote.ts     # Follow-up CRUD + batched queries
    │   │   ├── +page.svelte             # Follow-ups list with filters
    │   │   └── new/
    │   │       └── +page.svelte         # Create follow-up form
    │   ├── settings/
    │   │   ├── settings.remote.ts       # User preferences management
    │   │   └── +page.svelte             # Settings page (date format, etc.)
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

### Trigger re-fetch after mutations

When you need to refresh data after a mutation (create/update/delete):

1. **Use `refresh_key` with `{#key}` block** (NOT
   `window.location.reload()`)

   ```svelte
   <script lang="ts">
   	let refresh_key = $state(0);

   	async function handle_delete(id: string) {
   		await delete_item(id);
   		refresh_key++; // Triggers re-fetch
   	}
   </script>

   {#key refresh_key}
   	{#await get_items() then items}
   		<!-- Your UI -->
   	{/await}
   {/key}
   ```

2. **Never use `window.location.reload()`** - It's an anti-pattern
   that:
   - Loses scroll position
   - Clears component state
   - Provides poor UX
   - Defeats Svelte's reactivity

### Use shared utilities

For code used across multiple components:

1. Create utility files in `lib/utils/`
2. Export functions with clear names
3. Import with `$lib` alias:
   ```svelte
   import {(format_due_date, is_overdue)} from '$lib/utils/date-helpers';
   ```

**Example utilities:**

- `date-helpers.ts` - Date formatting and comparison functions
  - `format_date(date, format)` - Format dates according to user
    preference
  - `format_due_date(timestamp, format)` - Format due dates with
    "Today"/"Tomorrow" labels
  - `is_overdue(timestamp)` - Check if a date is in the past
  - Supports formats: `YYYY-MM-DD`, `MM/DD/YYYY`, `DD/MM/YYYY`
  - Get user's format preference from `get_user_preferences()` in
    `settings.remote.ts`
- Type helpers, validation utilities, formatters, etc.

### Add a feature with list/detail/create pages (like interactions)

1. **Create remote functions file** (e.g., `interactions.remote.ts`)
   - Use `query.batch()` for getting items by contact_id
   - Create `get_all_*` query for list page (no parameters)
   - Use `guarded_form` for create/update forms
   - Add redirect after successful form submission

2. **Create list page** (`+page.svelte`)
   - Import query functions
   - Use `{#await}` for data loading
   - Add filters with `$state` if needed
   - Link to create page

3. **Create form page** (`new/+page.svelte`)
   - Use `{...form_function}` spread on `<form>`
   - Support pre-fill via URL params:
     `page.url.searchParams.get('param')`
   - Use proper form patterns (see forms-pattern.md)
   - Remember: `<textarea>` doesn't use label wrapper in daisyUI v5

4. **Integrate with related pages**
   - Add section to detail pages showing related items
   - Add "Create" button with pre-filled params
   - Use batched queries to avoid N+1 problems

## Official Docs

- [Svelte 5 Docs](https://svelte.dev/docs)
- [SvelteKit Remote Functions](https://svelte.dev/docs/kit/remote-functions)
- [Better Auth](https://better-auth.com)
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
