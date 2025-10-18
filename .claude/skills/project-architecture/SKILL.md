---
name: DevHub CRM Architecture
description:
  Overview of DevHub CRM project structure, conventions, and tech
  stack. Use when starting work on this codebase, understanding
  project organization, or determining where to add features.
---

# DevHub CRM Architecture

Developer CRM built with SvelteKit + Svelte 5 + SQLite for managing
professional relationships.

## Tech Stack

- **Frontend**: SvelteKit + Svelte 5 (runes) + Tailwind v4 + daisyUI
  v5
- **Backend**: Remote Functions (no API routes)
- **Database**: SQLite + better-sqlite3 (raw SQL, no ORM)
- **Auth**: Better Auth (no hooks.server.ts)
- **Validation**: Valibot

## Naming Conventions

- **Files**: `kebab-case` (contact-details-card.svelte)
- **Functions/Variables**: `snake_case` (get_contacts, user_id)
- **Types**: `PascalCase` (Contact, Interaction)
- **Remote functions**: `*.remote.ts` in route directories

## File Structure

```
src/
├── lib/
│   ├── server/          # Server-only (db, auth, github)
│   ├── types/           # Type definitions
│   ├── utils/           # Shared utilities
│   └── config/          # App configuration
└── routes/
    ├── (app)/           # Protected routes (requires auth)
    │   ├── dashboard/
    │   ├── contacts/
    │   │   ├── contacts.remote.ts
    │   │   ├── +page.svelte
    │   │   ├── new/+page.svelte
    │   │   └── [id]/+page.svelte
    │   ├── interactions/
    │   ├── follow-ups/
    │   └── settings/
    └── (auth)/          # Public auth routes
        ├── login/
        └── register/
```

## Key Features

1. **Contact Management** - CRUD with VIP support, GitHub import
2. **Interaction Tracking** - Log meetings, calls, emails, messages
3. **Follow-ups** - Schedule with overdue alerts
4. **Tags** - Organize contacts with colored tags
5. **GitHub Integration** - Import from GitHub profiles
6. **Public Profiles** - Shareable profiles with QR codes
7. **User Preferences** - Themes, date formats, defaults

## Core Patterns

### Remote Functions (No API Routes)

Use `*.remote.ts` files instead of `+page.server.ts` or `+server.ts`:

```typescript
// contacts.remote.ts
export const get_contacts = query(async () => {
	/* ... */
});
export const create_contact = form(schema, async (data) => {
	/* ... */
});
export const delete_contact = command(v.string(), async (id) => {
	/* ... */
});
```

### Raw SQL (No ORM)

```typescript
import { db } from '$lib/server/db';
const stmt = db.prepare('SELECT * FROM contacts WHERE user_id = ?');
const contacts = stmt.all(user_id);
```

### Authentication

Use guarded helpers from `lib/server/auth-helpers.ts`:

```typescript
export const get_contacts = guarded_query(async (user_id) => {
	/* ... */
});
```

### Svelte 5 State

```svelte
<script lang="ts">
	import { page } from '$app/state'; // Not $app/stores
	let count = $state(0);
	const doubled = $derived(count * 2);
</script>
```

## Database Schema

Main tables:

- `user`, `session`, `account` - Better Auth
- `contacts` - Contact information
- `interactions` - Communication logs
- `follow_ups` - Scheduled follow-ups
- `tags`, `contact_tags` - Tagging system
- `user_profiles` - Public developer profiles
- `github_following_cache` - GitHub data cache

## Required Config

```javascript
// svelte.config.js
export default {
	kit: {
		experimental: {
			remoteFunctions: true,
			async: true,
		},
	},
};
```

## Anti-Patterns (Avoid)

- ❌ `+page.server.ts` - Use remote functions
- ❌ `+server.ts` - Use remote functions
- ❌ `hooks.server.ts` - Use getRequestEvent()
- ❌ ORMs - Use raw SQL
- ❌ `$app/stores` - Use `$app/state`
- ❌ `window.location.reload()` - Use `.refresh()`

## Documentation

All docs in `docs/` directory. Key files:

- `docs/README.md` - Documentation index
- `docs/remote-functions.md` - Remote functions guide
- `docs/database-pattern.md` - Database patterns
- `docs/forms-daisy-ui-v5.md` - Form patterns
