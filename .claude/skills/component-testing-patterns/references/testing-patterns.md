# Testing Patterns

## Basic Component Test

```typescript
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
import MyButton from './my-button.svelte';

describe('MyButton', () => {
	it('should render with correct text', async () => {
		render(MyButton, { text: 'Click me' });
		const button = page.getByRole('button', { name: 'Click me' });
		await expect.element(button).toBeInTheDocument();
	});
});
```

## Testing with Children (Snippets)

For Svelte 5 components that accept children, use `createRawSnippet`:

```typescript
import { createRawSnippet } from 'svelte';

it('should render with children', async () => {
	const children = createRawSnippet(() => ({
		render: () => `<span>Button Text</span>`,
	}));

	render(MyButton, { children });
	const button = page.getByRole('button', { name: 'Button Text' });
	await expect.element(button).toBeInTheDocument();
});
```

## Testing Click Events

```typescript
import { vi } from 'vitest';

it('should handle click events', async () => {
	const click_handler = vi.fn();
	render(MyButton, { onclick: click_handler, text: 'Click me' });

	const button = page.getByRole('button', { name: 'Click me' });
	await button.click();

	expect(click_handler).toHaveBeenCalledOnce();
});
```

## Testing Form Inputs

```typescript
it('should handle form input', async () => {
	render(MyForm);

	const input = page.getByLabel('Email address');
	await input.fill('[email protected]');

	const value = await input.evaluate(
		(el) => (el as HTMLInputElement).value,
	);
	expect(value).toBe('[email protected]');
});
```

## Testing Conditional Rendering

```typescript
it('should show error message on invalid input', async () => {
	render(MyForm);

	const input = page.getByLabel('Email');
	await input.fill('invalid-email');

	const submitButton = page.getByRole('button', { name: 'Submit' });
	await submitButton.click();

	await expect
		.element(page.getByText('Invalid email address'))
		.toBeInTheDocument();
});
```

## Testing Props Changes

```typescript
it('should update when props change', async () => {
	const { rerender } = render(MyComponent, { count: 0 });

	await expect
		.element(page.getByText('Count: 0'))
		.toBeInTheDocument();

	rerender({ count: 5 });

	await expect
		.element(page.getByText('Count: 5'))
		.toBeInTheDocument();
});
```

## Testing Async Operations

```typescript
it('should handle async data loading', async () => {
	render(MyComponent);

	// Initially shows loading state
	await expect
		.element(page.getByText('Loading...'))
		.toBeInTheDocument();

	// Wait for data to load
	await expect
		.element(page.getByText('Data loaded'))
		.toBeInTheDocument();
});
```

## Testing Multiple Elements

When multiple elements match, use selectors:

```typescript
it('should handle multiple buttons', async () => {
	render(MyComponent);

	const buttons = page.getByRole('button', { name: 'Action' });

	// Select specific instance
	await buttons.first().click();
	await buttons.nth(1).click();
	await buttons.last().click();
});
```

## Testing Disabled States

```typescript
it('should disable button when loading', async () => {
	render(MyButton, { disabled: true });

	const button = page.getByRole('button');
	await expect.element(button).toBeDisabled();
});
```

## Testing CSS Classes

```typescript
it('should apply correct variant class', async () => {
	render(MyButton, { variant: 'primary' });

	const button = page.getByRole('button');
	const className = await button.evaluate((el) => el.className);

	expect(className).toContain('btn-primary');
});
```

## Testing Event Modifiers

```typescript
it('should prevent default on form submit', async () => {
	const submit_handler = vi.fn();
	render(MyForm, { onsubmit: submit_handler });

	const form = page.getByRole('form');
	await form.evaluate((el) => {
		el.dispatchEvent(new Event('submit', { cancelable: true }));
	});

	expect(submit_handler).toHaveBeenCalled();
});
```

## Testing Accessibility

```typescript
it('should have accessible name', async () => {
	render(MyButton, { 'aria-label': 'Close dialog' });

	const button = page.getByRole('button', { name: 'Close dialog' });
	await expect.element(button).toBeInTheDocument();
});
```

## Mocking Modules

```typescript
import { vi } from 'vitest';

vi.mock('$app/navigation', () => ({
	goto: vi.fn(),
}));

it('should navigate on click', async () => {
	const { goto } = await import('$app/navigation');
	render(MyLink);

	const link = page.getByRole('link', { name: 'Home' });
	await link.click();

	expect(goto).toHaveBeenCalledWith('/home');
});
```
