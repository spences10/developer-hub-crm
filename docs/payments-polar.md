# Polar.sh Payment Integration

## Overview

Polar.sh is our chosen payment infrastructure for Devhub CRM. It's an
open-source Merchant of Record (MoR) platform designed specifically
for developers selling digital products and SaaS subscriptions.

**TL;DR:** Polar handles all global tax compliance, integrates
seamlessly with our existing Better Auth setup, and costs 20% less
than alternatives.

## Why Polar Over Stripe?

### The Tax Problem

With Stripe alone, you're responsible for:

- Registering for VAT in every EU country where you sell
- Calculating and collecting sales tax in US states
- Filing tax returns in multiple jurisdictions
- Understanding reverse charge mechanisms for B2B sales
- Managing tax thresholds and exemptions

**This is a nightmare for a solo developer or small team.**

### Polar as Merchant of Record

As a Merchant of Record, Polar becomes the seller of record for all
transactions. This means:

- **Polar handles all tax compliance globally** - VAT, sales tax,
  everything
- **You receive net payouts** - Tax already calculated and withheld
- **No tax registration needed** - Polar is registered in all
  jurisdictions
- **No tax filing** - Polar files all returns and remits taxes

**You focus on building. Polar handles the tax headaches.**

### Cost Comparison

| Solution            | Transaction Fee | Monthly Cost | Tax Handling | Setup Complexity |
| ------------------- | --------------- | ------------ | ------------ | ---------------- |
| Polar (MoR)         | 4% + 40¢        | $0           | Automatic    | Low              |
| Stripe + Quaderno   | 2.9% + 30¢ + ?? | $49+         | Semi-auto    | Medium           |
| Stripe + Paddle     | 5% + 50¢        | $0           | Automatic    | Medium           |
| Lemon Squeezy (MoR) | 5% + 50¢        | $0           | Automatic    | Low              |
| Stripe alone        | 2.9% + 30¢      | $0           | Manual       | High (DIY tax)   |

**Polar is the cheapest MoR option** and simpler than Stripe + tax
solution.

### Additional Polar Benefits

1. **Better Auth Integration** - Official `@polar-sh/better-auth`
   plugin (we already use Better Auth)
2. **SvelteKit Native** - `@polar-sh/sveltekit` package for easy
   integration
3. **Developer-First** - Excellent APIs, webhooks, SDKs
4. **Open Source** - Can self-host if needed (though hosted service
   recommended)
5. **Usage-Based Billing** - Built-in support for AI feature metering

## Pricing Breakdown

### Polar Fees

- **Base rate:** 4% + 40¢ per successful transaction
- **International cards:** +1.5% additional
- **Subscriptions:** +0.5% additional
- **Disputes:** $15 per dispute
- **Payout fees:** Stripe's standard ($2/month + 0.25% + $0.25 per
  payout)

### Example: Pro Tier ($18/month)

```
Customer pays: $18.00
Polar fee: $1.12 (4% + 40¢)
Payout to us: $16.88
```

### Example: Premium Tier ($35/month)

```
Customer pays: $35.00
Polar fee: $1.80 (4% + 40¢)
Payout to us: $33.20
```

### Revenue Impact (Conservative Month 12)

**Original projection:**

- 1,600 Pro @ $18/mo = $28,800 MRR
- 400 Premium @ $35/mo = $14,000 MRR
- Total: $42,800 MRR

**After Polar fees:**

- Pro net: $16.88 × 1,600 = $27,008
- Premium net: $33.20 × 400 = $13,280
- **Total: $40,288 MRR (~$483k ARR)**
- **Fee cost: ~$2,512/mo (5.9% of gross)**

**This is acceptable.** Tax compliance alone would cost more time and
money.

## Better Auth Integration

### What It Provides

The `@polar-sh/better-auth` plugin integrates payment management
directly into your authentication flow:

1. **Automatic Customer Creation** - New signups auto-create Polar
   customers
2. **Checkout Plugin** - Handle subscription purchases with one
   function call
