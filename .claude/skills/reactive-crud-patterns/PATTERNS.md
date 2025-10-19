# Reactive CRUD Patterns - Detailed Examples

## Pattern 1: Social Links Manager (Working Example)

### Profile Page ✅ (CORRECT)

**Location:** `src/routes/(app)/profile/+page.svelte`

```svelte
<script lang="ts">
	import SocialLinksManager from '$lib/components/social-links-manager.svelte';
	import {
		add_user_social_link,
		delete_user_social_link,
		get_user_social_links,
	} from './profile.remote';

	// ✅ SEPARATE query - not nested in anything
	const social_links = get_user_social_links();
</script>

<!-- Social Links Section -->
<div class="card bg-base-100 shadow-xl">
	<div class="card-body">
		<h2 class="card-title">Social Links</h2>
		<p class="text-sm opacity-70">
			Add links to your social media profiles
		</p>

		{#await social_links then links}
			<SocialLinksManager
				social_links={links || []}
				on_add={async (platform, url) => {
					await add_user_social_link({ platform, url });
					social_links.refresh(); // ✅ Direct refresh - WORKS!
				}}
				on_delete={async (link_id) => {
					await delete_user_social_link(link_id);
					social_links.refresh(); // ✅ Direct refresh - WORKS!
				}}
			/>
		{/await}
	</div>
</div>
```

**Result:** Instant UI update when adding/deleting social links.

---

### Contact Edit Page ❌ (INCORRECT)

**Location:** `src/routes/(app)/contacts/[id]/edit/+page.svelte`

```svelte
<script lang="ts">
	import { page } from '$app/state';
	import SocialLinksManager from '$lib/components/social-links-manager.svelte';
	import {
		add_social_link,
		delete_social_link,
		get_contact,
	} from '../../contacts.remote';

	const contact_id = $derived(page.params.id);
	// ❌ PROBLEM: Query is nested in $derived()
	const contact_query = $derived(
		contact_id ? get_contact(contact_id) : null,
	);
</script>

{#await contact_query.current then contact}
	<!-- ❌ PROBLEM: social_links is nested property, gets stale -->
	<SocialLinksManager
		social_links={contact.social_links || []}
		on_add={async (platform, url) => {
			await add_social_link({
				contact_id: contact.id,
				platform,
				url,
			});
			contact_query?.refresh(); // ❌ Doesn't update nested social_links
		}}
		on_delete={async (link_id) => {
			await delete_social_link(link_id);
			contact_query?.refresh(); // ❌ Doesn't update nested social_links
		}}
	/>
{/await}
```

**Problem:** Need to refresh page to see changes in social links.

---

## How to Fix Pattern 1: Separate the Query

### Contact Edit Page ✅ (FIXED)

Extract social links to a separate query:

```svelte
<script lang="ts">
	import { page } from '$app/state';
	import SocialLinksManager from '$lib/components/social-links-manager.svelte';
	import {
		add_social_link,
		delete_social_link,
		get_contact,
		get_social_links, // ✅ NEW: Import separate query
	} from '../../contacts.remote';

	const contact_id = $derived(page.params.id);
	const contact_query = $derived(
		contact_id ? get_contact(contact_id) : null,
	);

	// ✅ NEW: Separate query for social links
	const social_links_query = $derived(
		contact_id ? get_social_links(contact_id) : null,
	);
</script>

{#await contact_query.current then contact}
	<!-- Other contact fields -->
{/await}

<!-- ✅ SEPARATE await block for social links -->
{#if social_links_query}
	{#await social_links_query then links}
		<SocialLinksManager
			social_links={links || []}
			on_add={async (platform, url) => {
				await add_social_link({
					contact_id: contact.id,
					platform,
					url,
				});
				social_links_query.refresh(); // ✅ Direct refresh - WORKS!
			}}
			on_delete={async (link_id) => {
				await delete_social_link(link_id);
				social_links_query.refresh(); // ✅ Direct refresh - WORKS!
			}}
		/>
	{/await}
{/if}
```

**Result:** Instant UI update when adding/deleting social links on
contact.

---

## Pattern 2: Multiple Independent CRUD Operations

### Good Structure

When a page has multiple independent data sets that need CRUD
operations:

```svelte
<script lang="ts">
	const contacts = get_contacts(); // ✅ Separate query
	const tags = get_tags(); // ✅ Separate query
	const templates = get_templates(); // ✅ Separate query
</script>

<!-- Contacts Section -->
{#await contacts then contact_list}
	<ContactManager
		{contact_list}
		on_add={async (contact) => {
			await add_contact(contact);
			contacts.refresh(); // ✅ Only refresh contacts
		}}
		on_delete={async (id) => {
			await delete_contact(id);
			contacts.refresh();
		}}
	/>
{/await}

<!-- Tags Section -->
{#await tags then tag_list}
	<TagManager
		{tag_list}
		on_add={async (tag) => {
			await add_tag(tag);
			tags.refresh(); // ✅ Only refresh tags
		}}
	/>
{/await}

<!-- Templates Section -->
{#await templates then template_list}
	<TemplateManager
		{template_list}
		on_create={async (template) => {
			await create_template(template);
			templates.refresh(); // ✅ Only refresh templates
		}}
	/>
{/await}
```

**Benefits:**

- Each section updates independently
- No unnecessary refreshes of unrelated data
- Efficient network usage

---

## Pattern 3: Parent-Child Relationships

### Scenario: Contact with Related Social Links

