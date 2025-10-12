# Remote Functions Deep Dive

> Based on Svelte Radio interview with Simon Holthausen (Svelte Core
> Team Lead)

This document provides a comprehensive understanding of SvelteKit
remote functions, their design rationale, and best practices.

## Why Remote Functions Exist

### Problems with Traditional Approach

#### Load Functions Issues

1. **Granularity Problem**
   - Can only reload at load function boundaries
   - Reloading partial data requires workarounds (nested layouts,
     route groups)
   - Must re-fetch everything even if only one piece changed
   - Example: Dashboard with stats + contacts - can't refresh just
     stats

2. **Collocation Problem**
   - Data loaded at top level, used 5+ components deep
   - Forces prop drilling or using `$page` store (loses type safety)
   - Hard to see what data is actually needed where

3. **Type Safety Issues**
   - Requires TypeScript "voodoo" with generated `$types` files
   - Language service complexity
   - Not straightforward TypeScript

#### Form Actions Issues

1. **Type Safety**
   - Manual string-based action paths (`action="?/create"`)
   - No automatic type inference
   - Must manually keep client and server in sync

2. **Reusability**
   - Tied to specific pages via `+page.server.ts`
   - Can't easily share form actions between pages
   - No first-class SPA-mode support

### What Remote Functions Solve

✅ **Granular data fetching** - Call queries anywhere in component
tree ✅ **Better collocation** - Data fetching near where it's used ✅
**Full type safety** - Regular TypeScript functions, no magic ✅
**Flexible refresh** - Choose what to refresh, when ✅ **Single-flight
mutations** - Refresh data in same request (performance!) ✅ **SPA
mode support** - Commands for non-progressively-enhanced scenarios

---

## The Four Types

### 1. Query - Reading Data

**Purpose**: Fetch data from server (like GET requests)

**Key Features**:

- Can be called anywhere in your app
- Automatically cached and deduplicated
- Returns object with `current`, `loading`, `error` properties
- **Cache key**: `function_id + stringified_payload`

**Example**:

```typescript
// contacts.remote.ts
export const get_contact = query(
	v.pipe(v.string(), v.minLength(1)),
	async (id) => {
		const contact = await db.query(
			'SELECT * FROM contacts WHERE id = ?',
			[id],
		);
		return contact;
	},
);
```

**Deduplication**:

```svelte
<script>
	// Called 3 times across components
	const user1 = await get_user('user-123'); // Fetches
	const user2 = await get_user('user-123'); // Uses cache!
	const user3 = await get_user('user-456'); // Different ID, fetches
</script>
```

**No need to hoist** - Use queries wherever you need them, automatic
deduplication handles it.

---

### 2. Form - Progressive Enhancement

**Purpose**: Handle form submissions that work without JavaScript

**Key Features**:

- Works without JavaScript (progressive enhancement)
- Requires schema (converts FormData to POJO)
- Can redirect or return errors
- **Default behavior**: Refreshes ALL queries on the page

**Basic Example**:

```typescript
export const create_contact = form(
	v.object({
		name: v.pipe(v.string(), v.minLength(1)),
		email: v.pipe(v.string(), v.email()),
	}),
	async (data) => {
		const id = await db.insert('contacts', data);
		redirect(303, `/contacts/${id}`);
	},
);
```

**Single-Flight Mutation** (recommended for performance):

```typescript
export const create_contact = form(schema, async (data) => {
	await db.insert('contacts', data);

	// ✅ Refresh specific query in same request (no extra round trip!)
	await get_contacts.refresh();

	return { success: true };
});
```

**Why single-flight?**

- Without: 2 round trips (mutation + refresh request)
- With: 1 round trip (mutation with embedded refresh data)
- Server calls `get_contacts()`, includes result in response
- Client updates cache automatically

---

### 3. Command - JavaScript Required

**Purpose**: Mutations that require JavaScript (no progressive
enhancement)

**Key Features**:

- Requires JavaScript enabled
- More granular than forms
- **Default behavior**: Refreshes NOTHING (must opt-in)
- Supports optimistic updates

**Basic Example**:

```typescript
export const toggle_favorite = command(
	v.pipe(v.string(), v.minLength(1)),
	async (id) => {
		await db.query(
			'UPDATE contacts SET favorite = NOT favorite WHERE id = ?',
			[id],
		);
		return { success: true };
	},
);
```

