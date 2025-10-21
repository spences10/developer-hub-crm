# Troubleshooting

## Common Issues and Solutions

### Strict Mode Violation Error

**Error:**

```
Error: locator.click: strict mode violation: getByRole('button') resolved to 2 elements
```

**Cause:** Multiple elements match your locator in strict mode.

**Solutions:**

1. Make the locator more specific:

```typescript
// Instead of:
page.getByRole('button');

// Use:
page.getByRole('button', { name: 'Submit' });
```

2. Use selectors for expected multiple matches:

```typescript
page.getByRole('button').first();
page.getByRole('button').nth(1);
page.getByRole('button').last();
```

3. Filter by container:

```typescript
page.getByTestId('modal').getByRole('button', { name: 'Close' });
```

### Test Hangs or Times Out

**Symptoms:** Test runs indefinitely or hits timeout.

**Common Causes:**

1. **SvelteKit form actions** - Don't test actual form submissions:

```typescript
// Don't do this:
await page.getByRole('button', { name: 'Submit' }).click();

// Do this instead - test state changes:
const { component } = render(MyForm);
// Test component state directly
```

2. **Missing await** - Always await async operations:

```typescript
// Wrong:
button.click();

// Correct:
await button.click();
```

3. **Waiting for elements that never appear:**

```typescript
// Add timeout or check existence first:
const element = page.getByText('Success');
await expect.element(element).toBeInTheDocument({ timeout: 5000 });
```

### Mock Function Signature Mismatch

**Error:**

```
Type '() => void' is not assignable to type '(event: CustomEvent) => void'
```

**Solution:** Match the expected function signature:

```typescript
// Wrong:
const handler = vi.fn();

// Correct:
const handler = vi.fn((event: CustomEvent) => {});

// Or use type assertion:
const handler = vi.fn() as (event: CustomEvent) => void;
```

### Element Not Found

**Error:**

```
Error: locator.click: getByRole('button') resolved to 0 elements
```

**Debugging Steps:**

1. Check if element is rendered:

```typescript
// Log the page content:
const content = await page.locator('body').innerHTML();
console.log(content);
```

2. Try different locator strategies:

```typescript
// Try by text:
page.getByText('Submit');

// Try by test ID:
page.getByTestId('submit-button');

// Try by CSS:
page.locator('button[type="submit"]');
```

3. Wait for element to appear:

```typescript
await expect
	.element(page.getByRole('button'))
	.toBeInTheDocument({ timeout: 5000 });
```

### Cannot Access `.current` Property

**Error:**

```
Cannot read property 'current' of undefined
```

**Cause:** Trying to access remote function state incorrectly.

**Solution:**

```typescript
// Wrong:
expect(data.current).toBe('value');

// Correct - check if state exists first:
if (data.current) {
	expect(data.current.value).toBe('expected');
}
```

### Snippets Not Rendering

**Error:** Children don't render or show empty content.

**Solution:** Use `createRawSnippet` correctly:

```typescript
import { createRawSnippet } from 'svelte';

const children = createRawSnippet(() => ({
	render: () => `<span>Content</span>`,
}));

render(MyComponent, { children });
```

### Module Mock Not Working

**Issue:** Mocked module still uses real implementation.

**Solution:** Ensure mock is defined before import:

```typescript
import { vi } from 'vitest';

// Mock BEFORE importing the component:
vi.mock('$app/navigation', () => ({
	goto: vi.fn(),
}));

// Now import:
import MyComponent from './my-component.svelte';
```

### Playwright Browser Not Starting

**Error:**

```
browserType.launch: Executable doesn't exist
```

**Solution:** Install Playwright browsers:

```bash
pnpm exec playwright install chromium
# Or for all browsers:
pnpm exec playwright install
```

### Test File Not Detected

**Issue:** Vitest doesn't run your test file.

**Check:**

1. File naming matches config:
   - Client: `*.svelte.test.ts`
   - SSR: `*.ssr.test.ts`
   - Server: `*.test.ts`

2. File location matches include pattern in `vite.config.ts`:

```typescript
include: ['src/**/*.svelte.{test,spec}.{js,ts}'];
```

### Type Errors with Vitest Browser

**Error:**

```
Cannot find name 'page' or module '@vitest/browser/context'
```

**Solution:** Add type references to `vitest-setup-client.ts`:

```typescript
/// <reference types="@vitest/browser/matchers" />
/// <reference types="@vitest/browser/providers/playwright" />
```

### Assertion Not Awaited

**Error:**

```
Promise returned from expect was not awaited
```

**Solution:** Always await browser assertions:

```typescript
// Wrong:
expect.element(button).toBeInTheDocument();

// Correct:
await expect.element(button).toBeInTheDocument();
```

### Form Input Not Updating

**Issue:** Input value doesn't change when using `.fill()`.

**Solution:**

1. Ensure element is an input:

```typescript
const input = page.getByLabel('Email');
await expect.element(input).toBeInTheDocument();
await input.fill('[email protected]');
```

2. Try dispatching input event:

```typescript
await input.evaluate((el, value) => {
	(el as HTMLInputElement).value = value;
	el.dispatchEvent(new Event('input', { bubbles: true }));
}, '[email protected]');
```

### Component State Not Updating

**Issue:** Props change but UI doesn't update.

**Solution:** Use `rerender` and wait for updates:

```typescript
const { rerender } = render(MyComponent, { count: 0 });

await expect.element(page.getByText('0')).toBeInTheDocument();

rerender({ count: 1 });

// Wait for update:
await expect.element(page.getByText('1')).toBeInTheDocument();
```

## Debugging Tips

### 1. Use Vitest UI

```bash
pnpm vitest --ui
```

Provides visual test runner with debugging tools.

### 2. Add Screenshots

```typescript
import { page } from '@vitest/browser/context';

it('should work', async () => {
	render(MyComponent);
	await page.screenshot({ path: 'debug.png' });
});
```

### 3. Pause Test Execution

```typescript
import { page } from '@vitest/browser/context';

it('should work', async () => {
	render(MyComponent);
	await page.pause(); // Opens browser inspector
});
```

### 4. Console Logs

```typescript
// Log component HTML:
const html = await page.locator('body').innerHTML();
console.log(html);

// Log element properties:
const button = page.getByRole('button');
const text = await button.textContent();
console.log('Button text:', text);
```

### 5. Increase Timeout

```typescript
// Per test:
it('slow test', { timeout: 10000 }, async () => {
	// test code
});

// Per assertion:
await expect.element(button).toBeInTheDocument({ timeout: 5000 });
```

## Performance Issues

### Tests Running Slowly

**Solutions:**

1. Reduce `testTimeout` in config:

```typescript
browser: {
  testTimeout: 2000, // Default is 5000
}
```

2. Run tests in parallel (default in Vitest)

3. Use `.skip()` or `.only()` during development:

```typescript
it.only('this test only', async () => {});
it.skip('skip this', async () => {});
```

### Too Many Browser Instances

**Solution:** Limit instances in config:

```typescript
browser: {
  instances: [{ browser: 'chromium' }],
  headless: true,
}
```
