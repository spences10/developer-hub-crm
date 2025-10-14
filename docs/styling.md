# DEVHUB CRM - Visual Design System

## Critical: DaisyUI Semantic Color Usage

This project uses **DaisyUI v5** semantic tokens. **Do not make up
your own colors or patterns.**

---

## 1. BACKGROUND COLOR HIERARCHY

```html
<!-- Base Color System (ALWAYS use these in this order) -->

bg-base-200 /* Page/screen backgrounds */ └─ bg-base-100 /* Card/panel
surfaces */ └─ bg-base-200 /* Nested areas, secondary surfaces */ └─
bg-base-300 (rare, only for very nested elements)

<!-- Examples -->

<!-- ✅ CORRECT: Proper hierarchy -->
<div class="bg-base-200">
	<!-- Page -->
	<div class="card bg-base-100">
		<!-- Card -->
		<div class="bg-base-200 p-3">
			<!-- Nested item -->
			<div class="bg-base-300">
				<!-- Rare: deeply nested -->

				<!-- ❌ WRONG: No contrast -->
				<div class="bg-base-100">
					<div class="card bg-base-100">
						<!-- Same as parent, no contrast -->

						<!-- ❌ WRONG: Reversed hierarchy -->
						<div class="bg-base-200">
							<div class="card bg-base-300">
								<!-- Too dark, wrong order -->
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
```

### Background Rules:

- **Page/Screen**: Always `bg-base-200`
- **Cards/Panels**: Always `bg-base-100` on base-200 background
- **Nested Elements**: Use `bg-base-200` for items inside base-100
  cards
- **Interactive Hover**: `hover:bg-base-300` on base-200 elements
- **Never**: Use same bg color as parent without spacing/borders

---

## 2. BORDER SYSTEM

```html
<!-- Border Colors (Use these ONLY) -->

border-base-300 /* DEFAULT - 95% of borders */ border-primary /*
Selected/active states */ border-error /* Error states, delete
warnings */

<!-- Border Patterns -->

<!-- ✅ Standard Card Border -->
class="card border border-base-300 bg-base-100"

<!-- ✅ Subtle divider -->
class="border-t border-base-300"

<!-- ✅ Active/Selected state -->
class="border-primary ring-2 ring-primary"

<!-- ✅ Error/Warning -->
class="border-2 border-error"

<!-- ❌ WRONG: Don't use opacity on borders (breaks contrast) -->
class="border-base-300/50"
<!-- NO -->

<!-- ❌ WRONG: Don't use arbitrary colors -->
class="border-gray-300"
<!-- NO -->
```

### Border Rules:

- **Default**: `border-base-300` for 95% of cases
- **Active/Selected**: `border-primary` with optional
  `ring-2 ring-primary`
- **Errors**: `border-error` or `border-2 border-error`
- **Opacity**: DO NOT use opacity on borders - use solid colors only

---

## 3. TEXT SIZE HIERARCHY

```html
<!-- Text Size System (Use ONLY these patterns) -->

text-3xl font-bold /* Page titles (h1) */ text-2xl font-bold /*
Section headers (h2) */ text-xl font-bold /* Subsection headers (h3)
*/ text-lg font-semibold /* Card titles, emphasis */ text-base /* Body
text, default */ text-sm /* Secondary info, metadata */ text-xs /*
Tertiary info, hints */

<!-- Responsive Pattern -->
class="text-3xl lg:text-4xl" /* Scale up on desktop */

<!-- Examples -->

<!-- ✅ Page Title -->
<h1 class="text-3xl font-bold">Dashboard</h1>

<!-- ✅ Section Header -->
<h2 class="text-2xl font-bold">Recent Activity</h2>

<!-- ✅ Card Header -->
<h3 class="text-xl font-bold">Contact Details</h3>

<!-- ✅ Emphasized Link -->
<a class="link text-lg font-semibold">John Doe</a>

<!-- ✅ Body Text -->
<p class="text-base">This is the main content...</p>

<!-- ✅ Metadata -->
<span class="text-sm opacity-60">Due: Jan 15, 2024</span>

<!-- ✅ Hint/Label -->
<label class="text-xs opacity-60">Optional field</label>

<!-- ❌ WRONG: Arbitrary sizes -->
<p class="text-[15px]"><!-- NO --></p>
<h2 class="text-xl"><!-- Too small for h2 --></h2>
```

---

## 4. OPACITY MODIFIER SYSTEM