**With Server-Side Refresh**:

```typescript
export const delete_contact = command(v.string(), async (id) => {
	await db.delete('contacts', id);

	// ✅ Explicitly refresh query (commands don't refresh by default)
	await get_contacts.refresh();

	return { success: true };
});
```

**Client-Initiated Refresh**:

```typescript
// Component
await toggle_favorite(id, {
	refresh: [get_contacts, get_stats],
});
```

**Optimistic Updates**:

```typescript
await toggle_favorite(id, {
	refresh: [get_contact],
	optimistic: (contact) => ({
		...contact,
		favorite: !contact.favorite,
	}),
});
```

---

### 4. Prerender - Build Time Data

**Purpose**: Pre-render data at build time, serve as static files

**Key Features**:

- Executes at build time (not request time)
- Returns static blob served from filesystem
- Mix dynamic and static data on same page
- Granular pre-rendering (not all-or-nothing)

**Example** (Blog with static posts, dynamic comments):

```typescript
// Pre-render posts at build time
export const get_post = prerender(
	v.pipe(v.string(), v.minLength(1)),
	async (slug) => {
		// Runs at BUILD TIME
		return await db.query('SELECT * FROM posts WHERE slug = ?', [
			slug,
		]);
	},
);

// Comments fetched dynamically at request time
export const get_comments = query(
	v.pipe(v.string(), v.minLength(1)),
	async (post_id) => {
		// Runs at REQUEST TIME
		return await db.query(
			'SELECT * FROM comments WHERE post_id = ?',
			[post_id],
		);
	},
);
```

---

## Query Batching (N+1 Prevention)

**Problem**: Rendering a list where each item needs related data
causes N+1 queries.

**Example**: 20 cities, need weather for each = 20 separate requests

**Solution**: `query.batch`

```typescript
// weather.remote.ts
export const get_weather = query.batch(
	v.pipe(v.string(), v.minLength(1)), // City name
	async (cities: string[]) => {
		// Receives ARRAY of all cities in one request
		console.log(cities); // ['London', 'Paris', 'Tokyo']

		const weather_data = await fetch_weather_bulk(cities);

		// Return lookup function
		return (city: string) => weather_data[city];
	},
);
```

**Component Usage**:

```svelte
{#each cities as city}
	<!-- Looks like 3 separate calls, but batched into 1! -->
	{#await get_weather(city) then weather}
		<div>{city}: {weather.temp}°C</div>
	{/await}
{/each}
```

**When NOT to use query.batch**:

- If you're just returning a function that executes queries separately
  (defeats the purpose)
- Use regular `query()` if you don't actually need batching
- Better to be explicit than pretend to batch

---

## Refresh Strategies

### Forms: Default Refresh Everything

```typescript
export const create_contact = form(schema, async (data) => {
	await db.insert('contacts', data);
	// Default: ALL queries on page refresh automatically
});
```

### Forms: Granular Refresh (Single-Flight)

```typescript
export const create_contact = form(schema, async (data) => {
	await db.insert('contacts', data);

	// Only refresh specific queries
	await get_contacts.refresh();
	await get_stats.refresh();

	// Data included in same response (no extra round trip!)
	return { success: true };
});
```

### Commands: Manual Refresh Required

```typescript
export const delete_contact = command(v.string(), async (id) => {
	await db.delete('contacts', id);

	// ⚠️ Commands refresh NOTHING by default
	await get_contacts.refresh(); // Must explicitly refresh

	return { success: true };
});
```

### Client-Side Refresh Initiation

```typescript
// Tell command what to refresh from client
await delete_contact(id, {
	refresh: [get_contacts, get_dashboard_stats],
});
```

---

## Async Svelte Integration

Remote functions work best with **Async Svelte** (experimental flag).

### Enable in Config

```javascript
// svelte.config.js
export default {
	kit: {
		experimental: {
			remoteFunctions: true,
			async: true, // ← Add this!
		},
	},
};
```

### What Async Svelte Gives You

1. **Top-level `await`** in components
2. **Boundary components** to coordinate loading states
3. **Single loading screen** instead of multiple spinners

