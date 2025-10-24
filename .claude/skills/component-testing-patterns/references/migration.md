# Migration Guide: @testing-library/svelte to vitest-browser-svelte

## Why Migrate?

### Key Benefits

1. **Real Browser Testing**: Tests run in actual Playwright browsers
   instead of jsdom simulation
2. **Better Svelte 5 Support**: Native compatibility with runes,
   snippets, and modern patterns
3. **Built-in Reliability**: Auto-retry logic eliminates flaky tests
4. **Official Recommendation**: Endorsed by the Svelte team for modern
   projects
5. **Simplified API**: No need for manual `waitFor` patterns

## Core Changes

### 1. Update Dependencies

```bash
# Install new packages
pnpm install -D @vitest/browser-playwright vitest-browser-svelte playwright

# Remove old packages
pnpm un @testing-library/jest-dom @testing-library/svelte jsdom
```

### 2. Import Transformations

#### Before (@testing-library/svelte)

```typescript
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
```

#### After (vitest-browser-svelte)

```typescript
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-svelte';
```

### 3. Query Pattern Changes

#### Before: Screen Queries

```typescript
const button = screen.getByRole('button');
const input = screen.getByLabelText('Email');
const text = screen.getByText('Hello');
```

#### After: Page Locators

```typescript
const button = page.getByRole('button');
const input = page.getByLabelText('Email');
const text = page.getByText('Hello');
```

### 4. Assertion Updates

#### Before: Synchronous Assertions

```typescript
expect(element).toBeInTheDocument();
expect(button).toBeDisabled();
expect(input).toHaveValue('test');
```

#### After: Async Element Assertions

```typescript
await expect.element(element).toBeInTheDocument();
await expect.element(button).toBeDisabled();
await expect.element(input).toHaveValue('test');
```

### 5. Event Handling Simplification

#### Before: userEvent API

```typescript
const user = userEvent.setup();

await user.type(input, 'text');
await user.click(button);
await user.clear(input);
await user.selectOptions(select, 'option');
```

#### After: Direct Element Methods

```typescript
await input.fill('text');
await button.click();
await input.clear();
await select.selectOption('option');
```

### 6. Waiting Patterns

#### Before: Manual waitFor

```typescript
import { waitFor } from '@testing-library/svelte';

await waitFor(() => {
	expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

#### After: Built-in Auto-Retry

```typescript
// No waitFor needed - locators auto-retry
const loaded = page.getByText('Loaded');
await expect.element(loaded).toBeVisible();
```

## Configuration Changes

### Before: jsdom Environment

```typescript
// vite.config.ts
export default defineConfig({
	test: {
		environment: 'jsdom',
		setupFiles: ['./vitest-setup.ts'],
	},
});
```

### After: Browser Mode with Projects

```typescript
// vite.config.ts
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
	test: {
		projects: [
			{
				extends: true,
				test: {
					name: 'client',
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'chromium' }],
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					setupFiles: ['./src/vitest-setup-client.ts'],
				},
			},
		],
	},
});
```

## Complete Example Migration

### Before: @testing-library/svelte

```typescript
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { describe, expect, it } from 'vitest';
import LoginForm from './login-form.svelte';

describe('LoginForm', () => {
	it('submits form with credentials', async () => {
		const user = userEvent.setup();
		render(LoginForm);

		const emailInput = screen.getByLabelText('Email');
		const passwordInput = screen.getByLabelText('Password');
		const submitButton = screen.getByRole('button', {
			name: 'Login',
		});

		await user.type(emailInput, 'user@example.com');
		await user.type(passwordInput, 'password123');
		await user.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText('Success')).toBeInTheDocument();
		});
	});
});
```

### After: vitest-browser-svelte

```typescript
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import LoginForm from './login-form.svelte';

describe('LoginForm', () => {
	it('submits form with credentials', async () => {
		render(LoginForm);

		const emailInput = page.getByLabelText('Email');
		const passwordInput = page.getByLabelText('Password');
		const submitButton = page.getByRole('button', { name: 'Login' });

		await emailInput.fill('user@example.com');
		await passwordInput.fill('password123');
		await submitButton.click();

		const success = page.getByText('Success');
		await expect.element(success).toBeInTheDocument();
	});
});
```

## Common Migration Issues

### Issue: `screen` is not defined

**Problem:**

```typescript
const button = screen.getByRole('button');
// ReferenceError: screen is not defined
```

**Solution:**

```typescript
const button = page.getByRole('button');
```

### Issue: Assertion fails immediately

**Problem:**

```typescript
expect(element).toBeInTheDocument();
// Element not found
```

**Solution:**

```typescript
await expect.element(element).toBeInTheDocument();
```

### Issue: userEvent not working

**Problem:**

```typescript
await user.type(input, 'text');
// userEvent is not defined
```

**Solution:**

```typescript
await input.fill('text');
```

### Issue: Element role confusion

**Problem:**

```typescript
page.getByRole('input'); // Fails
```

**Solution:**

```typescript
page.getByRole('textbox'); // Correct role name
```

## File Renaming

Rename test files to match the new conventions:

- `component.test.ts` → `component.svelte.test.ts` (browser mode)
- Keep `utils.test.ts` as is (Node environment)

## Step-by-Step Migration Process

1. **Update dependencies** (install new, remove old)
2. **Update vite.config.ts** with browser mode configuration
3. **Create setup file** (vitest-setup-client.ts)
4. **Update one test file** as a proof of concept
5. **Verify it works** before proceeding
6. **Migrate remaining tests** file by file
7. **Remove old setup files** and jsdom configuration
8. **Update CI/CD** to install Playwright browsers

## Benefits After Migration

- ✅ No more flaky tests due to timing issues
- ✅ Tests run in real browsers (Chromium, Firefox, WebKit)
- ✅ Better Svelte 5 support with runes
- ✅ Simpler API without waitFor patterns
- ✅ Improved accessibility testing
- ✅ Better debugging with browser dev tools
