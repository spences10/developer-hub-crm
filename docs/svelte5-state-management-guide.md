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

	async fetch_contacts() {
		this.loading = true;
		try {
			// Fetch logic
			this.contacts = await fetch_contacts_from_api();
			this.error = null;
		} catch (err) {
			this.error = err.message;
		} finally {
			this.loading = false;
		}
	}

	add_contact(contact) {
		this.contacts = [...this.contacts, contact];
	}

	// Other methods...
}

export const contact_store = new ContactStore();
```

### 2. Use $derived Correctly

There are two ways to use `$derived`:

#### Simple Expression

For simple expressions, use the direct form:

```typescript
// Simple derived value
const doubled = $derived(count * 2);
```

#### Complex Logic with $derived.by

For more complex derivations, use `$derived.by` with a function:

```typescript
// Complex derivation with $derived.by
const filtered_contacts = $derived.by(() => {
	// Complex filtering logic here
	return contacts.filter(contact => {
		return contact.name.toLowerCase().includes(search_term.toLowerCase());
	});
});
```

❌ **Common Mistake**: Using incorrect syntax with arrays:

```typescript
// WRONG - This will not work!
const filtered_contacts = $derived(
	[search_term, contacts],
	([search_term, contacts]) => {
		return contacts.filter(/* ... */);
	}
);
```

✅ **Correct Approach**:

```typescript
// CORRECT - Use $derived.by for complex derivations
const filtered_contacts = $derived.by(() => {
	return contacts.filter(/* ... */);
});
```

### 3. Always Handle Null/Undefined Values

Always check for null or undefined values when accessing properties, especially from props or stores:

```typescript
// BAD - Will cause TypeError if user is undefined
const user_initial = $derived(user.username.charAt(0).toUpperCase());

// GOOD - Safely handles null/undefined
const user_initial = $derived(() => {
	if (user && user.username) {
		return user.username.charAt(0).toUpperCase();
	}
	return '?'; // Fallback value
});
```

### 4. Avoid Direct State Export

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

### 5. Use $effect Sparingly

Only use `$effect` when you need to synchronize with non-reactive
systems:

```typescript
class ThemeStore {
	theme = $state('light');

	constructor() {
		// Initialize from localStorage
		const saved_theme = localStorage.getItem('theme');
		if (saved_theme) {
			this.theme = saved_theme;
		}

		// Sync with localStorage when theme changes
		$effect(() => {
			localStorage.setItem('theme', this.theme);
			document.documentElement.setAttribute('data-theme', this.theme);
		});
	}

	toggle_theme() {
		this.theme = this.theme === 'light' ? 'dark' : 'light';
	}
}

export const theme_store = new ThemeStore();
```

### 6. Safely Initialize Store Data

When initializing store data from server or async sources, always use null checks:

```typescript
// In your component
onMount(() => {
	if (data && data.initial_contacts) {
		contact_store.initialize(data.initial_contacts);
	}
});
```

### Context-Based State Management

For more complex state that needs to be shared between components, use
Svelte's context API combined with runes:

```typescript
// state/contacts.svelte.ts
const CONTACT_CONTEXT_KEY = Symbol('contact-context');

interface ContactState {
	// State
	readonly contacts: Contact[];
	readonly loading: boolean;
	readonly error: string | null;

	// Computed values (automatically update when contacts change)
	readonly total_contacts: number;
	readonly vip_contacts: number;

	// Methods
	initialize: (contacts: Contact[]) => void;
	update_contact: (updated_contact: Contact) => void;
	add_contact: (new_contact: Contact) => void;
	delete_contact: (contact_id: string) => void;
	get_filtered_contacts: (search_term?: string) => Contact[];
}

export function create_contact_state(initial_contacts: Contact[] = []): ContactState {
	// Check for existing context
	if (hasContext(CONTACT_CONTEXT_KEY)) {
		return getContext<ContactState>(CONTACT_CONTEXT_KEY);
	}

	// Create reactive state
	let contacts = $state<Contact[]>(initial_contacts);
	let loading = $state<boolean>(false);
	let error = $state<string | null>(null);

	// Computed values using $derived
	let total_contacts = $derived(contacts.length);
	let vip_contacts = $derived(
		contacts.filter((contact: Contact) => contact.vip).length,
	);

	// Create and return state object
	const state = {
		// ... getters and methods
	};

	setContext(CONTACT_CONTEXT_KEY, state);
	return state;
}

// Get existing context
export function get_contact_state(): ContactState {
	if (!hasContext(CONTACT_CONTEXT_KEY)) {
		throw new Error('Contact state context has not been initialized');
	}
	return getContext<ContactState>(CONTACT_CONTEXT_KEY);
}
```

### Optimistic Updates

When using state management with server operations (like form submissions),
implement optimistic updates to provide instant feedback:

```typescript
// In your form component
use:enhance={({ formElement }) => {
	return async ({ result }) => {
		if (result.type === 'success') {
			// Optimistically update state before server response
			const formData = new FormData(formElement);
			contact_state.add_contact({
				id: crypto.randomUUID(),
				// ... other fields from form
			});
		}
	};
}}
```

This approach:
1. Updates the UI immediately when the user takes an action
2. Maintains data consistency with automatic derived value updates
3. Provides a smoother user experience

## Integration with SvelteKit

In SvelteKit applications, consider these additional patterns:

### Server-Side State

For server-side state, use `event.locals` in load functions and form
actions:

```typescript
// +page.server.ts
export const load = async ({ locals }) => {
	// Always check if user exists before accessing properties
	if (!locals.user) {
		return { 
			user: null,
			contacts: [] 
		};
	}
	
	return {
		user: locals.user,
		contacts: await get_contacts_for_user(locals.user.id)
	};
};
```

### Client-Side State Initialization

Initialize client-side state from server data:

```svelte
<script>
	import { contact_store } from '$lib/state/contacts.svelte.ts';
	import { onMount } from 'svelte';

	export let data;

	onMount(() => {
		// Initialize store with server data
		if (data.initial_contacts) {
			contact_store.contacts = data.initial_contacts;
		}
	});
</script>
```

## Common Pitfalls to Avoid

1. **Not checking for null/undefined values**: Always add null checks when accessing properties that might be undefined.

2. **Using incorrect $derived syntax**: Remember that `$derived` takes a single expression, while `$derived.by` takes a function for complex logic.

3. **Forgetting to initialize store data**: Always initialize store data in `onMount` to ensure it's only done on the client.

4. **Directly mutating arrays or objects**: Create new copies when updating arrays or objects in state.

5. **Using reactive state outside of components**: Reactive state should be encapsulated in classes for global usage.

6. **Not handling async data properly**: Always handle loading states and errors when fetching data.

## Performance Considerations

- Use `$state.raw` for large arrays or objects that don't need deep
  reactivity
- Avoid unnecessary `$effect` calls that might trigger frequent
  updates
- Consider using `$derived.by` for complex derivations with multiple
  dependencies