### Without Boundaries (Bad UX)

```svelte
<script>
	import {
		get_contacts,
		get_stats,
		get_follow_ups,
	} from './data.remote';
</script>

<!-- Three separate loading spinners! -->
{#await get_contacts() then contacts}
	<div>Loading contacts...</div>
	{contacts.length}
{/await}

{#await get_stats() then stats}
	<div>Loading stats...</div>
	{stats.total}
{/await}

{#await get_follow_ups() then follow_ups}
	<div>Loading follow-ups...</div>
	{follow_ups.length}
{/await}
```

### With Boundary (Good UX)

```svelte
<script>
	import { Boundary } from 'svelte';
	import {
		get_contacts,
		get_stats,
		get_follow_ups,
	} from './data.remote';

	// All awaits coordinate through boundary
	const contacts = await get_contacts();
	const stats = await get_stats();
	const follow_ups = await get_follow_ups();
</script>

<Boundary>
	{#snippet pending()}
		<!-- Single loading screen while ANY async work pending -->
		<div>Loading dashboard...</div>
	{/snippet}

	<!-- Main content shown when ALL async work complete -->
	<h1>Contacts: {contacts.length}</h1>
	<p>Total interactions: {stats.interactions}</p>
	<p>Pending follow-ups: {follow_ups.length}</p>
</Boundary>
```

**Benefit**: Runtime knows where nearest boundary is, coordinates all
async work, shows single loading state.

---

## Authentication Patterns

**Problem**: Remote functions aren't tied to routes (unlike load
functions).

**Solution**: Create shared authentication helpers.

### Auth Helper Pattern (Recommended)

```typescript
// lib/server/auth-helpers.ts
import { getRequestEvent, query, form, command } from '$app/server';
import { redirect } from '@sveltejs/kit';

export async function get_current_user_id(): Promise<string> {
	const event = getRequestEvent();
	const session = await auth.api.getSession({
		headers: event.request.headers,
	});

	if (!session?.user?.id) {
		redirect(302, '/login');
	}

	return session.user.id;
}

export const guarded_query = <T>(fn: () => T) => {
	return query(async () => {
		await get_current_user_id(); // Redirects if not authed
		return fn();
	});
};

export const guarded_form = <T>(
	schema: T,
	fn: (data: any) => any,
) => {
	return form(schema, async (data) => {
		await get_current_user_id(); // Redirects if not authed
		return fn(data);
	});
};

export const guarded_command = <T>(
	schema: any,
	fn: (data: T) => any,
) => {
	return command(schema, async (data: T) => {
		await get_current_user_id(); // Redirects if not authed
		return fn(data);
	});
};
```

### Usage in Remote Functions

```typescript
// contacts.remote.ts
import {
	guarded_query,
	guarded_command,
	get_current_user_id,
} from '$lib/server/auth-helpers';

// Automatically protected
export const get_contacts = guarded_query(async () => {
	const user_id = await get_current_user_id();
	return db.query('SELECT * FROM contacts WHERE user_id = ?', [
		user_id,
	]);
});

export const delete_contact = guarded_command(
	v.string(),
	async (id) => {
		const user_id = await get_current_user_id();
		await db.query(
			'DELETE FROM contacts WHERE id = ? AND user_id = ?',
			[id, user_id],
		);
		return { success: true };
	},
);
```

**Key Points**:

- Use `getRequestEvent()` to access request context
- Can call `getRequestEvent()` in helper functions (not just remote
  functions)
- Create higher-order functions for authentication
- Handle hook still runs before remote functions

---

## Function Composition

Remote functions are **just functions** - compose freely!

### Call Regular Functions from Remote Functions

```typescript
async function validate_ownership(
	user_id: string,
	contact_id: string,
) {
	// ✅ Can use getRequestEvent() in helper functions!
	const contact = await db.get('contacts', contact_id);
	if (contact.user_id !== user_id) {
		throw new Error('Unauthorized');
	}
}

export const update_contact = guarded_command(
	schema,
	async (data) => {
		const user_id = await get_current_user_id();

		// ✅ Call regular function
		await validate_ownership(user_id, data.id);

		await db.update('contacts', data.id, data);
		return { success: true };
	},
);
```

### Call Other Queries from Within Queries

