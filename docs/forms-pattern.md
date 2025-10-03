# Forms Pattern - daisyUI v5

This project uses daisyUI v5 for form components. The v5 release
changed the form structure significantly from v4.

## Key Changes in v5

- `form-control` → `fieldset`
- `label` with `label-text` → `fieldset-legend` for field labels
- Input wrapper uses `<label class="input">` instead of class on
  `<input>`
- Actual `<input>` element gets `class="grow"`

## Important: Tailwind Forms Plugin Conflict

If you're using `@tailwindcss/forms` plugin, it will cause a **double
focus ring** on inputs. Add this CSS fix to `app.css`:

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

This ensures only the `.input` wrapper shows the focus ring, not the
inner `<input>` element.

## Basic Form Structure

### Simple Input Field

```svelte
<fieldset class="fieldset">
	<legend class="fieldset-legend">Email</legend>
	<label class="input w-full">
		<input
			type="email"
			name="email"
			placeholder="[email protected]"
			class="grow"
			required
		/>
	</label>
</fieldset>
```

**Important:**

- Always add `w-full` to the `<label class="input">` to make inputs
  full-width!
- Don't add outline utilities - daisyUI handles focus states natively
- If using `@tailwindcss/forms`, add the CSS fix from above to prevent
  double focus rings

### Input with Validation

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

### Input with Helper Text

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
				placeholder="[email protected]"
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

## Input Classes Reference

### Label Classes (Container)

```html
<label class="input w-full">
	<!-- Basic input -->
	<label class="validator input w-full">
		<!-- With validation -->
		<label
			class="input w-full input-primary focus-within:outline-none"
		>
			<!-- Colored border -->
			<label class="input input-lg w-full focus-within:outline-none">
				<!-- Large size --></label
			></label
		></label
	></label
>
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

## Common Input Types

### Text Input

```svelte
<fieldset class="fieldset">
	<legend class="fieldset-legend">Name</legend>
	<label class="validator input w-full">
		<input type="text" name="name" class="grow" required />
	</label>
</fieldset>
```

### Email Input

```svelte
<fieldset class="fieldset">
	<legend class="fieldset-legend">Email</legend>
	<label class="validator input w-full">
		<input type="email" name="email" class="grow" required />
	</label>
</fieldset>
```

### Password Input

```svelte
<fieldset class="fieldset">
	<legend class="fieldset-legend">Password</legend>
	<label class="validator input w-full">
		<input type="password" name="password" class="grow" required />
	</label>
</fieldset>
```

### Number Input

```svelte
<fieldset class="fieldset">
	<legend class="fieldset-legend">Age</legend>
	<label class="validator input w-full">
		<input type="number" name="age" class="grow" min="0" max="120" />
	</label>
</fieldset>
```

### Textarea

```svelte
<fieldset class="fieldset">
	<legend class="fieldset-legend">Notes</legend>
	<textarea
		name="notes"
		class="textarea w-full"
		rows="4"
		placeholder="Enter your notes"
	></textarea>
</fieldset>
```

## Select/Dropdown

```svelte
<fieldset class="fieldset">
	<legend class="fieldset-legend">Country</legend>
	<select name="country" class="select w-full">
		<option disabled selected>Select a country</option>
		<option value="us">United States</option>
		<option value="uk">United Kingdom</option>
		<option value="ca">Canada</option>
	</select>
</fieldset>
```

## Checkbox

```svelte
<div class="form-control">
	<label class="label cursor-pointer justify-start gap-4">
		<input type="checkbox" name="agree" class="checkbox" required />
		<span class="label-text">I agree to the terms and conditions</span
		>
	</label>
</div>
```

## Radio Buttons

```svelte
<fieldset class="fieldset">
	<legend class="fieldset-legend">Plan</legend>
	<div class="space-y-2">
		<label class="label cursor-pointer justify-start gap-4">
			<input type="radio" name="plan" value="free" class="radio" />
			<span class="label-text">Free</span>
		</label>
		<label class="label cursor-pointer justify-start gap-4">
			<input type="radio" name="plan" value="pro" class="radio" />
			<span class="label-text">Pro</span>
		</label>
	</div>
</fieldset>
```

## Form Error Handling

Remote functions automatically provide error states. Display errors
like this:

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

## Form Spacing

Use `space-y-4` on the form for consistent spacing between fields:

```html
<form class="space-y-4">
	<!-- fields here -->
</form>
```

## Best Practices

1. **Always use `w-full`** on `<label class="input">` for full-width
   inputs
2. **Use `validator` class** for inputs that need validation
3. **Use `fieldset`** to group related form fields
4. **Use `<p class="label">`** for helper text
5. **Use `btn-block`** for full-width buttons
6. **Use `space-y-4`** on forms for consistent spacing
7. **Always include `class="grow"`** on the actual `<input>` element
8. **Use semantic HTML** - proper input types, required attributes,
   etc.
9. **Don't add outline utilities** - daisyUI handles focus states

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
