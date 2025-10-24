# Complete Vitest Browser Mode Setup

## Initial Project Setup

If starting a new SvelteKit project:

```bash
pnpm dlx sv@latest create my-app
```

Select during setup:

- Template: "SvelteKit minimal"
- TypeScript: "Yes, using TypeScript syntax"
- Add: prettier, eslint, vitest, playwright

## Install Dependencies

```bash
pnpm install -D @vitest/browser-playwright vitest-browser-svelte playwright

# Remove old testing library if migrating
pnpm un @testing-library/jest-dom @testing-library/svelte jsdom
```

## Configure Vitest (vite.config.ts)

Multi-project setup for client, SSR, and server tests:

```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		projects: [
			{
				extends: true,
				test: {
					name: 'client',
					testTimeout: 2000,
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'chromium' }],
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: [
						'src/lib/server/**',
						'src/**/*.ssr.{test,spec}.{js,ts}',
					],
					setupFiles: ['./src/vitest-setup-client.ts'],
				},
			},
			{
				extends: true,
				test: {
					name: 'ssr',
					environment: 'node',
					include: ['src/**/*.ssr.{test,spec}.{js,ts}'],
				},
			},
			{
				extends: true,
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: [
						'src/**/*.svelte.{test,spec}.{js,ts}',
						'src/**/*.ssr.{test,spec}.{js,ts}',
					],
				},
			},
		],
		coverage: {
			include: ['src'],
		},
	},
});
```

## Setup File (src/vitest-setup-client.ts)

```typescript
/// <reference types="vitest/browser" />
/// <reference types="@vitest/browser-playwright" />
```

## Run Tests

```bash
# Run all tests
pnpm run test:unit

# Watch mode for specific file
pnpm vitest src/lib/components/button.svelte

# Run specific project
pnpm vitest --project=client
pnpm vitest --project=ssr
pnpm vitest --project=server
```

## File Naming Conventions

- `*.svelte.test.ts` - Component tests (browser mode)
- `*.ssr.test.ts` - SSR tests (Node environment)
- `*.test.ts` - Server/utility tests (Node environment)

## Key Dependencies

- `vitest` - Test framework
- `@vitest/browser-playwright` - Browser provider
- `vitest-browser-svelte` - Svelte-specific rendering
- `playwright` - Browser automation

## Troubleshooting

### Playwright Installation

If browser binaries are missing:

```bash
pnpm exec playwright install chromium
```

### TypeScript Types

Ensure setup file has proper reference directives for IDE support.

### Timeout Issues

Increase `testTimeout` in config if tests timeout (default: 2000ms).
