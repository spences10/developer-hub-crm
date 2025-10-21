# Setup & Configuration

## Installation

### Create New SvelteKit Project

```bash
pnpm dlx sv@latest create my-testing-app
```

Select options:

- Template: SvelteKit minimal
- TypeScript: Yes, using TypeScript syntax
- Additions: Include vitest for unit testing

### Install Browser Testing Dependencies

```bash
cd my-testing-app
pnpm install -D @vitest/browser vitest-browser-svelte playwright
pnpm un @testing-library/jest-dom @testing-library/svelte jsdom
```

## Vite Configuration

### Multi-Project Setup

Update `vite.config.ts` with the "Client-Server Alignment Strategy":

```typescript
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	test: {
		projects: [
			{
				name: 'client',
				environment: 'browser',
				testTimeout: 2000,
				browser: {
					enabled: true,
					provider: 'playwright',
					instances: [{ browser: 'chromium' }],
				},
				include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
				setupFiles: ['./src/vitest-setup-client.ts'],
			},
			{
				name: 'ssr',
				environment: 'node',
				include: ['src/**/*.ssr.{test,spec}.{js,ts}'],
			},
			{
				name: 'server',
				environment: 'node',
				include: ['src/**/*.{test,spec}.{js,ts}'],
			},
		],
	},
});
```

### Vitest Setup File

Create `src/vitest-setup-client.ts`:

```typescript
/// <reference types="@vitest/browser/matchers" />
/// <reference types="@vitest/browser/providers/playwright" />
```

## File Naming Conventions

- `*.svelte.test.ts` - Client-side component tests (runs in browser)
- `*.ssr.test.ts` - Server-side rendering tests (runs in Node)
- `*.test.ts` - Server/utility tests (runs in Node)

## Running Tests

```bash
# Run all tests once
pnpm run test:unit

# Run specific component in watch mode
pnpm vitest src/lib/components/my-button.svelte

# Run only client tests
pnpm vitest --project client

# Run with UI
pnpm vitest --ui
```

## Package.json Scripts

```json
{
	"scripts": {
		"test:unit": "vitest",
		"test:unit:ui": "vitest --ui",
		"test:unit:watch": "vitest --watch"
	}
}
```
