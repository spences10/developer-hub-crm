---
name: Svelte Component Patterns
description:
  Create type-safe Svelte 5 components with proper prop interfaces,
  runes, and snippets. Use when building reusable components,
  extracting component logic, or ensuring type safety. Follows this
  project's conventions for Props interfaces, $props(), $derived, and
  snippets.
---

# Svelte Component Patterns

## Basic Component Template

```svelte
<script lang="ts">
	interface Props {
		title: string;
		items: Array<{ id: string; label: string }>;
		onclick?: () => void;
	}

	let { title, items, onclick }: Props = $props();
</script>

<div class="card bg-base-100 shadow-md">
	<div class="card-body">
		<h3 class="card-title">{title}</h3>
		<div class="space-y-2">
			{#each items as item}
				<button class="btn w-full justify-start btn-ghost" {onclick}>
					{item.label}
				</button>
			{/each}
		</div>
	</div>
</div>
```

## Svelte 5 Patterns

**Always use `$props()`** (never `export let`):

```svelte
let {(name, value, (disabled = false))}: Props = $props();
```

**Use `$derived` for computed values**:

```svelte
const is_even = $derived(count % 2 === 0); const percentage =
$derived((count / 100) * 100);
```

**Use snippets to extract repeated markup**:

```svelte
{#snippet item_card(item: Item)}
  <div class="card bg-base-100">
    <h3>{item.title}</h3>
    <p>{item.description}</p>
  </div>
{/snippet}

{#each items as item}
  {@render item_card(item)}
{/each}
```

## File Organization

- **Naming**: `kebab-case-component.svelte`
- **Props**: Always use `interface Props`
- **Types**: Import from `$lib/types/` and use PascalCase
- **Functions/Variables**: Use snake_case
- **Lang**: Always `<script lang="ts">`

## Common Patterns

- **List items**: Component with `title`, `subtitle`, `icon`,
  `onclick`
- **Stat cards**: Icon + value + label with color variants
- **Badges**: Text + color variant
- **Cards**: Use `bg-base-100`, `shadow-md`, `card-body`, `p-4`

For detailed examples and patterns, see
[COMPONENTS.md](COMPONENTS.md).