3. **Customer Portal** - Users manage subscriptions, billing, invoices
4. **Usage Tracking** - Ingest events for usage-based billing (AI
   features)
5. **Webhooks** - Handle subscription lifecycle (created, updated,
   cancelled)

### Installation

```bash
pnpm add @polar-sh/better-auth @polar-sh/sveltekit @polar-sh/sdk
```

### Server Configuration

```typescript
// src/lib/auth.ts
import { betterAuth } from 'better-auth';
import { polar } from '@polar-sh/better-auth';
import {
	checkout,
	portal,
	usage,
	webhooks,
} from '@polar-sh/better-auth';
import { Polar } from '@polar-sh/sdk';

const polarClient = new Polar({
	accessToken: process.env.POLAR_ACCESS_TOKEN!,
	server: process.env.POLAR_SERVER || 'production', // 'sandbox' for testing
});

export const auth = betterAuth({
	database: db,
	plugins: [
		polar({
			client: polarClient,
			createCustomerOnSignUp: true,
			use: [checkout(), portal(), usage(), webhooks()],
			getCustomerCreateParams: async (user) => {
				return {
					email: user.email,
					metadata: {
						userId: user.id,
					},
				};
			},
		}),
	],
});
```

### Client Configuration

```typescript
// src/lib/auth-client.ts
import { createAuthClient } from 'better-auth/react';
import { polarClient } from '@polar-sh/better-auth';

export const authClient = createAuthClient({
	plugins: [polarClient()],
});
```

### Environment Variables

```bash
# Polar Configuration
POLAR_ACCESS_TOKEN=polar_xxx
POLAR_SERVER=sandbox # or 'production'
POLAR_WEBHOOK_SECRET=whsec_xxx
```

## Database Schema

### Required Tables

```sql
-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  polar_customer_id TEXT NOT NULL,
  polar_subscription_id TEXT,
  tier TEXT NOT NULL CHECK (tier IN ('free', 'pro', 'premium')),
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'past_due', 'paused')),
  current_period_start INTEGER NOT NULL,
  current_period_end INTEGER NOT NULL,
  cancel_at_period_end INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Polar customers mapping
CREATE TABLE IF NOT EXISTS polar_customers (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  polar_customer_id TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Webhook events log (for debugging)
CREATE TABLE IF NOT EXISTS polar_webhook_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  polar_event_id TEXT UNIQUE,
  payload TEXT NOT NULL,
  processed INTEGER DEFAULT 0,
  error TEXT,
  created_at INTEGER NOT NULL
);

-- Usage tracking (for AI features)
CREATE TABLE IF NOT EXISTS usage_events (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  feature TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  metadata TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_tier ON subscriptions(tier);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_polar_customers_user_id ON polar_customers(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_events_user_id ON usage_events(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_events_feature ON usage_events(feature);
CREATE INDEX IF NOT EXISTS idx_usage_events_created_at ON usage_events(created_at);
```

## Implementation Phases

### Phase 1: Polar Setup (Week 1)

1. **Create Polar account** - Sign up at polar.sh
2. **Configure organization** - Set up organization details
3. **Create products**:
   - Pro Monthly ($18/month)
   - Pro Annual ($180/year, save 17%)
   - Premium Monthly ($35/month)
   - Premium Annual ($350/year, save 17%)
4. **Define benefits** for each tier (used for feature gating)
5. **Get access tokens** - Create sandbox and production tokens

### Phase 2: Database & Auth (Week 1-2)

1. **Add database tables** - Run schema migrations
2. **Install Polar packages** - Add to package.json
3. **Configure Better Auth** - Add Polar plugin
4. **Test customer creation** - Verify new signups create Polar
   customers
5. **Test in sandbox mode** - Use Polar's test cards

### Phase 3: Checkout Flow (Week 2)

1. **Build pricing page** - `/pricing` route with tier comparison
2. **Implement checkout** - Redirect to Polar checkout
3. **Handle success redirect** - Confirm subscription activation
4. **Add upgrade CTAs** - Throughout app (when hitting limits)

Example checkout handler:

```typescript
// src/routes/api/checkout/+server.ts
import { Checkout } from '@polar-sh/sveltekit';

export const GET = Checkout({
	accessToken: process.env.POLAR_ACCESS_TOKEN!,
	successUrl: `${process.env.PUBLIC_BASE_URL}/dashboard?upgraded=true`,
});
```

Example checkout trigger:

```typescript
// In a component
async function upgradeToProTier() {
	const checkoutUrl = await authClient.polar.checkout({
		productId: 'prod_pro_monthly',
	});
	window.location.href = checkoutUrl;
}
```

### Phase 4: Customer Portal (Week 2)

Allow users to manage subscriptions:

```typescript
// src/routes/settings/billing/+server.ts
import { Portal } from '@polar-sh/sveltekit';

export const GET = Portal({
	accessToken: process.env.POLAR_ACCESS_TOKEN!,
	getCustomerId: async (request) => {
		// Get customer ID from session
		const session = await auth.getSession(request);
		return session.user.polarCustomerId;
	},
});
```

### Phase 5: Feature Gating (Week 3)

Implement tier-based access control:

```typescript
// src/lib/features.ts
type Tier = 'free' | 'pro' | 'premium';

const FEATURE_ACCESS = {
	github_sync_unlimited: ['pro', 'premium'],
	ai_message_drafting: ['pro', 'premium'],
	ai_unlimited: ['premium'],
	custom_qr: ['pro', 'premium'],
	custom_domain: ['premium'],
	ai_agents: ['premium'],
};

export function hasAccess(
	userTier: Tier,
	feature: keyof typeof FEATURE_ACCESS,
): boolean {
	return FEATURE_ACCESS[feature].includes(userTier);
}

// Daily limits for free tier
export const FREE_TIER_LIMITS = {
	github_sync: 10, // per day
	ai_summaries: 5, // per day
	ai_drafts: 0, // none
};
```

Usage in components:

```svelte
<script lang="ts">
	import { hasAccess } from '$lib/features';

	export let userTier: Tier;
</script>

{#if hasAccess(userTier, 'ai_message_drafting')}
	<button on:click={draftMessage}> AI Draft Message </button>
{:else}
	<button on:click={showUpgradeModal}>
		AI Draft Message (Pro)
	</button>
{/if}
```

### Phase 6: Webhooks (Week 3)

Handle subscription lifecycle events:

```typescript
// src/routes/api/webhooks/polar/+server.ts
import { Webhooks } from '@polar-sh/sveltekit';

export const POST = Webhooks({
	webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
	onPayload: async (payload) => {
		// Log event
		await db.insert(polarWebhookEvents).values({
			id: createId(),
			event_type: payload.type,
			polar_event_id: payload.id,
			payload: JSON.stringify(payload),
			created_at: Date.now(),
		});

		// Handle specific events
		switch (payload.type) {
			case 'subscription.created':
				await handleSubscriptionCreated(payload);
				break;
			case 'subscription.updated':
				await handleSubscriptionUpdated(payload);
				break;
			case 'subscription.cancelled':
				await handleSubscriptionCancelled(payload);
				break;
		}
	},
});

async function handleSubscriptionCreated(payload: any) {
	const { customer_id, subscription_id, tier } = payload.data;

	// Update user's subscription in database
	await db.insert(subscriptions).values({
		id: createId(),
		user_id: getUserIdFromPolarCustomer(customer_id),
		polar_customer_id: customer_id,
		polar_subscription_id: subscription_id,
		tier: mapPolarProductToTier(tier),
		status: 'active',
		current_period_start: Date.now(),
		current_period_end: Date.now() + 30 * 24 * 60 * 60 * 1000,
		created_at: Date.now(),
		updated_at: Date.now(),
	});
}
```

## Feature-Specific Integration

### Usage-Based Billing (AI Features)

Track AI feature usage and sync to Polar:

