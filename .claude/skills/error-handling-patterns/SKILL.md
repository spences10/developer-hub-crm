---
name: error-handling-patterns
description:
  Svelte 5 error handling. Use for error boundaries, async await
  expressions, loading states, and form errors.
---

# Error Handling Patterns

## Quick Start

```svelte
<script lang="ts">
	import { get_contacts } from './contacts.remote';
</script>

<svelte:boundary>
	<ul>
		{#each await get_contacts() as contact}
			<li>{contact.name}</li>
		{/each}
	</ul>

	{#snippet pending()}
		<div class="loading">Loading...</div>
	{/snippet}

	{#snippet failed(error, reset)}
		<div class="error">
			<p>Error: {error.message}</p>
			<button onclick={reset}>Retry</button>
		</div>
	{/snippet}
</svelte:boundary>
```

## Core Principles

- Use `<svelte:boundary>` to catch errors in components
- Provide `pending` snippet for loading states
- Provide `failed` snippet with retry functionality
- Use `await` expressions directly in markup for remote functions
- Wrap individual features, not entire pages (granular boundaries)

## Common Patterns

### Error Boundary with Loading State

Wrap components with `<svelte:boundary>` and provide `pending` and
`failed` snippets.

### Form Error Handling

Remote functions automatically provide `.error` property - check
`create_contact.error` in your form.

### Nested Boundaries

Create boundaries at different levels for granular control - wrap
individual features, not entire pages.

## Reference Files

- [references/error-handling-guide.md](references/error-handling-guide.md) -
  Complete error handling patterns and examples

## Notes

- Always provide retry functionality via reset button
- Use granular boundaries for better UX (feature-level, not
  page-level)
- Log errors with `onerror` callback for monitoring
- Parallel loading: Multiple await expressions load in parallel
  automatically
