---
name: styling-patterns
description: DaisyUI v5 design system. Use for backgrounds, borders, text sizes, opacity, semantic colors, and spacing.
---

# Styling Patterns

## Quick Start

```html
<!-- ✅ Correct: Proper background hierarchy -->
<div class="bg-base-200 p-6">
  <!-- Page background -->
  <div class="card bg-base-100 shadow-md p-4">
    <!-- Card on page -->
    <h2 class="text-2xl font-bold mb-3">Section Title</h2>
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

- Background hierarchy: base-200 (page) → base-100 (card) → base-200 (nested)
- Borders: Use `border-base-300` solid (no opacity)
- Text sizes: 3xl (page) → 2xl (section) → xl (subsection) → base → sm → xs
- Opacity: ONLY 60/70/80, ONLY on metadata/descriptions
- Shadows: md (default) → lg (hover) → xl (important)

## Common Patterns

### Background Hierarchy

ALWAYS follow this order for visual contrast:

```html
<div class="bg-base-200">
  <!-- Level 1: Page/Screen -->
  <div class="card bg-base-100">
    <!-- Level 2: Card/Panel -->
    <div class="bg-base-200 p-3">
      <!-- Level 3: Nested items -->
    </div>
  </div>
</div>
```

### Text Sizing

```html
<h1 class="text-3xl font-bold">Page Title</h1>
<h2 class="text-2xl font-bold">Section Header</h2>
<h3 class="text-xl font-bold">Subsection</h3>
<p class="text-base">Body text</p>
<span class="text-sm opacity-60">Metadata</span>
```

### Opacity Rules

✅ Use opacity ONLY on: metadata, descriptions, hints
❌ Never use on: titles (h1-h3), buttons, primary actions

```html
<!-- ✅ Correct -->
<p class="text-base">Important text</p>
<span class="text-sm opacity-60">Last updated 2 days ago</span>

<!-- ❌ Wrong -->
<h1 class="opacity-60">Dashboard</h1>
<button class="opacity-70">Submit</button>
```

## Reference Files

- [references/styling-guide.md](references/styling-guide.md) - Complete design system documentation with all rules and examples

## Notes

- If text is hard to read, remove opacity
- Never stack opacity (e.g., `opacity-60 text-base-content/70`)
- Semantic colors (error, success) should NOT have opacity
- Always test contrast on both light and dark themes
