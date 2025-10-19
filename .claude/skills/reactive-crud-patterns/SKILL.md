---
name: Reactive CRUD Pattern
description:
  Implement CRUD operations with instant UI updates using separate
  queries and `.refresh()`. Use when adding, updating, or deleting
  data where the UI should update without a page refresh. Critical!
  Query must NOT be nested in another object's await block for
  reactivity to work properly.
---

# Reactive CRUD Pattern

When you perform CRUD operations, users expect immediate UI feedback.
This skill documents the pattern that makes it work reliably.

## The Core Problem

When you delete or add data, the UI doesn't update automatically. You
either:

1. See stale data until you refresh the page
2. Or data updates but the UI doesn't reflect it

**Root cause:** Nested data structures in await blocks don't properly
trigger reactivity when `.refresh()` is called.

## The Working Pattern ✅

Use **separate queries** with `{#await}` blocks:

```svelte
<script lang="ts">
  // ✅ SEPARATE query, not nested
  const my_data = get_my_data();
  const other_data = get_other_data();
</script>

{#await my_data then data}
  <Component
    {data}
    on_add={async (item) => {
      await add_item(item);
      my_data.refresh();  // This works!
    }}
    on_delete={async (id) => {
      await delete_item(id);
      my_data.refresh();  // This works!
    }}
  />
{/await}

{#await other_data then data}
  {/* other content */}
{/await}
```

**Why it works:**

- `my_data` is a top-level variable that can be refreshed
- `{#await}` creates a reactive dependency on `my_data`
- When `.refresh()` is called, it creates a new promise
- This new promise triggers the `{#await}` block to re-evaluate
- Component receives updated data and re-renders

## The Anti-Pattern ❌

Don't nest queries in other data structures:

```svelte
<script lang="ts">
  // ❌ WRONG: query is nested in derived state
  const contact_query = $derived(
    contact_id ? get_contact(contact_id) : null
  );
</script>

{#await contact_query.current then contact}
  <Component
    social_links={contact.social_links}  // ❌ Nested property
    on_delete={async (link_id) => {
      await delete_social_link(link_id);
      contact_query?.refresh();  // Doesn't properly update nested data
    }}
  />
{/await}
```

**Why it fails:**

- Query is nested inside `$derived()`
- Nested data (`contact.social_links`) is a snapshot
- Refreshing parent doesn't reliably update child properties
- UI stays stale or shows incomplete updates

## When to Use This Pattern

Use separate queries (reactive CRUD) when:

- You're implementing Create, Update, or Delete operations
- You need instant UI feedback without page refresh
- Data affects what's currently visible on screen
- Multiple users might edit the same resource (need fresh data)

Examples:

- ✅ Social links manager (add/delete links)
- ✅ Contact list (add/delete contacts)
- ✅ Tags on contact (add/remove tags)
- ✅ Settings (update profile fields)

## Real Example: Profile Page

```svelte
<script lang="ts">
  // Get separate queries for independent data
  const profile = get_user_profile();
  const social_links = get_user_social_links();
  const auth_methods = get_connected_auth_methods();
</script>

<!-- Profile section -->
{#await profile then profile_data}
  <input
    value={profile_data.name}
    onblur={(e) => update_name(e.target.value)}
  />
{/await}

<!-- Social links - SEPARATE query -->
{#await social_links then links}
  <SocialLinksManager
    social_links={links || []}
    on_add={async (platform, url) => {
      await add_user_social_link({ platform, url });
      social_links.refresh();  // ✅ Instant update
    }}
    on_delete={async (link_id) => {
      await delete_user_social_link(link_id);
      social_links.refresh();  // ✅ Instant update
    }}
  />
{/await}

<!-- Auth methods - SEPARATE query -->
{#await auth_methods then methods}
  {/* auth UI */}
{/await}
```

**Result:** When you delete a social link, it immediately disappears
from the list without any page refresh.

## Key Rules

1. **Query Independence**: Each data type gets its own query function

   ```svelte
   const social_links = get_user_social_links(); // ✅ Direct query
   const contact_query = get_contact(id); // ✅ Direct query
   ```

2. **Await at Top Level**: Wrap the component that mutates data

   ```svelte
   {#await my_data then data}
   	<Component {data} on_mutate={refresh_handler} />
   {/await}
   ```

3. **Direct Refresh**: Call `.refresh()` directly on the query

   ```svelte
   my_data.refresh(); // ✅ Correct parent_query.refresh(); // ❌
   Might not work if my_data is nested
   ```

4. **Multiple Mutations**: Refresh only affected queries
   ```svelte
   on_add={async (item) => {
   	await add_item(item);
   	items.refresh(); // Only refresh items, not entire contact
   }}
   ```

## From Remote Functions

Remember that SvelteKit remote functions allow "à la carte" data
fetching:

- **`query()`**: Fetch-only, can be called any time, multiple times
- **`command()`**: Mutation with no automatic refresh
- **`.refresh()`**: Manually refresh a query

This design means you can organize queries independently:

```typescript
// ✅ Good organization
export const get_user_social_links = query(/* ... */);
export const get_user_profile = query(/* ... */);
export const add_user_social_link = command(/* ... */);
export const delete_user_social_link = command(/* ... */);
```

Then in components:

```svelte
const social_links = get_user_social_links(); const profile =
get_user_profile();
```

Each query is independent and can be refreshed separately.

## Common Mistakes

| ❌ Problem                             | ✅ Solution                           |
| -------------------------------------- | ------------------------------------- |
| Nested query in another query          | Extract to separate query variable    |
| Refreshing parent to update child      | Refresh the specific child query      |
| Using `$derived()` for query result    | Use direct query call in component    |
| Forgetting `.refresh()` after mutation | Always call refresh on affected query |
| Mixing nested and separate queries     | Be consistent within a component      |

## See Also

- [SvelteKit Remote Functions skill](../sveltekit-remote-functions/SKILL.md) -
  Remote function basics
- [PATTERNS.md](PATTERNS.md) - Detailed examples with before/after
