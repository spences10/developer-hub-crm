---
name: DaisyUI v5 Component Styling
description:
  Create properly styled components using DaisyUI v5 semantic tokens
  and color system. Use when building Svelte components, ensuring
  consistent visual hierarchy, borders, text sizing, shadows, and
  spacing. Critical for maintaining design system compliance.
---

# DaisyUI v5 Component Styling

## Quick Rules

**Background Hierarchy** (most important):

- Page: `bg-base-200`
- Cards: `bg-base-100`
- Nested items in cards: `bg-base-200`

**Borders** (always):

- Default: `border border-base-300` (no opacity!)
- Active: `border border-primary ring-2 ring-primary`
- Error: `border border-error`

**Text Sizes** (hierarchy):

- h1: `text-3xl font-bold`
- h2: `text-2xl font-bold`
- h3: `text-xl font-bold`
- Card title: `text-lg font-semibold`
- Body: `text-base`
- Secondary: `text-sm opacity-60`
- Tertiary: `text-xs opacity-70`

**Shadows**:

- Cards: `shadow-md`
- Hover: `shadow-lg`
- Important/Modal: `shadow-xl`

**Spacing**:

- Gap between items: `gap-2` (default), `gap-3` (related), `gap-4`
  (sections)
- Padding: `p-4` (default card), `p-6` (large)
- Margin: `mb-3` (default), `mb-4` (sections)

**Opacity** (only these values):

- `opacity-60` - Secondary metadata
- `opacity-70` - Tertiary text/hints
- `opacity-80` - Slightly muted (rare)

**Semantic Colors**:

- Primary: Brand, main actions, links
- Error: Errors, delete, destructive
- Success: Completion, positive states
- Warning: Caution, pending
- Info: Neutral notifications

## Anti-Patterns

❌ Same background color as parent ❌ Opacity on titles, buttons,
links ❌ Opacity on semantic colors (error/success/primary) ❌ Border
opacity (use solid colors only) ❌ Arbitrary values: `gap-[13px]`,
`text-[15px]`, `p-[1.2rem]`

## Examples

```svelte
<!-- Card -->
<div class="card bg-base-100 shadow-md">
	<div class="card-body p-4">
		<h2 class="mb-4 card-title text-lg">Title</h2>
		<div class="space-y-2">
			<div class="rounded bg-base-200 p-3">Item</div>
		</div>
	</div>
</div>

<!-- Stat Card -->
<div class="card border border-base-300 bg-base-100 shadow">
	<div class="card-body p-4 text-center">
		<div class="text-2xl font-extrabold text-primary">42</div>
		<div class="text-xs font-semibold opacity-70">Label</div>
	</div>
</div>
```

For full styling reference, see [STYLING.md](STYLING.md).
