# Remote Functions Reference

## Advanced Patterns

### Route Parameters

```svelte
<script lang="ts">
	import { page } from '$app/state';
	import { get_contact } from './contacts.remote';

	const id = $derived(page.params.id);
</script>

{#if id}
	{#await get_contact(id) then contact}
		<h1>{contact.name}</h1>
	{/await}
{/if}
```

### Pre-fill Forms from URL

```svelte
<script lang="ts">
	import { page } from '$app/state';
	const contact_id = page.url.searchParams.get('contact_id');
</script>

<form method="POST" {...create_interaction}>
	<input type="hidden" name="contact_id" value={contact_id} />
</form>
```

### Form Validation & Errors

```svelte
<script lang="ts">
	import { get_form_errors } from '@sveltejs/kit/server';
	const errors = $derived(get_form_errors(create_contact));
</script>

{#if errors?.name}
	<span class="error">{errors.name}</span>
{/if}
```

### Conditional Redirects

```typescript
export const update_profile = form(schema, async (data) => {
	// ... update logic

	if (data.setup_complete) {
		return redirect('/dashboard');
	}
	return redirect('/profile/next-step');
});
```

## Single-Flight Mutations

Call `.refresh()` inside commands to refresh data in the same request:

```typescript
export const delete_contact = command(v.string(), async (id) => {
	db.prepare('DELETE FROM contacts WHERE id = ?').run(id);

	// Refresh multiple queries in same request
	await get_contacts.refresh();
	await get_contact_stats.refresh();

	return { success: true };
});
```

**Benefits:**

- Without: 2 round trips (mutation + separate refresh)
- With: 1 round trip (mutation with embedded refresh)

## Default Behaviors

- **Forms**: Auto-refresh ALL queries on page
- **Commands**: Refresh NOTHING by default

## Auth Helpers

Located in `lib/server/auth-helpers.ts`:

```typescript
export const get_contacts = guarded_query(async (user_id) => {
	// user_id automatically provided, redirects to /login if not authenticated
	return db
		.prepare('SELECT * FROM contacts WHERE user_id = ?')
		.all(user_id);
});

export const create_contact = guarded_form(
	schema,
	async (data, user_id) => {
		// user_id automatically provided
		const id = nanoid();
		// ... insert logic
		return redirect(`/contacts/${id}`);
	},
);

export const delete_contact = guarded_command(
	v.string(),
	async (id, user_id) => {
		// user_id automatically provided
		db.prepare(
			'DELETE FROM contacts WHERE id = ? AND user_id = ?',
		).run(id, user_id);
		return { success: true };
	},
);
```

## Resources

- Database: `lib/server/db.ts`
- Auth helpers: `lib/server/auth-helpers.ts`
- Types: `lib/types/db.ts`
- Project docs: `docs/remote-functions.md`
