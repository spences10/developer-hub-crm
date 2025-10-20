---
name: form-patterns
description:
  DaisyUI v5 form patterns. Use for inputs, selects, textareas,
  validation, and form structure with fieldset/legend.
---

# Form Patterns

## Quick Start

```svelte
<script lang="ts">
	import { my_form } from './my.remote';
</script>

<form {...my_form} class="space-y-4">
	<fieldset class="fieldset">
		<legend class="fieldset-legend">Name</legend>
		<label class="validator input w-full">
			<input
				type="text"
				name="name"
				placeholder="Your name"
				class="grow"
				required
			/>
		</label>
	</fieldset>

	<fieldset class="fieldset">
		<legend class="fieldset-legend">Email</legend>
		<label class="validator input w-full">
			<input
				type="email"
				name="email"
				placeholder="Email"
				class="grow"
				required
			/>
		</label>
	</fieldset>

	{#if my_form.error}
		<div class="alert alert-error">
			<span>{my_form.error}</span>
		</div>
	{/if}

	<button class="btn btn-block btn-primary" type="submit"
		>Submit</button
	>
</form>
```

## Core Principles

- v5 uses `fieldset`/`fieldset-legend` (NOT
  `form-control`/`label-text`)
- Input wrapper: `<label class="input w-full">` contains the `<input>`
- Actual input gets `class="grow"`
- Always add `w-full` to label for full-width inputs
- Use `validator` class for automatic validation UI
- Selects and textareas apply classes directly (no wrapper)

## Common Patterns

### Input with Validation

Use `validator` class on label wrapper, add validation attributes
(`required`, `minlength`) to input, include helper text with
`<p class="label">`.

### Select (v5 Pattern)

Apply `select w-full` directly to `<select>` element (no wrapper).
First option should be disabled placeholder.

### Textarea (v5 Pattern)

Apply `textarea w-full` directly to `<textarea>` element (no wrapper).
Use `rows` for height.

## Reference Files

- [references/forms-guide.md](references/forms-guide.md) - Complete
  DaisyUI v5 form patterns and examples

## Notes

- **Critical:** v5 changed from v4 - don't use old `form-control`
  pattern
- Don't wrap selects in `<label>` - apply `select` class directly
- No `-bordered` suffix in v5 (borders are default)
- Use `space-y-4` on forms for consistent spacing
- Remote functions provide automatic error states via `my_form.error`
