---
name: reactive-ui-patterns
description: Remote functions reactive UI patterns. Use for smooth in-place updates, preventing page jumps, and managing loading states with .current property.
---

# Reactive UI Patterns

## Quick Start

Use the `.current` property pattern for smooth, in-place updates without page jumps:

```svelte
<script lang="ts">
  import { get_data, update_data } from './data.remote';

  // Store query in a variable
  const data_query = get_data();

  async function save(id: string, value: string) {
    await update_data({ id, value });
    await data_query.refresh(); // ✅ Updates in place!
  }
</script>

<!-- Show spinner only on INITIAL load -->
{#if data_query.error}
  <p>Error loading data</p>
{:else if data_query.loading && data_query.current === undefined}
  <p>Loading...</p>
{:else}
  {@const items = data_query.current ?? []}

  <div class:opacity-60={data_query.loading}>
    {#each items as item}
      <!-- Your content - updates smoothly! -->
    {/each}
  </div>
{/if}
```

## Core Principles

- **Store queries in variables**: `const query = get_data()` enables access to `.current` property
- **Use `.current` for inline editing**: Prevents page jumps and keeps scroll position
- **Show spinner only on initial load**: Check `.current === undefined` to avoid hiding content during refresh

## Common Patterns

### Inline Editing (Contacts, Interactions, Profile)

Use `.current` pattern when users edit items in a list. This prevents scroll jumps and provides smooth updates without re-rendering the entire component.

### Read-Only Displays

Use `{#await}` pattern when you don't need to refresh data or when the component won't trigger refreshes.

## Reference Files

For detailed documentation, see:
- [references/current-property.md](references/current-property.md) - Deep dive on `.current` property
- [references/anti-patterns.md](references/anti-patterns.md) - Common mistakes to avoid
- [references/examples.md](references/examples.md) - Real-world examples

## Notes

- Remote functions automatically update components when `.refresh()` is called
- The `.current` property retains previous data during refresh (key to smooth updates)
- Avoid `{#await}` for inline editing - causes jarring page reload behavior
- Don't use manual refresh keys or `{#key}` blocks - defeats reactivity

<!--
PROGRESSIVE DISCLOSURE GUIDELINES:
- Keep this file ~50 lines total (max ~150 lines)
- Use 1-2 code blocks only (recommend 1)
- Keep description <200 chars for Level 1 efficiency
- Move detailed docs to references/ for Level 3 loading
- This is Level 2 - quick reference ONLY, not a manual
-->
