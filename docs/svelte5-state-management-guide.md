# Svelte 5 State Management Guide

## Overview

Svelte 5 introduces runes, a new reactivity system that works both
inside Svelte components and in separate `.svelte.ts` files. This
guide explains how to implement global state management using runes in
`.svelte.ts` files.

## Key Concepts

### Runes

Runes are special symbols that instruct the Svelte compiler about
reactivity:

- `$state` - Declares a reactive state variable
- `$derived` - Computes a value based on reactive state
- `$effect` - Runs side effects when reactive state changes
- `$props` - Declares component props

### Global State with Classes

The recommended approach for global state management in Svelte 5 is
using classes in `.svelte.ts` files:

```typescript
// state/counter.svelte.ts
class Counter {
	value = $state(0);

	increment() {
		this.value++;
	}

	decrement() {
		this.value--;
	}

	reset() {
		this.value = 0;
	}
}

export const counter = new Counter();
```

This approach has several advantages:

- Encapsulates related state and methods
- More performant than plain objects (V8 optimizes classes)
- Provides a clean API for state manipulation

### Using Global State in Components

```svelte
<script>
	import { counter } from '$lib/state/counter.svelte.ts';
</script>

<button on:click={() => counter.increment()}>
	Increment: {counter.value}
</button>
```

## Best Practices

### 1. Use Classes for Related State

Group related state and methods in a class:

```typescript
// state/contacts.svelte.ts
class ContactStore {
	contacts = $state([]);
	loading = $state(false);
	error = $state(null);

	async fetchContacts() {
		this.loading = true;
		try {
			// Fetch logic
			this.contacts = await fetchContactsFromAPI();
			this.error = null;
		} catch (err) {
			this.error = err.message;
		} finally {
			this.loading = false;
		}
	}

	addContact(contact) {
		this.contacts = [...this.contacts, contact];
	}

	// Other methods...
}

export const contactStore = new ContactStore();
```

### 2. Use $derived for Computed Values

```typescript
class ContactStore {
	contacts = $state([]);
	searchTerm = $state('');

	// Computed property using $derived
	filteredContacts = $derived(
		this.contacts.filter((contact) =>
			contact.name
				.toLowerCase()
				.includes(this.searchTerm.toLowerCase()),
		),
	);
}
```

### 3. Avoid Direct State Export

Don't export reactive state directly:

```typescript
// ❌ Bad - state won't be reactive across modules
let count = $state(0);
export { count };

// ✅ Good - state is encapsulated in a class
class Counter {
	value = $state(0);
}
export const counter = new Counter();
```

### 4. Use $effect Sparingly

Only use `$effect` when you need to synchronize with non-reactive
systems:

```typescript
class ThemeStore {
	theme = $state('light');

	constructor() {
		// Initialize from localStorage
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme) {
			this.theme = savedTheme;
		}

		// Sync with localStorage when theme changes
		$effect(() => {
			localStorage.setItem('theme', this.theme);
			document.documentElement.setAttribute('data-theme', this.theme);
		});
	}

	toggleTheme() {
		this.theme = this.theme === 'light' ? 'dark' : 'light';
	}
}

export const themeStore = new ThemeStore();
```

## Integration with SvelteKit

In SvelteKit applications, consider these additional patterns:

### Server-Side State

For server-side state, use `event.locals` in load functions and form
actions:

```typescript
// +page.server.ts
export const load = async ({ locals }) => {
	return {
		user: locals.user,
	};
};
```

### Client-Side State Initialization

Initialize client-side state from server data:

```svelte
<script>
	import { contactStore } from '$lib/state/contacts.svelte.ts';
	import { onMount } from 'svelte';

	export let data;

	onMount(() => {
		// Initialize store with server data
		if (data.initialContacts) {
			contactStore.contacts = data.initialContacts;
		}
	});
</script>
```

## Performance Considerations

- Use `$state.raw` for large arrays or objects that don't need deep
  reactivity
- Avoid unnecessary `$effect` calls that might trigger frequent
  updates
- Consider using `$derived.by` for complex derivations with multiple
  dependencies
