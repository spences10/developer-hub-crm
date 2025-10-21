---
name: component-testing-patterns
description:
  Vitest browser testing with vitest-browser-svelte. Use for unit
  tests, component rendering, user interactions, and form testing.
---

# Component Testing Patterns

## Quick Start

```typescript
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
import MyComponent from './my-component.svelte';

describe('MyComponent', () => {
	it('renders and handles interactions', async () => {
		render(MyComponent, { title: 'Hello' });
		const button = page.getByRole('button', { name: 'Click me' });
		await expect.element(button).toBeInTheDocument();
		await button.click();
	});
});
```

## Core Principles

- Use semantic locators: `getByRole()`, `getByLabel()`, `getByText()`
  before `getByTestId()`
- Tests run in real browsers via Playwright, not JSDOM
- Use `vitest-browser-svelte` render helper for Svelte 5 components
- Handle multiple elements with `.first()`, `.nth()`, `.last()` to
  avoid strict mode errors

## Common Patterns

### Component Rendering with Props & Children

Render components with props and children using `createRawSnippet` for
Svelte 5 snippet support.

## Reference Files

For detailed documentation, see:

- [setup-configuration.md](references/setup-configuration.md) -
  Installation, Vite config, and running tests
- [testing-patterns.md](references/testing-patterns.md) - Component
  tests, events, forms, and mocking
- [locator-strategies.md](references/locator-strategies.md) - Finding
  elements with semantic roles
- [troubleshooting.md](references/troubleshooting.md) - Common errors
  and solutions

## Notes

- File naming: `*.svelte.test.ts` for client tests, `*.ssr.test.ts`
  for SSR, `*.test.ts` for server
- Use `createRawSnippet` for testing components with children snippets
- Strict mode requires unique matches; use selectors for multiple
  elements
- Avoid testing SvelteKit forms directly; test state changes instead

<!--
PROGRESSIVE DISCLOSURE GUIDELINES:
- Keep this file ~50 lines total (max ~150 lines)
- Use 1-2 code blocks only (recommend 1)
- Keep description <200 chars for Level 1 efficiency
- Move detailed docs to references/ for Level 3 loading
- This is Level 2 - quick reference ONLY, not a manual
-->
