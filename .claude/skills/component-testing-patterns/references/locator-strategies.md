# Locator Strategies

## Priority Order

Use locators in this order of preference:

1. **Semantic roles** - `getByRole()`
2. **Labels** - `getByLabel()`
3. **Text content** - `getByText()`
4. **Test IDs** - `getByTestId()`

## Semantic Roles (Recommended)

### Buttons

```typescript
page.getByRole('button', { name: 'Submit' });
page.getByRole('button', { name: /submit/i }); // Case insensitive
```

### Links

```typescript
page.getByRole('link', { name: 'Home' });
page.getByRole('link', { name: 'Contact Us' });
```

### Headings

```typescript
page.getByRole('heading', { name: 'Welcome', level: 1 });
page.getByRole('heading', { level: 2 });
```

### Form Elements

```typescript
page.getByRole('textbox', { name: 'Email' });
page.getByRole('checkbox', { name: 'Accept terms' });
page.getByRole('radio', { name: 'Option 1' });
page.getByRole('combobox', { name: 'Country' });
```

### Other Common Roles

```typescript
page.getByRole('navigation');
page.getByRole('main');
page.getByRole('banner');
page.getByRole('contentinfo');
page.getByRole('dialog');
page.getByRole('alert');
page.getByRole('status');
page.getByRole('list');
page.getByRole('listitem');
page.getByRole('table');
page.getByRole('row');
page.getByRole('cell');
```

## By Label (Form Elements)

Best for form inputs with associated labels:

```typescript
page.getByLabel('Email address');
page.getByLabel('Password');
page.getByLabel('Remember me');
```

Component example:

```svelte
<label>
	Email address
	<input type="email" name="email" />
</label>
```

Or with `for` attribute:

```svelte
<label for="email">Email address</label>
<input id="email" type="email" name="email" />
```

## By Text

For elements containing specific text:

```typescript
page.getByText('Welcome back');
page.getByText(/welcome/i); // Case insensitive
page.getByText('Error:', { exact: false }); // Partial match
```

## By Test ID

Last resort when semantic locators aren't available:

```typescript
page.getByTestId('submit-button');
page.getByTestId('user-profile');
```

Component example:

```svelte
<button data-testid="submit-button">Submit</button>
```

## By Placeholder

For inputs with placeholder text:

```typescript
page.getByPlaceholder('Enter your email');
page.getByPlaceholder(/search/i);
```

## By Alt Text

For images:

```typescript
page.getByAltText('Company logo');
page.getByAltText(/profile/i);
```

## By Title

For elements with title attributes:

```typescript
page.getByTitle('Close');
page.getByTitle('More information');
```

## Combining Locators

### Filtering

```typescript
page.getByRole('button').filter({ hasText: 'Delete' });
page.getByRole('listitem').filter({ has: page.getByRole('button') });
```

### Chaining

```typescript
page.getByRole('navigation').getByRole('link', { name: 'Home' });
page.getByTestId('user-card').getByRole('button', { name: 'Edit' });
```

## Handling Multiple Matches

### Selectors

```typescript
page.getByRole('button').first();
page.getByRole('button').last();
page.getByRole('button').nth(1); // Zero-indexed
```

### Getting All

```typescript
const buttons = page.getByRole('button').all();
expect(buttons).toHaveLength(3);
```

## State-Based Locators

### Disabled

```typescript
page.getByRole('button', { disabled: true });
page.getByRole('button', { disabled: false });
```

### Checked

```typescript
page.getByRole('checkbox', { checked: true });
page.getByRole('radio', { checked: false });
```

### Expanded

```typescript
page.getByRole('button', { expanded: true });
```

### Pressed

```typescript
page.getByRole('button', { pressed: true });
```

## Advanced Patterns

### Within Specific Container

```typescript
const dialog = page.getByRole('dialog');
dialog.getByRole('button', { name: 'Confirm' });
```

### By CSS Selector (Avoid)

Only use as last resort:

```typescript
page.locator('.my-custom-class');
page.locator('#unique-id');
page.locator('[data-custom-attr="value"]');
```

### By XPath (Avoid)

```typescript
page.locator('xpath=//button[contains(text(), "Submit")]');
```

## Best Practices

1. **Always prefer semantic roles** - They match how users and
   assistive technologies interact
2. **Use exact names when possible** - More explicit and less fragile
3. **Avoid CSS classes** - They're implementation details that change
4. **Avoid XPath** - Hard to read and maintain
5. **Use test IDs sparingly** - Only when no semantic option exists
6. **Test accessibility** - If you can't find it with semantic
   locators, users with screen readers can't either

## Common ARIA Roles Reference

| Role          | HTML Element                        | Example                |
| ------------- | ----------------------------------- | ---------------------- |
| `button`      | `<button>`, `<input type="button">` | Clickable buttons      |
| `link`        | `<a href>`                          | Navigation links       |
| `heading`     | `<h1>` to `<h6>`                    | Section headings       |
| `textbox`     | `<input type="text">`, `<textarea>` | Text inputs            |
| `checkbox`    | `<input type="checkbox">`           | Checkboxes             |
| `radio`       | `<input type="radio">`              | Radio buttons          |
| `combobox`    | `<select>`, custom dropdowns        | Dropdowns              |
| `navigation`  | `<nav>`                             | Navigation areas       |
| `main`        | `<main>`                            | Main content           |
| `banner`      | `<header>`                          | Page header            |
| `contentinfo` | `<footer>`                          | Page footer            |
| `dialog`      | Custom dialogs with `role="dialog"` | Modal dialogs          |
| `alert`       | Elements with `role="alert"`        | Error/warning messages |
