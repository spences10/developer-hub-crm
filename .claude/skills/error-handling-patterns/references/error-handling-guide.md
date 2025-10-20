# Error Handling & Async State

Handle errors and loading states gracefully with error boundaries and
await expressions.

## Error Boundaries

Wrap components to catch errors during rendering or async operations.

### Basic Usage

```svelte
<script lang="ts">
	import { get_contacts } from './contacts.remote';

	function report_error(error) {
		console.error('Error occurred:', error);
		// Send to monitoring service
	}
</script>

<svelte:boundary onerror={report_error}>
	<ul>
		{#each await get_contacts() as contact}
			<li>{contact.name}</li>
		{/each}
	</ul>

	{#snippet failed(error, reset)}
		<div class="error">
			<p>Failed to load contacts: {error.message}</p>
			<button onclick={reset}>Try again</button>
		</div>
	{/snippet}
</svelte:boundary>
```

### With Loading State

```svelte
<svelte:boundary>
	<ul>
		{#each await get_contacts() as contact}
			<li>{contact.name}</li>
		{/each}
	</ul>

	{#snippet pending()}
		<div class="loading">Loading contacts...</div>
	{/snippet}

	{#snippet failed(error, reset)}
		<div class="error">
			<p>Error: {error.message}</p>
			<button onclick={reset}>Retry</button>
		</div>
	{/snippet}
</svelte:boundary>
```

## Await Expressions in Markup

Use `await` directly in your markup for remote function calls.

### Basic Await

```svelte
<script lang="ts">
	import { get_contact } from './contacts.remote';

	let contact_id = $state('123');
</script>

<div>
	<h1>{await get_contact(contact_id).name}</h1>
</div>
```

### Await Block (Old Syntax)

Still supported for more complex scenarios:

```svelte
<script lang="ts">
	import { get_contacts } from './contacts.remote';
</script>

{#await get_contacts()}
	<p>Loading...</p>
{:then contacts}
	<ul>
		{#each contacts as contact}
			<li>{contact.name}</li>
		{/each}
	</ul>
{:catch error}
	<p>Error: {error.message}</p>
{/await}
```

### Multiple Awaits (Parallel)

Await expressions in markup run in parallel:

```svelte
<script lang="ts">
	import { get_contacts } from './contacts.remote';
	import { get_interactions } from './interactions.remote';
</script>

<div>
	<h2>Contacts: {await get_contacts().length}</h2>
	<h2>Interactions: {await get_interactions().length}</h2>
</div>
```

## Nested Boundaries

Create boundaries at different levels for granular error handling.

```svelte
<svelte:boundary>
	<div class="dashboard">
		<!-- This boundary catches errors from contacts -->
		<svelte:boundary>
			<section>
				{#each await get_contacts() as contact}
					<ContactCard {contact} />
				{/each}
			</section>

			{#snippet failed(error, reset)}
				<p>Contacts failed to load</p>
				<button onclick={reset}>Retry</button>
			{/snippet}
		</svelte:boundary>

		<!-- This boundary catches errors from stats -->
		<svelte:boundary>
			<aside>
				<Stats data={await get_stats()} />
			</aside>

			{#snippet failed(error, reset)}
				<p>Stats unavailable</p>
			{/snippet}
		</svelte:boundary>
	</div>

	{#snippet failed(error)}
		<p>Dashboard completely failed: {error.message}</p>
	{/snippet}
</svelte:boundary>
```

## Loading State Detection

Use `$effect.pending()` to show loading indicators for subsequent
calls:

```svelte
<script lang="ts">
	import { get_contacts } from './contacts.remote';

	let search = $state('');
	let is_pending = $derived($effect.pending());
</script>

<input bind:value={search} />

{#if is_pending}
	<div class="spinner">Loading...</div>
{/if}

<svelte:boundary>
	<ul>
		{#each await get_contacts(search) as contact}
			<li>{contact.name}</li>
		{/each}
	</ul>
</svelte:boundary>
```

## Form Error Handling

Forms automatically show validation errors:

```svelte
<script lang="ts">
	import { create_contact } from './contacts.remote';
</script>

<form {...create_contact}>
	<input name="name" />
	<input name="email" type="email" />

	{#if create_contact.error}
		<p class="error">{create_contact.error.message}</p>
	{/if}

	<button>Create Contact</button>
</form>
```

## Best Practices

1. **Granular boundaries** - Wrap individual features, not entire
   pages
2. **Always provide retry** - Include reset button in error states
3. **Log errors** - Use `onerror` callback for monitoring
4. **Loading states** - Show pending snippets for better UX
5. **Parallel loading** - Use multiple await expressions to load data
   in parallel

## Common Patterns

### Component-Level Error Boundary

```svelte
<!-- ContactList.svelte -->
<script lang="ts">
	import { get_contacts } from './contacts.remote';
</script>

<svelte:boundary onerror={(e) => console.error(e)}>
	<ul>
		{#each await get_contacts() as contact}
			<li>{contact.name}</li>
		{/each}
	</ul>

	{#snippet pending()}
		<div class="skeleton">Loading...</div>
	{/snippet}

	{#snippet failed(error, reset)}
		<div class="error-card">
			<p>{error.message}</p>
			<button onclick={reset}>Retry</button>
		</div>
	{/snippet}
</svelte:boundary>
```

### Page-Level Fallback

```svelte
<!-- +page.svelte -->
<script lang="ts">
	import ContactList from './ContactList.svelte';
	import Stats from './Stats.svelte';
</script>

<svelte:boundary>
	<div class="page">
		<ContactList />
		<Stats />
	</div>

	{#snippet failed(error)}
		<div class="page-error">
			<h1>Something went wrong</h1>
			<p>{error.message}</p>
			<a href="/">Go home</a>
		</div>
	{/snippet}
</svelte:boundary>
```