**CRITICAL: Opacity modifiers reduce contrast. Use sparingly and
test.**

```html
<!-- Opacity Modifiers (ONLY use these values) -->

opacity-80 /* Slightly muted text (rare) */ opacity-70 /* Tertiary
text, descriptions */ opacity-60 /* Secondary metadata, labels */
opacity-50 /* Disabled states (rare) */ text-base-content/80 /*
Slightly muted (rare) */ text-base-content/70 /* Tertiary text */
text-base-content/60 /* Secondary metadata */

<!-- When to Use Each -->

<!-- ✅ opacity-60 or /60: Secondary metadata -->
<span class="text-sm opacity-60">Last updated 2 days ago</span>
<p class="text-base-content/60">Optional description</p>

<!-- ✅ opacity-70 or /70: Tertiary text, hints -->
<p class="text-sm opacity-70">This will be permanently deleted</p>
<label class="text-xs text-base-content/70"
	>Leave blank if unknown</label
>

<!-- ✅ opacity-80 or /80: Slightly muted (use rarely) -->
<p class="text-base opacity-80">Supporting information...</p>

<!-- ❌ WRONG: Don't stack opacity -->
<span class="text-base-content/70 opacity-60">
	<!-- NO -->

	<!-- ❌ WRONG: Don't use on important text -->
	<h1 class="opacity-60">
		<!-- NO - titles must be full contrast -->
		<button class="opacity-70">
			<!-- NO - buttons must be clear -->

			<!-- ❌ WRONG: Don't use arbitrary values -->
			<p class="opacity-45">
				<!-- NO -->
				<span class="text-base-content/55"> <!-- NO --></span>
			</p>
		</button>
	</h1></span
>
```

### Opacity Rules:

- **DO NOT** use opacity on: titles (h1-h3), buttons, primary actions,
  links
- **DO** use opacity on: metadata, descriptions, hints, tertiary
  information
- **ONLY** use these values: 60, 70, 80
- **NEVER** stack opacity classes (e.g.,
  `opacity-60 text-base-content/70`)
- **TEST**: If text is hard to read, remove opacity

---

## 5. SEMANTIC COLOR USAGE

```html
<!-- Semantic Colors (When to use) -->

text-primary /* Primary actions, links, brand emphasis */ text-error
/* Errors, delete actions, destructive warnings */ text-success /*
Success messages, completed states */ text-warning /* Warnings,
pending states */ text-info /* Info messages, neutral notifications */
bg-primary /* Primary colored backgrounds */ bg-error /* Error
backgrounds */ bg-success /* Success backgrounds */

<!-- Examples -->

<!-- ✅ Primary Link -->
<a href="..." class="link link-primary">View Details</a>

<!-- ✅ Error Message -->
<p class="text-sm text-error">This follow-up is overdue</p>

<!-- ✅ Success Badge -->
<span class="badge badge-success">Completed</span>

<!-- ✅ Icon with semantic color -->
<Icon size="20px" class_names="text-primary" />

<!-- ❌ WRONG: Don't use opacity on semantic colors (breaks contrast) -->
<p class="text-error/60">
	<!-- NO - use text-error or opacity-60, not both -->

	<!-- ❌ WRONG: Don't mix semantic meanings -->
	<button class="btn text-success btn-error">
		<!-- Confusing -->
	</button>
</p>
```

### Semantic Color Rules:

- **Primary**: Use for brand elements, main actions, important links
- **Error**: Use for errors, delete buttons, overdue states
- **Success**: Use for completion, success states only
- **Warning**: Use for caution states, pending items
- **DO NOT** add opacity to semantic colors (use full strength or
  opacity-60 separately)

---

## 6. SHADOW SYSTEM

```html
<!-- Shadow Scale (Use ONLY these) -->

shadow /* Subtle (rare, mostly for nav) */ shadow-md /* DEFAULT for
cards */ shadow-lg /* Hover states, dropdowns */ shadow-xl /*
Important cards, modals */ shadow-2xl /* Hero elements, major CTAs */

<!-- Patterns -->

<!-- ✅ Standard Card -->
class="card bg-base-100 shadow-md"

<!-- ✅ Card with Hover -->
class="card bg-base-100 shadow-md transition-shadow hover:shadow-lg"

<!-- ✅ Important/Modal Card -->
class="card bg-base-100 shadow-xl"

<!-- ✅ Navigation -->
class="navbar bg-base-100 shadow-lg"

<!-- ❌ WRONG: Arbitrary shadows -->
class="shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
<!-- NO -->
```

