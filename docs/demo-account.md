# Demo Account

One-click demo access with pre-populated data (18 contacts, 37
interactions, 20 follow-ups). Auto-resets every 6 hours.

## Implementation

**Remote function (`src/routes/auth.remote.ts`):**

```typescript
export const demo_login = command(async () => {
	await auth.api.signInEmail({
		body: { email: 'demo@devhub.party', password: 'demo1234567890' },
		headers: getRequestEvent().request.headers,
	});
	return { success: true };
});
```

**Landing page button:**

```svelte
<script>
	import { goto } from '$app/navigation';
	import { demo_login } from './auth.remote';

	async function handle_demo_login() {
		const result = await demo_login();
		if (result.success) goto('/dashboard');
	}
</script>

<button onclick={handle_demo_login}>Try Demo</button>
```

**Demo banner (`src/routes/(app)/+layout.svelte`):**

```svelte
{#if user?.email === 'demo@devhub.party'}
	<div class="alert alert-info">
		Demo mode - data resets every 6 hours. <a href="/register"
			>Sign up</a
		> to keep your data.
	</div>
{/if}
```

## Setup

**1. Seed demo:**

```bash
curl -X POST https://devhub.party/api/ingest \
  -H "Content-Type: application/json" \
  -d '{"task": "seed_demo", "token": "your-ingest-token"}'
```

**2. Add GitHub Secret:**

- Repo → Settings → Secrets → Actions → `INGEST_TOKEN`

**3. Auto-reset:** `.github/workflows/demo-reset.yml` runs every 6
hours

## Optional Restrictions

```typescript
if (user.email === 'demo@devhub.party') {
	return { error: 'Not available in demo mode' };
}
```
