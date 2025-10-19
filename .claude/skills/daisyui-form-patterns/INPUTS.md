# All Input Types Reference

## Text Input

```svelte
<div class="form-control">
	<label for="email" class="label">
		<span class="label-text">Email</span>
	</label>
	<input
		id="email"
		type="email"
		name="email"
		class="input-bordered input"
		placeholder="you@example.com"
	/>
</div>
```

## Password Input

```svelte
<div class="form-control">
	<label for="password" class="label">
		<span class="label-text">Password</span>
	</label>
	<input
		id="password"
		type="password"
		name="password"
		class="input-bordered input"
	/>
</div>
```

## Textarea

```svelte
<div class="form-control">
	<label for="notes" class="label">
		<span class="label-text">Notes</span>
	</label>
	<textarea
		id="notes"
		name="notes"
		class="textarea-bordered textarea"
		rows="4"
		placeholder="Add notes..."
	></textarea>
</div>
```

## Select

```svelte
<div class="form-control">
	<label for="status" class="label">
		<span class="label-text">Status</span>
	</label>
	<select id="status" name="status" class="select-bordered select">
		<option disabled selected>Pick one</option>
		<option value="active">Active</option>
		<option value="inactive">Inactive</option>
	</select>
</div>
```

## Checkbox

```svelte
<!-- Standalone -->
<div class="form-control">
	<label class="label cursor-pointer justify-start gap-2">
		<input type="checkbox" name="agree" class="checkbox" />
		<span class="label-text">I agree to terms</span>
	</label>
</div>

<!-- Multiple -->
<div class="form-control">
	<label class="label">
		<span class="label-text">Features</span>
	</label>
	<div class="space-y-2">
		<label class="label cursor-pointer justify-start gap-2">
			<input
				type="checkbox"
				name="feature"
				value="analytics"
				class="checkbox"
			/>
			<span class="label-text">Analytics</span>
		</label>
		<label class="label cursor-pointer justify-start gap-2">
			<input
				type="checkbox"
				name="feature"
				value="reports"
				class="checkbox"
			/>
			<span class="label-text">Reports</span>
		</label>
	</div>
</div>
```

## Radio

```svelte
<div class="form-control">
	<label class="label">
		<span class="label-text">Type</span>
	</label>
	<div class="space-y-2">
		<label class="label cursor-pointer justify-start gap-2">
			<input type="radio" name="type" value="meeting" class="radio" />
			<span class="label-text">Meeting</span>
		</label>
		<label class="label cursor-pointer justify-start gap-2">
			<input type="radio" name="type" value="call" class="radio" />
			<span class="label-text">Call</span>
		</label>
	</div>
</div>
```

## File Input

```svelte
<div class="form-control">
	<label for="avatar" class="label">
		<span class="label-text">Upload Avatar</span>
	</label>
	<input
		id="avatar"
		type="file"
		name="avatar"
		class="file-input-bordered file-input"
		accept="image/*"
	/>
</div>
```

## Range Slider

```svelte
<div class="form-control">
	<label for="rating" class="label">
		<span class="label-text">Rating</span>
	</label>
	<input
		id="rating"
		type="range"
		min="1"
		max="10"
		name="rating"
		class="range"
	/>
</div>
```

## With Validation Errors

```svelte
<script lang="ts">
	import { get_form_errors } from '@sveltejs/kit/server';
	const errors = $derived(get_form_errors(form_function));
</script>

<div class="form-control">
	<label for="name" class="label">
		<span class="label-text">Name</span>
	</label>
	<input
		id="name"
		name="name"
		class="input-bordered input"
		class:input-error={errors?.name}
	/>
	{#if errors?.name}
		<div class="label">
			<span class="label-text-alt text-error">{errors.name}</span>
		</div>
	{/if}
</div>
```

## Form Layout

```svelte
<!-- Single column -->
<form class="space-y-4">
	<div class="form-control"><!-- input --></div>
	<div class="form-control"><!-- input --></div>
	<button type="submit" class="btn btn-primary">Submit</button>
</form>

<!-- Two columns on desktop -->
<form class="grid grid-cols-1 gap-4 md:grid-cols-2">
	<div class="form-control"><!-- input --></div>
	<div class="form-control"><!-- input --></div>
	<div class="md:col-span-2">
		<button type="submit" class="btn w-full btn-primary"
			>Submit</button
		>
	</div>
</form>
```

## Common Patterns

- **Required field marker**: Add `*` to label text
- **Helper text**: Add
  `<span class="label-text-alt opacity-60">Help text</span>` in label
- **Error state**: Use `input-error` class + error message below
- **Disabled**: Add `disabled` attribute
- **Loading**: Wrap button with `<div class="loading"></div>` during
  submission
