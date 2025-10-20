---
name: styling-patterns
description:
  DaisyUI v5 design system. Use for backgrounds, borders, text sizes,
  opacity, semantic colors, and spacing.
---

# Styling Patterns

## Quick Start

```html
<!-- ✅ Correct: Proper background hierarchy -->
<div class="bg-base-200 p-6">
	<!-- Page background -->
	<div class="card bg-base-100 p-4 shadow-md">
		<!-- Card on page -->
		<h2 class="mb-3 text-2xl font-bold">Section Title</h2>
		<p class="text-base">Main content text</p>
		<p class="text-sm opacity-60">Secondary metadata</p>
	</div>
</div>

<!-- ❌ Wrong: Same background as parent (no contrast) -->
<div class="bg-base-100">
	<div class="card bg-base-100">
		<!-- No visual separation -->
	</div>
</div>
```

## Core Principles

- Background hierarchy: base-200 (page) → base-100 (card) → base-200
  (nested)
- Borders: Use `border-base-300` solid (no opacity)
- Text sizes: 3xl (page) → 2xl (section) → xl (subsection) → base → sm
  → xs
- Opacity: ONLY 60/70/80, ONLY on metadata/descriptions
- Shadows: md (default) → lg (hover) → xl (important)

## Common Patterns

### Background Hierarchy

Follow order: `bg-base-200` (page) → `bg-base-100` (card) →
`bg-base-200` (nested). Never use same bg color as parent.

### Text Sizing

Use hierarchy: `text-3xl` (h1) → `text-2xl` (h2) → `text-xl` (h3) →
`text-base` (body) → `text-sm` (metadata).

### Opacity Rules

✅ Use `opacity-60/70/80` ONLY on metadata, descriptions, hints. ❌
Never use on titles, buttons, or primary actions.

## Reference Files

- [references/styling-guide.md](references/styling-guide.md) -
  Complete design system documentation with all rules and examples

## Notes

- If text is hard to read, remove opacity
- Never stack opacity (e.g., `opacity-60 text-base-content/70`)
- Semantic colors (error, success) should NOT have opacity
- Always test contrast on both light and dark themes
