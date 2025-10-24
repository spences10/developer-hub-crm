# Comprehensive Component Testing Patterns

## Essential Imports

```typescript
import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { flushSync, untrack } from 'svelte';
```

## Locator Strategies

### Semantic Queries (Preferred)

```typescript
// Role-based (most accessible)
page.getByRole('button', { name: 'Submit' });
page.getByRole('textbox', { name: 'Email' });
page.getByRole('heading', { level: 1 });

// Label-based (forms)
page.getByLabelText('Email');
page.getByLabelText('Password', { exact: true });

// Text content
page.getByText('Welcome');
page.getByText(/hello/i);

// Test IDs (last resort)
page.getByTestId('custom-element');
```

### Handling Multiple Matches

When strict mode fails due to multiple elements:

```typescript
// Get first match
const firstButton = page.getByRole('button').first();

// Get nth match (0-indexed)
const secondButton = page.getByRole('button').nth(1);

// Get last match
const lastButton = page.getByRole('button').last();
```

## Component Testing Patterns

### Button Component

```typescript
describe('Button', () => {
	it('renders with different variants', async () => {
		render(Button, { variant: 'primary', label: 'Click' });
		const button = page.getByRole('button', { name: 'Click' });

		await expect.element(button).toBeInTheDocument();
		await expect.element(button).toHaveClass(/primary/);
	});

	it('handles click events', async () => {
		const handleClick = vi.fn();
		render(Button, { onclick: handleClick, label: 'Click' });

		const button = page.getByRole('button');
		await button.click();

		expect(handleClick).toHaveBeenCalledOnce();
	});

	it('respects disabled state', async () => {
		render(Button, { disabled: true, label: 'Submit' });
		const button = page.getByRole('button');

		await expect.element(button).toBeDisabled();
	});

	it('clicks animated elements', async () => {
		render(Button, { animated: true });
		const button = page.getByRole('button');

		// Force click through animations
		await button.click({ force: true });
	});
});
```

### Input Component

```typescript
describe('Input', () => {
	it('accepts user input', async () => {
		render(Input, { label: 'Email' });
		const input = page.getByRole('textbox', { name: 'Email' });

		await input.fill('user@example.com');

		await expect.element(input).toHaveValue('user@example.com');
	});

	it('displays validation errors', async () => {
		render(Input, { label: 'Email', error: 'Invalid email' });

		const error = page.getByText('Invalid email');
		await expect.element(error).toBeVisible();
	});

	it('shows correct input type', async () => {
		render(Input, { type: 'password', label: 'Password' });
		const input = page.getByLabelText('Password');

		await expect.element(input).toHaveAttribute('type', 'password');
	});
});
```

### Modal Component

```typescript
describe('Modal', () => {
	it('manages focus correctly', async () => {
		render(Modal, { open: true, title: 'Confirm' });
		const modal = page.getByRole('dialog');

		await expect.element(modal).toBeFocused();
	});

	it('closes on escape key', async () => {
		const handleClose = vi.fn();
		render(Modal, { open: true, onclose: handleClose });

		await page.keyboard.press('Escape');

		expect(handleClose).toHaveBeenCalled();
	});

	it('traps focus within modal', async () => {
		render(Modal, { open: true });
		const closeButton = page.getByRole('button', { name: 'Close' });

		await page.keyboard.press('Tab');
		await expect.element(closeButton).toBeFocused();
	});
});
```

### Dropdown Component

```typescript
describe('Dropdown', () => {
	it('toggles open/closed state', async () => {
		render(Dropdown, { options: ['A', 'B', 'C'] });
		const trigger = page.getByRole('button');

		await trigger.click();

		const menu = page.getByRole('listbox');
		await expect.element(menu).toBeVisible();
	});

	it('selects option on click', async () => {
		render(Dropdown, { options: ['Apple', 'Banana'] });

		await page.getByRole('button').click();
		await page.getByText('Banana').click();

		const display = page.getByRole('button');
		await expect.element(display).toHaveTextContent('Banana');
	});

	it('handles keyboard navigation', async () => {
		render(Dropdown, { options: ['A', 'B', 'C'] });
		const trigger = page.getByRole('button');

		await trigger.focus();
		await page.keyboard.press('Enter');
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('Enter');

		await expect.element(trigger).toHaveTextContent('B');
	});
});
```

## Svelte 5 Runes Testing

### Testing $state and $derived

