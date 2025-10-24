---
name: component-testing-patterns
description:
  Vitest browser mode component testing. Use for testing Svelte 5
  components with real browsers, locators, accessibility patterns, and
  reactive state.
---

# Component Testing Patterns

## Quick Start

```typescript
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';

render(Button, { label: 'Click' });
await page.getByRole('button', { name: 'Click' }).click();
await expect.element(page.getByRole('button')).toBeInTheDocument();
```

## Core Principles

- **Locators, never containers**: `page.getByRole()` auto-retries
- **Semantic queries**: `getByRole()`, `getByLabelText()` for
  accessibility
- **Await assertions**: `await expect.element(el).toBeInTheDocument()`
- **Real browsers**: Tests run in Playwright, not jsdom

## Common Patterns

- **Locators**: `page.getByRole('button')`, `.first()`, `.nth(0)`,
  `.last()`
- **Interactions**: `await input.fill('text')`, `await button.click()`
- **Runes**: Use `.test.svelte.ts` files, `flushSync()`, `untrack()`
- **Files**: `*.svelte.test.ts` (browser), `*.ssr.test.ts` (SSR),
  `*.test.ts` (server)

## References

- [setup.md](references/setup.md) - Vitest browser configuration
- [patterns.md](references/patterns.md) - Detailed testing patterns
- [migration.md](references/migration.md) - From @testing-library

<!--
PROGRESSIVE DISCLOSURE GUIDELINES:
- Keep this file ~50 lines total (max ~150 lines)
- Use 1-2 code blocks only (recommend 1)
- Keep description <200 chars for Level 1 efficiency
- Move detailed docs to references/ for Level 3 loading
- This is Level 2 - quick reference ONLY, not a manual
-->
