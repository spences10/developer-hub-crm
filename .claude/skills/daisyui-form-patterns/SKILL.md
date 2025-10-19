---
name: DaisyUI v5 Form Patterns
description:
  Build form components using DaisyUI v5 with proper validation, error
  handling, and semantic HTML. Use when creating forms, input fields,
  or working with form submissions. Critical! textarea must NOT be
  wrapped in label in v5.
---

# DaisyUI v5 Form Patterns

## Basic Form Structure

```svelte
<form method="POST" {...form_function}>
	<!-- Text Input -->
	<div class="form-control">
		<label for="name" class="label">
			<span class="label-text">Name *</span>
		</label>
		<input
			id="name"
			name="name"
			type="text"
			class="input-bordered input"
			required
		/>
	</div>

	<!-- Textarea (NO label wrapper!) -->
	<div class="form-control">
		<label for="notes" class="label">
			<span class="label-text">Notes</span>
		</label>
		<textarea
			id="notes"
			name="notes"
			class="textarea-bordered textarea"
			rows="4"
		></textarea>
	</div>

	<!-- Select -->
	<div class="form-control">
		<label for="type" class="label">
			<span class="label-text">Type</span>
		</label>
		<select id="type" name="type" class="select-bordered select">
			<option>Select...</option>
			<option value="meeting">Meeting</option>
			<option value="call">Call</option>
		</select>
	</div>

	<!-- Checkbox -->
	<div class="form-control">
		<label class="label cursor-pointer justify-start gap-2">
			<input type="checkbox" name="is_vip" class="checkbox" />
			<span class="label-text">VIP Contact</span>
		</label>
	</div>

	<button type="submit" class="btn btn-primary">Save</button>
</form>
```

## Error Handling

```svelte
<script lang="ts">
	import { get_form_errors } from '@sveltejs/kit/server';
	const errors = $derived(get_form_errors(create_contact));
</script>

<input
	name="name"
	class="input-bordered input"
	class:input-error={errors?.name}
/>
{#if errors?.name}
	<div class="label">
		<span class="label-text-alt text-error">{errors.name}</span>
	</div>
{/if}
```

## CRITICAL v5 Changes

❌ **WRONG (v4)**:

```svelte
<label class="form-control">
	<textarea class="textarea-bordered textarea"></textarea>
</label>
```

✅ **CORRECT (v5)**:

```svelte
<div class="form-control">
	<label for="notes" class="label">
		<span class="label-text">Notes</span>
	</label>
	<textarea id="notes" class="textarea-bordered textarea"></textarea>
</div>
```

**Key points:**

- Use `<div class="form-control">` NOT `<label>`
- Textarea is NOT wrapped in label
- Separate `<label for="">` with `<span class="label-text">`

## Common Classes

- `form-control` - Wrapper for input group
- `label` - Label container
- `label-text` - Label text styling
- `input` / `textarea` / `select` - Base styles
- `input-bordered` - Add borders
- `input-error` - Error state
- `checkbox` / `radio` - Checkbox/radio styles
- `btn btn-primary` - Submit button

For all input types and validation patterns, see
[INPUTS.md](INPUTS.md).