```typescript
export const get_contact_with_stats = query(
	v.pipe(v.string(), v.minLength(1)),
	async (id) => {
		// ✅ Call other queries
		const contact = await get_contact(id);
		const interactions = await get_interactions(id);

		return {
			...contact,
			interaction_count: interactions.length,
		};
	},
);
```

---

## Caching & Performance

### Client-Side Cache

**Cache Key**: `remote_function_id + stringified_payload`

**Example**:

```typescript
get_contact('user-123'); // Fetches
get_contact('user-123'); // Cache hit
get_contact('user-456'); // Different ID, fetches
```

### Benefits

- No need to hoist data loading to parent
- Use queries wherever needed
- Automatic deduplication across components

### Cache Invalidation

```typescript
// Form: refreshes everything by default
export const update_contact = form(schema, async (data) => {
	await db.update('contacts', data);
	// All queries on page automatically refresh
});

// Form: granular refresh (single-flight mutation)
export const update_contact = form(schema, async (data) => {
	await db.update('contacts', data);
	await get_contacts.refresh(); // Only refresh this
});

// Command: manual refresh required
export const delete_contact = command(v.string(), async (id) => {
	await db.delete('contacts', id);
	await get_contacts.refresh(); // Must explicitly call
});
```

---

## Future Features (In Discussion)

- **Query streaming**: Live data streaming from server
- **WebSocket integration**: Bidirectional streaming
- **Advanced caching**: ISR, provider-specific optimizations (Vercel,
  Cloudflare)
- **Resource API**: SPA-mode query capabilities without server
- **Automatic batching**: All queries batched by default (design
  question)
- **`query.isolated`**: Opt-out of batching for header control

---

## Common Patterns

### Demo User Protection

```typescript
const DEMO_USER_EMAIL = 'demo@devhub.party';

async function prevent_demo_modifications() {
	const user_id = await get_current_user_id();
	const user = await db.get_user(user_id);

	if (user.email === DEMO_USER_EMAIL) {
		throw new Error('Cannot modify demo account');
	}
}

export const delete_contact = guarded_command(
	v.string(),
	async (id) => {
		await prevent_demo_modifications(); // ✅ Protect demo user

		const user_id = await get_current_user_id();
		await db.delete('contacts', id, user_id);
	},
);
```

### Ownership Verification

```typescript
export const update_contact = guarded_command(
	schema,
	async (data) => {
		const user_id = await get_current_user_id();

		// ✅ Verify ownership
		const contact = await db.get('contacts', data.id);
		if (contact.user_id !== user_id) {
			throw new Error('Unauthorized');
		}

		await db.update('contacts', data.id, data);
	},
);
```

### Transactional Operations

```typescript
export const create_interaction = guarded_form(
	schema,
	async (data) => {
		const transaction = db.transaction(() => {
			const id = crypto.randomUUID();
			const now = Date.now();

			// Insert interaction
			db.insert('interactions', { id, ...data, created_at: now });

			// Update contact's last_contacted_at
			db.update('contacts', data.contact_id, {
				last_contacted_at: now,
			});
		});

		transaction(); // Execute atomically
	},
);
```

---

## Key Takeaways

1. ✅ **Enable async flag** for Boundary components and better UX
2. ✅ **Use single-flight mutations** (call `.refresh()` in
   forms/commands)
3. ✅ **Always validate with schemas** - endpoints are public!
4. ✅ **Use auth helpers** for consistent authentication
5. ✅ **query.batch for actual batching** - or use regular `query()`
   if not batching
6. ✅ **Compose freely** - they're just functions
7. ✅ **Verify ownership** in all mutations
8. ⚠️ **Remote functions are public** - validate everything
9. ⚠️ **Not route-protected** - handle auth explicitly

---

## Resources

- [Svelte Radio: Remote Functions Episode (Transcript)](../transcript.md)
- [Svelte Summit Talk on Async Svelte](https://www.youtube.com/sveltsummit)
- [Svelt Society Remote Functions Videos](https://www.youtube.com/sveltsociety)
- [Official SvelteKit Docs (Experimental)](https://kit.svelte.dev/docs)

**Status**: Experimental feature (as of 2024) **Production Ready**:
Yes, with proper testing