```typescript
// src/lib/usage.ts
import { authClient } from '$lib/auth-client';

export async function trackUsage(
	feature: string,
	quantity: number = 1,
) {
	// Log locally
	await db.insert(usageEvents).values({
		id: createId(),
		user_id: getCurrentUserId(),
		feature,
		quantity,
		created_at: Date.now(),
	});

	// Ingest to Polar (for billing)
	await authClient.polar.ingest({
		events: [
			{
				type: feature,
				timestamp: new Date(),
				properties: {
					quantity,
				},
			},
		],
	});
}

// Usage example
async function generateAIDraft() {
	const userTier = getUserTier();

	if (userTier === 'free') {
		const todayUsage = await getDailyUsage('ai_draft');
		if (todayUsage >= FREE_TIER_LIMITS.ai_drafts) {
			throw new Error('Daily limit reached. Upgrade to Pro!');
		}
	}

	// Generate draft
	const draft = await ai.generateDraft();

	// Track usage
	await trackUsage('ai_draft', 1);

	return draft;
}
```

### GitHub Sync Limits

```typescript
// src/lib/github-sync.ts
export async function syncGitHubContacts() {
	const userTier = getUserTier();

	if (userTier === 'free') {
		const todaySync = await getDailySyncCount();
		if (todaySync >= FREE_TIER_LIMITS.github_sync) {
			throw new Error(
				'Daily GitHub sync limit (10) reached. Upgrade to Pro for unlimited syncs!',
			);
		}
	}

	// Sync contacts...
	await trackUsage('github_sync', 1);
}
```

## Testing

### Sandbox Mode

Polar provides a sandbox environment for testing:

```bash
# .env.local
POLAR_SERVER=sandbox
POLAR_ACCESS_TOKEN=polar_sandbox_xxx
```

### Test Cards

Polar uses Stripe's test cards:

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0027 6000 3184`

### Testing Checklist

- [ ] New user signup creates Polar customer
- [ ] Checkout flow redirects to Polar
- [ ] Successful payment activates subscription
- [ ] User can access Pro features after upgrade
- [ ] Customer portal loads and shows subscription
- [ ] User can cancel subscription
- [ ] Cancelled subscription still works until period end
- [ ] Expired subscription reverts to free tier
- [ ] Webhooks are received and processed
- [ ] Usage events are tracked correctly
- [ ] Upgrade flow works (free → pro → premium)
- [ ] Downgrade flow works (premium → pro → free)

## Migration Plan (When Scaling)

### From Sandbox to Production

1. Create production Polar account
2. Recreate products in production
3. Update environment variables
4. Test with real card (small amount)
5. Deploy to production

### Supporting Annual Plans

Annual plans provide cash flow and reduce churn:

```typescript
// Offer discount in checkout
const checkoutUrl = await authClient.polar.checkout({
	productId: isAnnual ? 'prod_pro_annual' : 'prod_pro_monthly',
	metadata: {
		billing_period: isAnnual ? 'annual' : 'monthly',
	},
});
```

### Volume Pricing (Future)

When revenue grows, negotiate custom rates:

- Contact Polar sales at >$50k MRR
- Negotiate lower percentage (e.g., 3% + 30¢)
- Custom contract for enterprise features

## Security Considerations

1. **Webhook Verification** - Always verify webhook signatures
2. **Customer ID Validation** - Ensure users can only access their own
   subscriptions
3. **Token Security** - Never expose access tokens client-side
4. **Sandbox/Production Separation** - Use different accounts for each

## Support & Resources

- **Polar Docs:** https://polar.sh/docs
- **Better Auth Integration:**
  https://www.better-auth.com/docs/plugins/polar
- **SvelteKit Adapter:**
  https://polar.sh/docs/integrate/sdk/adapters/sveltekit
- **Polar Discord:** https://discord.gg/polar
- **GitHub Issues:** https://github.com/polarsource/polar

## Next Steps

1. Create Polar account and set up organization
2. Add database schema for subscriptions
3. Install and configure Polar + Better Auth
4. Build pricing page
5. Implement checkout flow
6. Add feature gating
7. Test in sandbox mode
8. Launch with soft rollout to early users
9. Monitor webhook events and usage
10. Iterate based on feedback

---

**Last Updated:** October 2025
