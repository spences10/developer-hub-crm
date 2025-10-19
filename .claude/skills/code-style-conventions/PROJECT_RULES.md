# Project Code Rules

## Key Principles

1. **No hooks.server.ts** - Use `getRequestEvent()` in remote
   functions
2. **No +page.server.ts** - Use remote functions instead
3. **No ORM** - Raw SQL with better-sqlite3
4. **No API routes** - Remote functions handle everything
5. **Use query.batch()** - Only for actual batching (N+1 prevention),
   not all queries
6. **Use $app/state** - Not $app/stores (Svelte 5)
7. **Type safety everywhere** - TypeScript for all database operations
8. **Single-flight mutations** - Call `.refresh()` in form/command
   handlers
9. **Enable async flag** - Set `experimental: { async: true }` in
   svelte.config.js
10. **Proper reactivity** - Use `.refresh()` on queries, never
    `window.location.reload()`

## Shared Utilities Pattern

Extract reusable functions to `lib/utils/`:

```typescript
// ✅ lib/utils/date-helpers.ts
export function format_date(date: Date, format: DateFormat): string {
	// implementation
}

export function is_overdue(timestamp: number): boolean {
	// implementation
}

// ✅ Usage in components
import { format_date, is_overdue } from '$lib/utils/date-helpers';
```

## Type Definitions

**Location**: `lib/types/db.ts`

```typescript
export interface Contact {
	id: string;
	user_id: string;
	name: string;
	email: string | null;
	created_at: number;
}

export interface Interaction {
	id: string;
	contact_id: string;
	type: 'meeting' | 'call' | 'email' | 'message';
	notes: string | null;
	created_at: number;
}
```

## Remote Functions Pattern

**Location**: `src/routes/*/route-name.remote.ts`

```typescript
import { query, form, command } from '@sveltejs/kit/server';
import {
	guarded_query,
	guarded_form,
} from '$lib/server/auth-helpers';
import * as v from 'valibot';

// Query - read-only, auto-cached
export const get_contacts = guarded_query(async (user_id) => {
	return db
		.prepare('SELECT * FROM contacts WHERE user_id = ?')
		.all(user_id);
});

// Form - handles validation + submission + auto-refresh
export const create_contact = guarded_form(
	v.object({
		name: v.string(),
		email: v.optional(v.string()),
	}),
	async (data) => {
		await db.insert('contacts', { ...data, user_id });
		throw redirect('/contacts');
	},
);

// Command - explicit mutations
export const delete_contact = command(v.string(), async (id) => {
	await db.delete('contacts', id, user_id);
	await get_contacts.refresh(); // Single-flight mutation
	return { success: true };
});
```

## Component Structure

**Location**: `src/routes/(app)/feature/component-name.svelte`

```svelte
<script lang="ts">
	import { page } from '$app/state';
	import { format_date } from '$lib/utils/date-helpers';

	interface Props {
		title: string;
		items: Item[];
		date_format: DateFormat;
	}

	let { title, items, date_format }: Props = $props();

	const filtered_items = $derived(
		items.filter((item) => item.active),
	);
</script>

<div class="card bg-base-100 shadow-md">
	<div class="card-body p-4">
		<h2 class="card-title">{title}</h2>
		<!-- content -->
	</div>
</div>
```

## Svelte 5 Runes

```svelte
<!-- State -->
<script lang="ts">
  let count = $state(0);
  let items = $state<Item[]>([]);
</script>

<!-- Derived -->
<script lang="ts">
  let count = $state(5);
  const doubled = $derived(count * 2);
  const filtered = $derived.by(() => {
    return items.filter(item => item.active);
  });
</script>

<!-- Props (use interface!) -->
<script lang="ts">
  interface Props {
    name: string;
    value: number;
    disabled?: boolean;
  }
  let { name, value, disabled = false }: Props = $props();
</script>

<!-- Effects (use sparingly) -->
<script lang="ts">
  $effect(() => {
    console.log(`Count changed to ${count}`);
  });
</script>
```

## Database Queries

**Always use prepared statements with `?` placeholders:**

```typescript
✅ const stmt = db.prepare('SELECT * FROM contacts WHERE id = ?');
   const contact = stmt.get(contact_id);

✅ const stmt = db.prepare('SELECT * FROM contacts WHERE user_id = ? AND active = ?');
   const contacts = stmt.all(user_id, true);

❌ db.prepare(`SELECT * FROM contacts WHERE id = ${id}`); // SQL injection!
❌ db.prepare(`SELECT * FROM contacts WHERE user_id = '${user_id}'`); // SQL injection!
```

## Error Handling

```svelte
<script lang="ts">
	let error_message = $state<string | null>(null);
</script>

{#await some_promise}
	<div class="loading">Loading...</div>
{:then result}
	<div>{result}</div>
{:catch err}
	<div class="alert alert-error">
		{err.message}
	</div>
{/await}
```

## Form Validation with Valibot

```typescript
import * as v from 'valibot';

const contact_schema = v.object({
	name: v.pipe(
		v.string(),
		v.minLength(1, 'Name is required'),
		v.maxLength(100, 'Name is too long'),
	),
	email: v.optional(v.pipe(v.string(), v.email('Invalid email'))),
	company: v.optional(v.string()),
});
```

## Import Paths

```typescript
✅ import { format_date } from '$lib/utils/date-helpers';
✅ import { db } from '$lib/server/db';
✅ import type { Contact } from '$lib/types/db';
✅ import { ContactBook } from '$lib/icons';

❌ import { format_date } from '../../lib/utils/date-helpers';
❌ import { db } from '../../../../lib/server/db';
```

## Testing Files

**Location**: Same directory as file being tested

```
src/lib/utils/
├── date-helpers.ts
├── date-helpers.test.ts
├── contact-utils.ts
└── contact-utils.test.ts
```

**Naming**: `filename.test.ts` or `filename.spec.ts`