Must use `.test.svelte.ts` extension:

```typescript
import { flushSync, untrack } from 'svelte';

describe('Counter with runes', () => {
	it('updates reactive state', () => {
		let count = $state(0);
		let doubled = $derived(count * 2);

		expect(count).toBe(0);
		expect(untrack(() => doubled)).toBe(0);

		count = 5;
		flushSync();

		expect(count).toBe(5);
		expect(untrack(() => doubled)).toBe(10);
	});
});
```

### Form Validation with Runes

```typescript
it('validates form with $derived', () => {
	let email = $state('');
	let isValid = $derived(email.includes('@'));

	// Forms start valid (pre-validation)
	expect(untrack(() => isValid)).toBe(false);

	email = 'user@example.com';
	flushSync();

	expect(untrack(() => isValid)).toBe(true);
});
```

## Integration Testing

### Form Submission Flow

```typescript
describe('Login Form', () => {
	it('submits with valid credentials', async () => {
		const handleSubmit = vi.fn();
		render(LoginForm, { onsubmit: handleSubmit });

		// Fill form
		await page.getByLabelText('Email').fill('user@example.com');
		await page.getByLabelText('Password').fill('password123');

		// Submit
		await page.getByRole('button', { name: 'Login' }).click();

		// Verify
		expect(handleSubmit).toHaveBeenCalledWith({
			email: 'user@example.com',
			password: 'password123',
		});

		// Check success state
		const success = page.getByText('Login successful');
		await expect.element(success).toBeVisible();
	});
});
```

### Todo List Operations

```typescript
describe('Todo List', () => {
	it('manages todo lifecycle', async () => {
		render(TodoList);

		// Add todo
		const input = page.getByRole('textbox');
		await input.fill('Buy milk');
		await page.getByRole('button', { name: 'Add' }).click();

		const todo = page.getByText('Buy milk');
		await expect.element(todo).toBeInTheDocument();

		// Complete todo
		const checkbox = page.getByRole('checkbox');
		await checkbox.click();
		await expect.element(checkbox).toBeChecked();

		// Delete todo
		await page.getByRole('button', { name: 'Delete' }).click();
		await expect.element(todo).not.toBeInTheDocument();
	});
});
```

## SSR Testing Decision Framework

### Always Add SSR Tests For:

- Form components (progressive enhancement)
- Navigation elements (SEO and accessibility)
- Content-heavy components (search engine visibility)
- Layout shells (hydration mismatch prevention)

### Skip SSR Tests For:

- Pure interaction components (modals, dropdowns)
- Client-only features (charts, maps)
- Simple presentational elements

### SSR Test Example

```typescript
// my-form.ssr.test.ts
import { render } from 'vitest-browser-svelte/ssr';
import { describe, expect, it } from 'vitest';
import MyForm from './my-form.svelte';

describe('MyForm SSR', () => {
	it('renders form fields server-side', async () => {
		const { container } = render(MyForm);
		const html = container.innerHTML;

		expect(html).toContain('input');
		expect(html).toContain('type="email"');
	});
});
```

## Async Patterns

### Testing Loading States

```typescript
describe('Async Data Component', () => {
	it('shows loading state', async () => {
		render(AsyncComponent);

		const loading = page.getByText('Loading...');
		await expect.element(loading).toBeVisible();
	});

	it('displays data after load', async () => {
		render(AsyncComponent);

		const data = page.getByText('Data loaded');
		await expect.element(data).toBeVisible();
	});

	it('handles errors gracefully', async () => {
		render(AsyncComponent, { shouldFail: true });

		const error = page.getByText('Error loading data');
		await expect.element(error).toBeVisible();
	});
});
```

## Anti-Patterns to Avoid

❌ **Never use containers**

```typescript
// Bad
const { container } = render(Component);
const button = container.querySelector('button');
```

✅ **Always use locators**

```typescript
// Good
render(Component);
const button = page.getByRole('button');
```

❌ **Don't test implementation details**

```typescript
// Bad
expect(svg).toHaveAttribute('d', 'M10,20...');
```

✅ **Test user-visible behavior**

```typescript
// Good
await expect.element(icon).toHaveClass('icon-check');
```

❌ **Don't assume element roles**

```typescript
// Bad - input is actually 'textbox'
page.getByRole('input');
```

✅ **Verify roles in browser dev tools**

```typescript
// Good
page.getByRole('textbox');
```
