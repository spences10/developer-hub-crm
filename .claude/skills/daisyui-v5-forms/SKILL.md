---
name: DaisyUI v5 Forms
description:
  Create and style forms using daisyUI v5 components. Use when
  building forms or working with user input. CRITICAL - textarea must
  NOT be wrapped in label in v5.
---

# DaisyUI v5 Forms

## CRITICAL Breaking Change

```svelte
<!-- ❌ WRONG (v4 pattern, breaks in v5) -->
<label class="form-control">
	<textarea class="textarea-bordered textarea"></textarea>
</label>

<!-- ✅ CORRECT (v5 pattern) -->
<div class="form-control">
	<label for="notes" class="label">
		<span class="label-text">Notes</span>
	</label>
	<textarea id="notes" name="notes" class="textarea-bordered textarea"
	></textarea>
</div>
```

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

## Validation & Errors

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

## Common Classes

- `form-control` - Wrapper for input group
- `label` - Label container
- `label-text` - Label text
- `input` / `textarea` / `select` - Base styles
- `input-bordered` - Add borders
- `checkbox` / `radio` - Checkbox/radio styles
- `btn btn-primary` - Submit button

For all input types and patterns, see [INPUTS.md](INPUTS.md).
