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

- **Semantic locators**: Prefer `getByRole()`, `getByLabel()`, `getByText()` over `getByTestId()`
- **Real browsers**: Tests run via Playwright, not JSDOM
- **Svelte 5**: Use `vitest-browser-svelte` render helper
- **Multiple elements**: Use `.first()`, `.nth()`, `.last()` to avoid strict mode errors
- **Children/snippets**: Use `createRawSnippet` for testing components with children
- **File naming**: `*.svelte.test.ts` (client), `*.ssr.test.ts` (SSR), `*.test.ts` (server)

## Reference Files

- [setup-configuration.md](references/setup-configuration.md) - Installation and Vite config
- [testing-patterns.md](references/testing-patterns.md) - Component tests, events, forms, mocking
- [locator-strategies.md](references/locator-strategies.md) - Finding elements with semantic roles
- [troubleshooting.md](references/troubleshooting.md) - Common errors and solutions
