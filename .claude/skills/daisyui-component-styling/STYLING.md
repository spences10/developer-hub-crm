# Complete Styling Reference

## Background Hierarchy (Most Important Rule)

```svelte
<!-- Page background -->
<div class="min-h-screen bg-base-200 p-4">
	<!-- Card on page -->
	<div class="card bg-base-100 shadow-md">
		<div class="card-body p-4">
			<!-- Nested items inside card -->
			<div class="space-y-2">
				<div class="rounded bg-base-200 p-3">Item 1</div>
				<div class="rounded bg-base-200 p-3">Item 2</div>
			</div>
		</div>
	</div>
</div>
```

**Never use same background as parent without visual separation.**

## Border System

```svelte
<!-- Default (95% of cases) -->
<div class="border border-base-300">

<!-- Thick for emphasis -->
<div class="border-2 border-base-300">

<!-- Active/selected -->
<div class="border border-primary ring-2 ring-primary">

<!-- Error -->
<div class="border-2 border-error">
```

**Never use opacity on borders.**

## Text Size Hierarchy

- `text-3xl font-bold` - Page titles (h1)
- `text-2xl font-bold` - Section headers (h2)
- `text-xl font-bold` - Subsection headers (h3)
- `text-lg font-semibold` - Card titles
- `text-base` - Body text
- `text-sm` - Secondary info
- `text-xs` - Hints/labels

## Opacity System

- `opacity-60` - Secondary metadata
- `opacity-70` - Tertiary text/hints
- `opacity-80` - Slightly muted (rare)

**Never use on:** titles, buttons, links, interactive elements

## Semantic Colors

- **Primary**: Brand, main actions, links → `text-primary`,
  `btn-primary`, `ring-primary`
- **Error**: Errors, delete, destructive → `text-error`, `btn-error`,
  `border-error`
- **Success**: Completion → `badge-success`, `btn-success`
- **Warning**: Caution, pending → `badge-warning`
- **Info**: Neutral → `badge-info`

**Never add opacity to semantic colors.**

## Shadow Scale

- `shadow-md` - Default for cards
- `shadow-lg` - Hover states, dropdowns
- `shadow-xl` - Important cards, modals
- Pair with `transition-shadow` for smooth hover

## Spacing Values

- `gap-1` - Very tight (0.25rem)
- `gap-2` - **DEFAULT** (0.5rem)
- `gap-3` - Between related items (0.75rem)
- `gap-4` - Between sections (1rem)
- `p-3` - Compact cards (0.75rem)
- `p-4` - **DEFAULT** card padding (1rem)
- `p-6` - Large cards (1.5rem)

Never use arbitrary values like `gap-[13px]`.

## Colors NOT to Use

❌ Arbitrary hex/rgb: `#F3F4F6`, `rgb(243, 244, 246)` ❌ Tailwind
neutrals: `gray-100`, `slate-200` ❌ Dark colors: `black`, `gray-900`

**Use ONLY**: DaisyUI semantic tokens (`base-100`, `base-200`,
`primary`, `error`, `success`, `warning`, `info`)
