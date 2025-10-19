# Component Examples

## Stat Card

```svelte
<script lang="ts">
	import type { Component } from 'svelte';

	interface Props {
		icon: Component;
		icon_color: string;
		value: string | number;
		value_color: string;
		label: string;
		sublabel?: string | null;
		sublabel_color?: string;
	}

	let {
		icon: Icon,
		icon_color,
		value,
		value_color,
		label,
		sublabel,
		sublabel_color,
	}: Props = $props();
</script>

<div class="card border border-base-300 bg-base-100 shadow">
	<div class="card-body p-4 text-center">
		<div class="mb-2 flex items-center justify-center">
			<Icon size="28px" class_names={icon_color} />
		</div>
		<div class="mb-1 text-2xl font-extrabold {value_color}">
			{value}
		</div>
		<div class="text-xs font-semibold opacity-70">
			{label}
		</div>
		{#if sublabel}
			<div class="text-xs {sublabel_color}">
				{sublabel}
			</div>
		{/if}
	</div>
</div>
```

## List Item

```svelte
<script lang="ts">
	import type { Component } from 'svelte';

	interface Props {
		title: string;
		subtitle?: string;
		icon?: Component;
		onclick?: () => void;
	}

	let { title, subtitle, icon: Icon, onclick }: Props = $props();
</script>

<button
	class="w-full rounded border border-base-300 bg-base-100 p-3 text-left transition-colors hover:bg-base-200"
	{onclick}
>
	<div class="flex items-start gap-3">
		{#if Icon}
			<Icon size="20px" class_names="text-primary flex-shrink-0" />
		{/if}
		<div class="min-w-0">
			<div class="font-semibold">{title}</div>
			{#if subtitle}
				<div class="text-sm opacity-60">{subtitle}</div>
			{/if}
		</div>
	</div>
</button>
```

## Detail Card

```svelte
<script lang="ts">
	interface Props {
		label: string;
		value: string | null;
		is_link?: boolean;
		link_prefix?: string;
	}

	let {
		label,
		value,
		is_link = false,
		link_prefix = '',
	}: Props = $props();
</script>

{#if value}
	<div>
		<p class="mb-1 text-xs font-semibold uppercase opacity-60">
			{label}
		</p>
		{#if is_link}
			<a
				href="{link_prefix}{value}"
				class="link text-sm link-primary"
			>
				{value}
			</a>
		{:else}
			<p class="text-sm">{value}</p>
		{/if}
	</div>
{/if}
```

## With Snippet Pattern

```svelte
<script lang="ts">
	interface Item {
		id: string;
		title: string;
		description: string;
	}

	interface Props {
		items: Item[];
	}

	let { items }: Props = $props();
</script>

{#snippet item_card(item: Item)}
	<div class="card border border-base-300 bg-base-100 shadow-md">
		<div class="card-body">
			<h3 class="font-semibold">{item.title}</h3>
			<p class="text-sm opacity-60">{item.description}</p>
		</div>
	</div>
{/snippet}

<div class="space-y-3">
	{#each items as item}
		{@render item_card(item)}
	{/each}
</div>
```

## Anti-Patterns

```svelte
<!-- ❌ WRONG: No prop interface -->
<script lang="ts">
  let { title, value, disabled } = $props();
</script>

<!-- ✅ CORRECT: Proper types -->
<script lang="ts">
  interface Props {
    title: string;
    value: number;
    disabled?: boolean;
  }
  let { title, value, disabled }: Props = $props();
</script>

<!-- ❌ WRONG: Using old export syntax -->
<script lang="ts">
  export let title: string;
</script>

<!-- ✅ CORRECT: Using $props() -->
<script lang="ts">
  let { title }: { title: string } = $props();
</script>

<!-- ❌ WRONG: No $derived for computed values -->
<script lang="ts">
  let count = 5;
  let doubled = count * 2; // Not reactive!
</script>

<!-- ✅ CORRECT: Use $derived -->
<script lang="ts">
  let count = $state(5);
  const doubled = $derived(count * 2); // Reactive!
</script>
```

## Key Rules

1. ✅ Always use `interface Props` with `$props()`
2. ✅ Use `$derived()` for computed values
3. ✅ Use snippets to reduce code duplication
4. ✅ Use `kebab-case` for filenames
5. ✅ Use `snake_case` for function/variable names
6. ✅ Import types from `$lib/types/`
7. ✅ Use `lang="ts"` on `<script>` tags
8. ❌ Don't use `export let` (old pattern)
9. ❌ Don't create props without types
10. ❌ Don't use `$` prefix for regular variables (reserved for runes)