```svelte
<script lang="ts">
	import { page } from '$app/state';
	import {
		get_contact,
		get_social_links,
		add_social_link,
		delete_social_link,
		update_contact,
	} from './contacts.remote';

	const contact_id = $derived(page.params.id);

	// ✅ Parent query (contact info)
	const contact_query = $derived(
		contact_id ? get_contact(contact_id) : null,
	);

	// ✅ Child query (social links) - SEPARATE
	const social_links_query = $derived(
		contact_id ? get_social_links(contact_id) : null,
	);
</script>

<!-- Contact Details -->
{#if contact_query}
	{#await contact_query.current then contact}
		<div class="card">
			<div class="card-body">
				<h1>{contact.name}</h1>
				<input
					value={contact.email}
					onblur={(e) => {
						update_contact({
							id: contact.id,
							email: e.target.value,
						});
						contact_query.refresh(); // Refresh contact info only
					}}
				/>
			</div>
		</div>
	{/await}
{/if}

<!-- Social Links - SEPARATE SECTION -->
{#if social_links_query}
	{#await social_links_query then links}
		<SocialLinksManager
			social_links={links}
			on_add={async (platform, url) => {
				await add_social_link({
					contact_id,
					platform,
					url,
				});
				social_links_query.refresh(); // Only refresh links, not contact
			}}
			on_delete={async (id) => {
				await delete_social_link(id);
				social_links_query.refresh(); // Only refresh links, not contact
			}}
		/>
	{/await}
{/if}
```

**Key point:** Child data has its own query that's refreshed
independently.

---

## Pattern 4: Conditional CRUD Operations

### With Loading States

```svelte
<script lang="ts">
	const items = get_items();

	let is_loading = $state(false);
</script>

{#await items then item_list}
	<div>
		{#each item_list as item}
			<div class="flex items-center justify-between">
				<span>{item.name}</span>
				<button
					disabled={is_loading}
					onclick={async () => {
						is_loading = true;
						try {
							await delete_item(item.id);
							items.refresh();
						} catch (error) {
							console.error('Failed to delete:', error);
						} finally {
							is_loading = false;
						}
					}}
				>
					{is_loading ? 'Deleting...' : 'Delete'}
				</button>
			</div>
		{/each}
	</div>
{/await}
```

---

## Pattern 5: Multiple Mutations in One Operation

Sometimes you need to update multiple related queries from a single
action:

```svelte
<script lang="ts">
	const contacts = get_contacts();
	const stats = get_contact_stats();
</script>

{#await contacts then contact_list}
	<Button
		onclick={async () => {
			await delete_all_contacts();

			// ✅ Refresh both affected queries
			await contacts.refresh();
			await stats.refresh();
		}}
	>
		Clear All
	</Button>
{/await}
```

---

## Remote Function Implementation

When creating the remote functions, ensure proper structure:

```typescript
// ✅ GOOD: Independent queries

export const get_user_social_links = query(
  async (): Promise<UserSocialLink[]> => {
    const user_id = await get_current_user_id();
    const stmt = db.prepare(
      'SELECT id, platform, url FROM user_social_links WHERE user_id = ? ORDER BY created_at'
    );
    return stmt.all(user_id) as UserSocialLink[];
  }
);

export const add_user_social_link = guarded_command(
  v.object({
    platform: v.string(),
    url: v.pipe(v.string(), v.url()),
  }),
  async (data) => {
    const user_id = await get_current_user_id();
    const id = crypto.randomUUID();
    db.prepare(
      'INSERT INTO user_social_links (id, user_id, platform, url, created_at) VALUES (?, ?, ?, ?, ?)'
    ).run(id, user_id, data.platform, data.url, Date.now());
    return { success: true };
  }
);

export const delete_user_social_link = guarded_command(
  v.string(),
  async (link_id) => {
    const user_id = await get_current_user_id();
    const link = db
      .prepare('SELECT user_id FROM user_social_links WHERE id = ?')
      .get(link_id);
    if (!link || link.user_id !== user_id) {
      throw new Error('Unauthorized');
    }
    db.prepare('DELETE FROM user_social_links WHERE id = ?').run(link_id);
    return { success: true };
  }
);
```

**Key points:**

- Each remote function has a single responsibility
- Queries can be called independently
- No nested data in query responses (flat structure)
- Commands don't auto-refresh (component controls it)

---

## Checklist for Reactive CRUD

- [ ] Query is **not nested** in another await block
- [ ] Query is **top-level** component variable
- [ ] Component wraps mutation handlers in `{#await}`
- [ ] Component calls `.refresh()` on the **specific query** after
      mutation
- [ ] Multiple related queries are **separate variables**
- [ ] Error handling includes try/catch around mutations
- [ ] Loading state is managed during mutation

---

## Debugging: UI Not Updating?

1. Check if query is nested
   - ❌ `const contact_query = $derived(get_contact(id))`
   - ✅ `const social_links = get_social_links(contact_id)`

2. Check if you're calling `.refresh()` on the right query
   - ❌ `parent_query.refresh()`
   - ✅ `child_query.refresh()`

3. Check if `{#await}` block wraps the component
   - ❌ `<Component data={query.current} />`
   - ✅ `{#await query then data} <Component {data} /> {/await}`

4. Check browser console for errors
   - Network tab: Is mutation request succeeding?
   - Console: Any JavaScript errors?

5. Check if component is receiving new data
   - Add logging: `console.log('Received data:', data);`
   - Check if component re-renders (React DevTools, Svelte DevTools)