### Shadow Rules:

- **Default cards**: `shadow-md`
- **Hover states**: `shadow-lg`
- **Modals/Important**: `shadow-xl`
- **Always pair with**: `transition-shadow` for hover effects

---

## 7. SPACING SCALE

```html
<!-- Spacing System (Use ONLY these values) -->

gap-1 /* 0.25rem - tight icon+text */ gap-2 /* 0.5rem - DEFAULT for
most UI */ gap-3 /* 0.75rem - between related items */ gap-4 /* 1rem -
between sections */ p-3 /* 0.75rem - compact cards */ p-4 /* 1rem -
DEFAULT card padding */ p-6 /* 1.5rem - large cards */ mb-2 /* 0.5rem
- small spacing */ mb-3 /* 0.75rem - default element spacing */ mb-4
/* 1rem - section spacing */ mb-6 /* 1.5rem - major section breaks */

<!-- ✅ Default Pattern -->
<div class="flex items-center gap-2">
	<!-- Most common -->

	<!-- ✅ Card Pattern -->
	<div class="card-body p-4">
		<!-- Default card -->

		<!-- ❌ WRONG: Arbitrary values -->
		<div class="gap-[13px]">
			<!-- NO -->
			<div class="p-[1.2rem]"><!-- NO --></div>
		</div>
	</div>
</div>
```

---

## 8. BUTTON COLOR USAGE

```html
<!-- Button Colors (Semantic use ONLY) -->

btn-primary /* Main actions: Create, Save, Submit */ btn-secondary /*
Alternative actions */ btn-error /* Delete, destructive actions */
btn-success /* Complete, confirm positive */ btn-ghost /* Tertiary,
less emphasis */ btn-outline /* Cancel, alternative styling */

<!-- ✅ Correct Usage -->
<button class="btn btn-primary">Create Contact</button>
<button class="btn btn-error">Delete</button>
<button class="btn btn-ghost">Cancel</button>

<!-- ❌ WRONG: Don't mix semantic meanings -->
<button class="btn btn-error">Save</button>
<!-- Error is for destructive -->
```

---

## 9. CONTRAST CHECKLIST

Before committing code, verify:

- [ ] Cards use `bg-base-100` on `bg-base-200` backgrounds
- [ ] Nested items use `bg-base-200` inside `bg-base-100` cards
- [ ] Borders are `border-base-300` (not with opacity)
- [ ] Titles (h1-h3) have NO opacity modifiers
- [ ] Buttons have NO opacity modifiers
- [ ] Text opacity is ONLY 60, 70, or 80
- [ ] Semantic colors (error, success, etc.) are NOT combined with
      opacity
- [ ] Shadows are standard scale (md, lg, xl)
- [ ] Text sizes follow hierarchy (3xl → 2xl → xl → lg → base → sm →
      xs)

---

## 10. COMMON MISTAKES TO AVOID

```html
❌ Same background as parent
<div class="bg-base-100">
	<div class="card bg-base-100">
		<!-- No contrast -->

		❌ Opacity on titles
		<h1 class="opacity-60">Dashboard</h1>

		❌ Opacity on semantic colors
		<p class="text-error/50">Error message</p>

		❌ Border opacity
		<div class="border border-base-300/30">
			❌ Arbitrary values
			<div class="gap-[15px] text-[17px]">
				❌ Stacked opacity
				<span class="text-base-content/70 opacity-60">
					❌ Wrong text size for element
					<h2 class="text-base">Section Title</h2>

					❌ Wrong semantic button usage
					<button class="btn btn-error">Submit Form</button></span
				>
			</div>
		</div>
	</div>
</div>
```

---

## GOLDEN RULES

1. **Background Hierarchy**: base-200 → base-100 → base-200 → base-300
2. **Borders**: Use `border-base-300` solid (no opacity)
3. **Text Sizes**: 3xl (page) → 2xl (section) → xl (subsection) → lg
   (card) → base → sm → xs
4. **Opacity**: Only 60/70/80, only on metadata/descriptions
5. **Shadows**: md (default) → lg (hover) → xl (important)
6. **Contrast**: Test readability - if text is hard to read, remove
   opacity
7. **When in Doubt**: Check existing components for patterns

---

**If you're unsure, ask. Don't invent new patterns.**
