# Forms with daisyUI v5

Critical patterns for daisyUI v5 form structure - **v5 changed
significantly from v4**.

## Key Changes from v4 to v5

- `form-control` → `fieldset`
- `label` with `label-text` → `fieldset-legend` for field labels
- Input wrapper uses `<label class="input">` instead of class on
  `<input>`
- Actual `<input>` element gets `class="grow"`

## Important: Tailwind Forms Plugin Conflict

If using `@tailwindcss/forms` plugin, it causes a **double focus
ring** on inputs. Add this CSS fix to `app.css`:

```css
/* Fix double focus ring on daisyUI inputs */
.input:has(input:focus) {
	outline: 2px solid var(--input-color, var(--color-base-content));
	outline-offset: 2px;
}

.input input:focus {
	outline: none;
	box-shadow: none;
}
```

## Basic Form Structure

### Standard Input Pattern

```svelte
<fieldset class="fieldset">
	<legend class="fieldset-legend">Email</legend>
	<label class="input w-full">
		<input
			type="email"
			name="email"
			placeholder="Email"
			class="grow"
			required
		/>
	</label>
</fieldset>
```

**Critical:** Always add `w-full` to `<label class="input">` for
full-width inputs!

### With Validation

Use the `validator` class for automatic validation UI:

```svelte
<fieldset class="fieldset">
	<legend class="fieldset-legend">Password</legend>
	<label class="validator input w-full">
		<input
			type="password"
			name="password"
			placeholder="At least 8 characters"
			class="grow"
			required
			minlength="8"
		/>
	</label>
	<p class="label">Must be at least 8 characters</p>
</fieldset>
```

### With Helper Text

Use `<p class="label">` for helper text below inputs:

```svelte
<fieldset class="fieldset">
	<legend class="fieldset-legend">Username</legend>
	<label class="validator input w-full">
		<input
			type="text"
			name="username"
			placeholder="johndoe"
			class="grow"
			required
			pattern="[a-z0-9_]+"
		/>
	</label>
	<p class="label">
		Lowercase letters, numbers, and underscores only
	</p>
</fieldset>
```

## Complete Form Example

```svelte
<script lang="ts">
	import { my_form_function } from './my.remote';
</script>

<h2 class="mb-6 card-title text-2xl">Form Title</h2>

<form {...my_form_function} class="space-y-4">
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

	<button class="btn mt-6 btn-block btn-primary" type="submit">
		Submit
	</button>
</form>
```

## Form Error Handling

Remote functions automatically provide error states:

```svelte
<script lang="ts">
	import { my_form } from './my.remote';
</script>

<form {...my_form}>
	<!-- form fields -->

	{#if my_form.error}
		<div class="alert alert-error">
			<span>{my_form.error}</span>
		</div>
	{/if}

	<button class="btn btn-block btn-primary" type="submit">
		Submit
	</button>
</form>
```

## Class Reference

### Label Classes (Container)

```html
<label class="input w-full"><!-- Basic input --></label>
<label class="validator input w-full"><!-- With validation --></label>
<label class="input w-full input-primary"
	><!-- Colored border --></label
>
<label class="input input-lg w-full"><!-- Large size --></label>
```

### Input Element Classes

Always use `class="grow"` on the actual `<input>` element:

```html
<input class="grow" type="text" />
```

### Button Classes

```html
<button class="btn btn-block btn-primary">Submit</button>
```

- `btn` - Base button class
- `btn-primary` - Primary color
- `btn-block` - Full width

## Best Practices

1. **Always use `w-full`** on `<label class="input">` for full-width
   inputs
2. **Use `validator` class** for inputs needing validation
3. **Use `fieldset`** to group related form fields
4. **Use `<p class="label">`** for helper text
5. **Use `btn-block`** for full-width buttons
6. **Use `space-y-4`** on forms for consistent spacing
7. **Always include `class="grow"`** on the actual `<input>` element
8. **Don't add outline utilities** - daisyUI handles focus states

## Common Mistakes

### ❌ Wrong - Missing w-full

```html
<label class="validator input">
	<input type="text" class="grow" />
</label>
```

### ✅ Correct - With w-full

```html
<label class="validator input w-full">
	<input type="text" class="grow" />
</label>
```

### ❌ Wrong - Old v4 pattern

```html
<div class="form-control">
	<label class="label">
		<span class="label-text">Email</span>
	</label>
	<input type="email" class="input-bordered input" />
</div>
```

### ✅ Correct - v5 pattern

```html
<fieldset class="fieldset">
	<legend class="fieldset-legend">Email</legend>
	<label class="validator input w-full">
		<input type="email" class="grow" />
	</label>
</fieldset>
```

## Form Spacing

Use `space-y-4` on the form for consistent spacing:

```html
<form class="space-y-4">
	<!-- fields here -->
</form>
```
