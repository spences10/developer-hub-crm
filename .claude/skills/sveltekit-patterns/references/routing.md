# SvelteKit Routing Reference

File-based routing patterns used in devhub-crm.

## Route File Types

### +page.svelte
Client-side page component.

```svelte
<script lang="ts">
  import { get_contacts } from './contacts.remote';

  const contacts = get_contacts();
</script>

{#await contacts}
  Loading...
{:then data}
  <ul>
    {#each data as contact}
      <li>{contact.name}</li>
    {/each}
  </ul>
{/await}
```

### +server.ts
API route handler (REST endpoints).

```typescript
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, url }) => {
  const id = params.id;
  const filter = url.searchParams.get('filter');

  return json({ id, filter });
};

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  // Handle mutation
  return json({ success: true });
};
```

### *.remote.ts
Remote function definitions (RPC-style).

```typescript
import { query, form, command } from '$app/server';

export const get_data = query(async () => {
  // Server logic
});

export const save_data = form(schema, async (data) => {
  // Mutation with redirect
});

export const update_data = command(schema, async (data) => {
  // Mutation with return value
});
```

## Dynamic Routes

### [param]
Single parameter.

```
src/routes/users/[id]/+page.svelte
  → /users/123
```

### [...slug]
Catch-all parameter.

```
src/routes/docs/[...slug]/+page.svelte
  → /docs/getting-started
  → /docs/api/endpoints
```

### [[optional]]
Optional parameter.

```
src/routes/posts/[[page]]/+page.svelte
  → /posts (page = undefined)
  → /posts/2 (page = "2")
```

### @[username]
Custom pattern (used for profiles).

```
src/routes/@[username]/+page.svelte
  → /@john
  → /@jane
```

## Layout Routes

### +layout.svelte
Shared layout for all child routes.

```svelte
<!-- src/routes/dashboard/+layout.svelte -->
<script lang="ts">
  import { get_current_user } from '../auth.remote';

  const user = get_current_user();
</script>

{#await user then userData}
  {#if userData}
    <nav>Dashboard Navigation</nav>
    <slot /> <!-- Child routes render here -->
  {:else}
    <p>Not authenticated</p>
  {/if}
{/await}
```

## Route Groups

### (group)
Group routes without affecting URL structure.

```
src/routes/(app)/dashboard/+page.svelte → /dashboard
src/routes/(app)/settings/+page.svelte → /settings
src/routes/(app)/+layout.svelte → Shared layout
```

## API Patterns

### REST Endpoints

```typescript
// src/routes/api/contacts/+server.ts
import { json, error } from '@sveltejs/kit';
import { db } from '$lib/server/db';

export const GET: RequestHandler = async ({ url }) => {
  const search = url.searchParams.get('q');

  const stmt = db.prepare(`
    SELECT * FROM contacts WHERE name LIKE ?
  `);

  const contacts = stmt.all(`%${search}%`);
  return json(contacts);
};
```

### Dynamic API Routes

```typescript
// src/routes/api/contacts/[id]/+server.ts
export const GET: RequestHandler = async ({ params }) => {
  const contact = db.prepare('SELECT * FROM contacts WHERE id = ?')
    .get(params.id);

  if (!contact) {
    throw error(404, 'Contact not found');
  }

  return json(contact);
};

export const DELETE: RequestHandler = async ({ params }) => {
  db.prepare('DELETE FROM contacts WHERE id = ?').run(params.id);
  return json({ success: true });
};
```

## Examples from devhub-crm

```
src/routes/
├── (app)/                    # Authenticated app routes
│   ├── dashboard/
│   ├── contacts/
│   └── +layout.svelte        # App shell with auth check
├── (public)/                 # Public marketing routes
│   ├── about/
│   └── +layout.svelte        # Public layout
├── @[username]/              # Public profile pages
│   ├── +page.svelte
│   └── profile.remote.ts     # Profile data functions
├── api/                      # REST API endpoints
│   ├── health/+server.ts
│   └── auth/[...all]/+server.ts
└── auth.remote.ts            # Auth remote functions
```
