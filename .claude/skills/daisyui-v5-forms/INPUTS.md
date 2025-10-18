# All Input Types

## Text Inputs

```svelte
<input type="text" class="input-bordered input" />
<input type="email" class="input-bordered input" />
<input type="password" class="input-bordered input" />
<input type="number" class="input-bordered input" min="1" max="90" />
<input type="date" class="input-bordered input" />
<input type="tel" class="input-bordered input" />
<input type="url" class="input-bordered input" />
```

## Radio Buttons

```svelte
<div class="form-control">
	<label class="label">
		<span class="label-text">Priority</span>
	</label>
	<div class="flex gap-4">
		<label class="label cursor-pointer gap-2">
			<input type="radio" name="priority" value="low" class="radio" />
			<span class="label-text">Low</span>
		</label>
		<label class="label cursor-pointer gap-2">
			<input
				type="radio"
				name="priority"
				value="high"
				class="radio"
			/>
			<span class="label-text">High</span>
		</label>
	</div>
</div>
```

## Size Variants

```svelte
<input class="input-bordered input input-sm" />
<input class="input-bordered input input-md" />
<!-- default -->
<input class="input-bordered input input-lg" />
```

## State Variants

```svelte
<input class="input-bordered input input-error" />
<input class="input-bordered input input-success" />
<input class="input-bordered input" disabled />
<input class="input-bordered input" readonly />
```

## Pre-filling Values

```svelte
<input
	name="name"
	value={contact.name}
	class="input-bordered input"
/>
<textarea name="notes" class="textarea-bordered textarea"
	>{contact.notes || ''}</textarea
>
<input
	type="checkbox"
	name="is_vip"
	class="checkbox"
	checked={contact.is_vip}
/>
```

## Layout Patterns

### Two Column Grid

```svelte
<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
	<div class="form-control">
		<label for="first_name" class="label">
			<span class="label-text">First Name</span>
		</label>
		<input
			id="first_name"
			name="first_name"
			class="input-bordered input"
		/>
	</div>
	<div class="form-control">
		<label for="last_name" class="label">
			<span class="label-text">Last Name</span>
		</label>
		<input
			id="last_name"
			name="last_name"
			class="input-bordered input"
		/>
	</div>
</div>
```

### Card Wrapper

```svelte
<div class="card bg-base-200">
	<div class="card-body">
		<h2 class="card-title">Create Contact</h2>
		<form method="POST" {...create_contact}>
			<!-- fields -->
			<div class="card-actions justify-end">
				<button type="submit" class="btn btn-primary">Save</button>
			</div>
		</form>
	</div>
</div>
```
