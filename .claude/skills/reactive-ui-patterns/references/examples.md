# Real-World Examples

## Example 1: Inline Contact Editing

```svelte
<script lang="ts">
  import { get_contacts, update_contact } from './contacts.remote';

  const contacts_query = get_contacts();
  let edit_id = $state<string | null>(null);
</script>

{#if contacts_query.error}
  <p>Error loading contacts</p>
{:else if contacts_query.loading && contacts_query.current === undefined}
  <p>Loading...</p>
{:else}
  {@const contacts = contacts_query.current ?? []}

  <div class:opacity-60={contacts_query.loading}>
    {#each contacts as contact}
      {#if edit_id === contact.id}
        <!-- Edit mode - smooth save without page jump -->
      {:else}
        <!-- View mode -->
      {/if}
    {/each}
  </div>
{/if}
```

## Example 2: Social Links Manager

```svelte
<script lang="ts">
  import { get_social_links, add_social_link, delete_social_link } from './profile.remote';

  const social_links = get_social_links();
</script>

{#await social_links then links}
  <SocialLinksManager
    social_links={links || []}
    on_add={async (platform, url) => {
      await add_social_link({ platform, url });
      social_links.refresh(); // ✅ Smooth update
    }}
    on_delete={async (link_id) => {
      await delete_social_link(link_id);
      social_links.refresh(); // ✅ Smooth update
    }}
  />
{/await}
```

## Example 3: Interaction Notes

```svelte
<script lang="ts">
  import { get_interactions, update_interaction } from './interactions.remote';

  const interactions_query = get_interactions();
</script>

{#if interactions_query.loading && interactions_query.current === undefined}
  <span class="loading loading-spinner"></span>
{:else}
  {@const interactions = interactions_query.current ?? []}

  <div class:opacity-60={interactions_query.loading}>
    {#each interactions as interaction}
      <!-- Inline edit without page jumps -->
    {/each}
  </div>
{/if}
```
