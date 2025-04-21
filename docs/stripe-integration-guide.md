# Stripe Integration Guide for Developer Hub CRM

## Overview

This guide outlines the implementation plan for integrating Stripe
payment processing into the Developer Hub CRM. Stripe will be used to
handle subscription management for premium features, allowing the
application to monetize advanced functionality.

## Prerequisites

Before implementing Stripe integration, you'll need:

1. **Stripe Account**: Create a
   [Stripe account](https://dashboard.stripe.com/register)
2. **API Keys**: Obtain API keys from the Stripe Dashboard
   - Test keys for development
   - Live keys for production
3. **Webhook Secret**: Set up webhooks and obtain the signing secret

## Environment Configuration

### Environment Variables

Add the following environment variables to your `.env` file:

```
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Product Configuration
STRIPE_PREMIUM_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...
```

### Configuration in Code

Create a Stripe configuration file:

```typescript
// src/lib/server/stripe/config.ts
import Stripe from 'stripe';
import { env } from '$env/dynamic/private';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
	apiVersion: '2023-10-16', // Use the latest API version
	appInfo: {
		name: 'Developer Hub CRM',
		version: '1.0.0',
	},
});

export const PREMIUM_PRICE_ID = env.STRIPE_PREMIUM_PRICE_ID;
export const ENTERPRISE_PRICE_ID = env.STRIPE_ENTERPRISE_PRICE_ID;
```

## Database Schema Updates

### Subscription Table

Add a new table to track user subscriptions:

```typescript
// src/lib/server/db/schema.ts
export const subscription = sqliteTable('subscription', {
	id: text('id').primaryKey(), // Stripe subscription ID
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	status: text('status').notNull(), // active, canceled, past_due, etc.
	priceId: text('price_id').notNull(), // Stripe price ID
	currentPeriodEnd: integer('current_period_end', {
		mode: 'timestamp_ms',
	}).notNull(),
	cancelAtPeriodEnd: integer('cancel_at_period_end', {
		mode: 'boolean',
	})
		.notNull()
		.default(sql`0`),
	created_at: integer('created_at', { mode: 'timestamp_ms' })
		.notNull()
		.default(sql`((strftime('%s', 'now') * 1000))`),
	updated_at: integer('updated_at', { mode: 'timestamp_ms' })
		.notNull()
		.default(sql`((strftime('%s', 'now') * 1000))`),
});

// Add relation to user
export const userRelations = relations(user, ({ one, many }) => ({
	// ... existing relations
	subscription: one(subscription),
}));
```

### Customer ID Field

Add a Stripe customer ID field to the user table:

```typescript
// Update the user table
export const user = sqliteTable('user', {
	// ... existing fields
	stripeCustomerId: text('stripe_customer_id'),
	...timestamps,
});
```

## Subscription Plans

Define subscription plans in your Stripe dashboard:

1. **Free Tier**:

   - Basic contact management
   - Limited to 50 contacts
   - Basic interaction tracking

2. **Premium Tier** ($9.99/month):

   - Unlimited contacts
   - Enhanced reminder system
   - VIP features
   - Quick Connect feature

3. **Enterprise Tier** ($19.99/month):
   - All Premium features
   - AI-powered features
   - Advanced analytics
   - Team collaboration

## Implementation Steps

### 1. Customer Creation

Create a Stripe customer when a user registers:

```typescript
// src/routes/auth/register/+page.server.ts
import { stripe } from '$lib/server/stripe/config';

// In the register action
const customer = await stripe.customers.create({
	email: email,
	name: username,
	metadata: {
		userId: userId,
	},
});

// Store the customer ID
await db
	.update(user)
	.set({ stripeCustomerId: customer.id })
	.where(eq(user.id, userId));
```

### 2. Checkout Session Creation

Create a checkout session when a user wants to subscribe:

```typescript
// src/routes/settings/billing/+page.server.ts
import {
	stripe,
	PREMIUM_PRICE_ID,
	ENTERPRISE_PRICE_ID,
} from '$lib/server/stripe/config';

export const actions = {
	createCheckoutSession: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, '/auth');
		}

		const data = await request.formData();
		const priceId = data.get('priceId')?.toString();

		if (!priceId) {
			return fail(400, { error: 'Price ID is required' });
		}

		// Get the user's Stripe customer ID
		const userData = await db.query.user.findFirst({
			where: eq(user.id, locals.user.id),
		});

		if (!userData?.stripeCustomerId) {
			// Create a customer if not exists
			const customer = await stripe.customers.create({
				email: userData.email,
				name: userData.username,
				metadata: {
					userId: userData.id,
				},
			});

			await db
				.update(user)
				.set({ stripeCustomerId: customer.id })
				.where(eq(user.id, userData.id));

			userData.stripeCustomerId = customer.id;
		}

		// Create checkout session
		const session = await stripe.checkout.sessions.create({
			customer: userData.stripeCustomerId,
			line_items: [
				{
					price: priceId,
					quantity: 1,
				},
			],
			mode: 'subscription',
			success_url: `${env.PUBLIC_BASE_URL}/settings/billing?success=true`,
			cancel_url: `${env.PUBLIC_BASE_URL}/settings/billing?canceled=true`,
			metadata: {
				userId: locals.user.id,
			},
		});

		if (session.url) {
			throw redirect(303, session.url);
		}

		return fail(500, { error: 'Failed to create checkout session' });
	},
};
```

### 3. Customer Portal

Create a customer portal for managing subscriptions:

```typescript
// src/routes/settings/billing/+page.server.ts
export const actions = {
	// ... existing actions

	createPortalSession: async ({ locals }) => {
		if (!locals.user) {
			throw redirect(302, '/auth');
		}

		const userData = await db.query.user.findFirst({
			where: eq(user.id, locals.user.id),
		});

		if (!userData?.stripeCustomerId) {
			return fail(400, { error: 'No Stripe customer found' });
		}

		const portalSession = await stripe.billingPortal.sessions.create({
			customer: userData.stripeCustomerId,
			return_url: `${env.PUBLIC_BASE_URL}/settings/billing`,
		});

		if (portalSession.url) {
			throw redirect(303, portalSession.url);
		}

		return fail(500, { error: 'Failed to create portal session' });
	},
};
```

### 4. Webhook Handling

Set up a webhook endpoint to handle Stripe events:

```typescript
// src/routes/api/webhooks/stripe/+server.ts
import { stripe } from '$lib/server/stripe/config';
import { db } from '$lib/server/db';
import { subscription, user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';

export const POST = async ({ request }) => {
	const payload = await request.text();
	const signature = request.headers.get('stripe-signature');

	if (!signature) {
		return new Response('Webhook signature missing', { status: 400 });
	}

	let event;
	try {
		event = stripe.webhooks.constructEvent(
			payload,
			signature,
			env.STRIPE_WEBHOOK_SECRET,
		);
	} catch (err) {
		console.error('Webhook signature verification failed', err);
		return new Response('Webhook signature verification failed', {
			status: 400,
		});
	}

	// Handle the event
	switch (event.type) {
		case 'customer.subscription.created':
		case 'customer.subscription.updated':
			const subscriptionData = event.data.object;

			// Find the user by customer ID
			const userData = await db.query.user.findFirst({
				where: eq(user.stripeCustomerId, subscriptionData.customer),
			});

			if (!userData) {
				console.error(
					'User not found for customer',
					subscriptionData.customer,
				);
				return new Response('User not found', { status: 404 });
			}

			// Update or create subscription record
			const existingSubscription =
				await db.query.subscription.findFirst({
					where: eq(subscription.id, subscriptionData.id),
				});

			if (existingSubscription) {
				await db
					.update(subscription)
					.set({
						status: subscriptionData.status,
						priceId: subscriptionData.items.data[0].price.id,
						currentPeriodEnd: new Date(
							subscriptionData.current_period_end * 1000,
						).getTime(),
						cancelAtPeriodEnd: subscriptionData.cancel_at_period_end,
						updated_at: Date.now(),
					})
					.where(eq(subscription.id, subscriptionData.id));
			} else {
				await db.insert(subscription).values({
					id: subscriptionData.id,
					userId: userData.id,
					status: subscriptionData.status,
					priceId: subscriptionData.items.data[0].price.id,
					currentPeriodEnd: new Date(
						subscriptionData.current_period_end * 1000,
					).getTime(),
					cancelAtPeriodEnd: subscriptionData.cancel_at_period_end,
					created_at: Date.now(),
					updated_at: Date.now(),
				});
			}
			break;

		case 'customer.subscription.deleted':
			const deletedSubscription = event.data.object;

			// Update subscription status to canceled
			await db
				.update(subscription)
				.set({
					status: 'canceled',
					updated_at: Date.now(),
				})
				.where(eq(subscription.id, deletedSubscription.id));
			break;

		default:
			console.log(`Unhandled event type ${event.type}`);
	}

	return new Response(JSON.stringify({ received: true }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
};
```

### 5. Subscription Status Check

Create a helper function to check subscription status:

```typescript
// src/lib/server/stripe/helpers.ts
import { db } from '$lib/server/db';
import { subscription } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function hasActiveSubscription(
	userId: string,
): Promise<boolean> {
	const userSubscription = await db.query.subscription.findFirst({
		where: (subscription, { and, eq }) =>
			and(
				eq(subscription.userId, userId),
				eq(subscription.status, 'active'),
			),
	});

	return !!userSubscription;
}

export async function hasFeatureAccess(
	userId: string,
	feature: string,
): Promise<boolean> {
	const userSubscription = await db.query.subscription.findFirst({
		where: (subscription, { and, eq }) =>
			and(
				eq(subscription.userId, userId),
				eq(subscription.status, 'active'),
			),
	});

	if (!userSubscription) {
		// Free tier access check
		switch (feature) {
			case 'basic_contacts':
			case 'basic_interactions':
				return true;
			default:
				return false;
		}
	}

	// Premium tier access check
	if (userSubscription.priceId === env.STRIPE_PREMIUM_PRICE_ID) {
		switch (feature) {
			case 'unlimited_contacts':
			case 'reminder_system':
			case 'vip_features':
			case 'quick_connect':
				return true;
			default:
				return false;
		}
	}

	// Enterprise tier access check
	if (userSubscription.priceId === env.STRIPE_ENTERPRISE_PRICE_ID) {
		// Enterprise has access to all features
		return true;
	}

	return false;
}
```

### 6. Feature Gating

Use the helper functions to gate premium features:

```typescript
// Example: Gating the VIP features
// src/routes/contacts/[id]/vip/+page.server.ts
import { hasFeatureAccess } from '$lib/server/stripe/helpers';

export const load = async ({ params, locals }) => {
	if (!locals.user) {
		throw redirect(302, '/auth');
	}

	const hasAccess = await hasFeatureAccess(
		locals.user.id,
		'vip_features',
	);
	if (!hasAccess) {
		throw redirect(302, '/settings/billing?upgrade=true');
	}

	// Continue with the regular load function
};
```

## Billing UI

Create a billing page for users to manage their subscriptions:

```svelte
<!-- src/routes/settings/billing/+page.svelte -->
<script lang="ts">
	import { env } from '$env/dynamic/public';
	import type { PageData } from './$types';

	const { data } = $props<{ data: PageData }>();
	const { user, subscription } = data;

	// Check URL parameters for success/canceled messages
	const url = new URL(window.location.href);
	const success = url.searchParams.get('success');
	const canceled = url.searchParams.get('canceled');
	const upgrade = url.searchParams.get('upgrade');
</script>

<div class="container mx-auto p-4 pt-20">
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title text-2xl">Subscription Management</h2>

			{#if success}
				<div class="alert alert-success mb-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6 shrink-0 stroke-current"
						fill="none"
						viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/></svg
					>
					<span>Thank you for your subscription!</span>
				</div>
			{/if}

			{#if canceled}
				<div class="alert alert-info mb-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="h-6 w-6 shrink-0 stroke-current"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						></path></svg
					>
					<span
						>Checkout was canceled. You can try again whenever you're
						ready.</span
					>
				</div>
			{/if}

			{#if upgrade}
				<div class="alert alert-warning mb-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6 shrink-0 stroke-current"
						fill="none"
						viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/></svg
					>
					<span
						>This feature requires a premium subscription. Please
						upgrade to access it.</span
					>
				</div>
			{/if}

			<!-- Current Subscription Status -->
			<div class="mb-6">
				<h3 class="mb-2 text-xl font-semibold">Current Plan</h3>
				{#if subscription && subscription.status === 'active'}
					<div class="bg-base-200 rounded-lg p-4">
						<p class="font-medium">
							{subscription.priceId ===
							env.PUBLIC_STRIPE_PREMIUM_PRICE_ID
								? 'Premium'
								: 'Enterprise'} Plan
						</p>
						<p class="text-sm opacity-70">
							Renews on {new Date(
								subscription.currentPeriodEnd,
							).toLocaleDateString()}
						</p>
						{#if subscription.cancelAtPeriodEnd}
							<p class="text-warning mt-2">
								Your subscription will end on the renewal date.
							</p>
						{/if}
						<div class="mt-4">
							<form method="POST" action="?/createPortalSession">
								<button type="submit" class="btn btn-outline">
									Manage Subscription
								</button>
							</form>
						</div>
					</div>
				{:else}
					<div class="bg-base-200 rounded-lg p-4">
						<p class="font-medium">Free Plan</p>
						<p class="text-sm opacity-70">
							Limited to 50 contacts and basic features.
						</p>
					</div>
				{/if}
			</div>

			<!-- Subscription Plans -->
			{#if !subscription || subscription.status !== 'active'}
				<div>
					<h3 class="mb-4 text-xl font-semibold">Available Plans</h3>
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<!-- Premium Plan -->
						<div class="card bg-base-200">
							<div class="card-body">
								<h3 class="card-title">Premium</h3>
								<p class="text-2xl font-bold">
									$9.99<span class="text-sm font-normal">/month</span>
								</p>
								<ul class="mt-4 space-y-2">
									<li class="flex items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="text-success mr-2 h-5 w-5"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fill-rule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clip-rule="evenodd"
											/>
										</svg>
										Unlimited contacts
									</li>
									<li class="flex items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="text-success mr-2 h-5 w-5"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fill-rule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clip-rule="evenodd"
											/>
										</svg>
										Enhanced reminder system
									</li>
									<li class="flex items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="text-success mr-2 h-5 w-5"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fill-rule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clip-rule="evenodd"
											/>
										</svg>
										VIP features
									</li>
									<li class="flex items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="text-success mr-2 h-5 w-5"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fill-rule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clip-rule="evenodd"
											/>
										</svg>
										Quick Connect feature
									</li>
								</ul>
								<div class="card-actions mt-4 justify-end">
									<form
										method="POST"
										action="?/createCheckoutSession"
									>
										<input
											type="hidden"
											name="priceId"
											value={env.PUBLIC_STRIPE_PREMIUM_PRICE_ID}
										/>
										<button type="submit" class="btn btn-primary"
											>Subscribe</button
										>
									</form>
								</div>
							</div>
						</div>

						<!-- Enterprise Plan -->
						<div class="card bg-base-200">
							<div class="card-body">
								<h3 class="card-title">Enterprise</h3>
								<p class="text-2xl font-bold">
									$19.99<span class="text-sm font-normal">/month</span
									>
								</p>
								<ul class="mt-4 space-y-2">
									<li class="flex items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="text-success mr-2 h-5 w-5"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fill-rule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clip-rule="evenodd"
											/>
										</svg>
										All Premium features
									</li>
									<li class="flex items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="text-success mr-2 h-5 w-5"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fill-rule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clip-rule="evenodd"
											/>
										</svg>
										AI-powered features
									</li>
									<li class="flex items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="text-success mr-2 h-5 w-5"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fill-rule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clip-rule="evenodd"
											/>
										</svg>
										Advanced analytics
									</li>
									<li class="flex items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="text-success mr-2 h-5 w-5"
											viewBox="0 0 20 20"
											fill="currentColor"
										>
											<path
												fill-rule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clip-rule="evenodd"
											/>
										</svg>
										Team collaboration
									</li>
								</ul>
								<div class="card-actions mt-4 justify-end">
									<form
										method="POST"
										action="?/createCheckoutSession"
									>
										<input
											type="hidden"
											name="priceId"
											value={env.PUBLIC_STRIPE_ENTERPRISE_PRICE_ID}
										/>
										<button type="submit" class="btn btn-primary"
											>Subscribe</button
										>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
```

## Testing

### Test Mode

During development, use Stripe's test mode:

1. Use test API keys
2. Use [test card numbers](https://stripe.com/docs/testing#cards) for
   payments
3. Test webhook events using the Stripe CLI

### Webhook Testing

Use the Stripe CLI to test webhooks locally:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to your Stripe account
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:5173/api/webhooks/stripe
```

### Subscription Testing

Test the full subscription lifecycle:

1. Create a subscription with a test card
2. Verify the subscription is recorded in your database
3. Test subscription updates (e.g., changing plans)
4. Test subscription cancellation
5. Test subscription reactivation

## Production Deployment

Before deploying to production:

1. Switch to live Stripe API keys
2. Set up production webhooks in the Stripe dashboard
3. Update webhook secrets in your environment variables
4. Test the entire flow in a staging environment

## Security Considerations

1. **API Keys**: Never expose your Stripe secret key in client-side
   code
2. **Webhook Signatures**: Always verify webhook signatures
3. **HTTPS**: Ensure all communication with Stripe is over HTTPS
4. **Access Control**: Implement proper access control for
   subscription-gated features
5. **Error Handling**: Implement robust error handling for payment
   failures

## Troubleshooting

### Common Issues

1. **Webhook Verification Failures**:

   - Check that the webhook secret is correct
   - Ensure the raw request body is being used for verification

2. **Payment Failures**:

   - Check the Stripe dashboard for detailed error messages
   - Implement proper error handling in your checkout flow

3. **Subscription Status Issues**:
   - Verify webhook events are being processed correctly
   - Check the database for accurate subscription records

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe Webhook Guide](https://stripe.com/docs/webhooks)
