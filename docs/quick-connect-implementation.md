# Quick Connect Implementation Guide

## Overview

The Quick Connect feature enables developers to easily add new
contacts to their CRM through a simple QR code scan. This creates a
frictionless networking experience, particularly at conferences,
meetups, and other developer events.

## User Flow

1. **QR Code Generation**:

   - User navigates to "Add Contact" > "Quick Connect"
   - System generates a unique QR code containing a link to a web form
   - QR code includes configurable context tags (conference name,
     location, session, etc.)
   - User can set an expiration time for the QR code (default: 24
     hours)
   - User displays QR code on their phone or device

2. **New Contact Scan**:

   - New contact scans QR code with their phone
   - QR code opens a web page with a simple form
   - Form clearly states what information will be collected and how it
     will be used
   - Form pre-fills the CRM owner's information and configured event
     context

3. **Profile Completion**:

   - New contact fills in basic information (name, email)
   - Optionally adds their GitHub username
   - System clearly indicates that only public GitHub profile data
     will be imported
   - If GitHub username provided, system fetches additional data via
     GitHub API
   - Contact submits form with no account creation required

4. **Contact Addition**:
   - System creates new contact in the CRM with provided information
   - CRM owner receives notification of new contact
   - Contact is tagged with date and the context information
     configured when creating the QR code

## Technical Implementation

### 1. QR Code Generation with Expiration and Context

```typescript
interface QuickConnectOptions {
	userId: string;
	eventName?: string;
	eventLocation?: string;
	session?: string;
	notes?: string;
	expiresInHours: number; // Default: 24
}

// Create a unique URL for each QR code with context and expiration
function generateQuickConnectUrl(
	options: QuickConnectOptions,
): string {
	const {
		userId,
		eventName,
		eventLocation,
		session,
		notes,
		expiresInHours,
	} = options;

	const baseUrl = 'https://devhub-crm.com/quick-connect';
	const uniqueToken = generateToken(); // Create a temporary token

	// Calculate expiration time
	const expiresAt = new Date();
	expiresAt.setHours(expiresAt.getHours() + expiresInHours);

	// Store token details in database
	storeTokenDetails(uniqueToken, {
		userId,
		eventName,
		eventLocation,
		session,
		notes,
		expiresAt,
	});

	// Build URL with token only (context is retrieved server-side)
	return `${baseUrl}/${uniqueToken}`;
}

// Generate QR code from URL
function generateQRCode(url: string): string {
	// Use a QR code generation library like qrcode
	return qrcode.generate(url);
}
```

### 2. Token Validation and Context Retrieval

```typescript
// Database schema for tokens
export const quickConnectTokens = sqliteTable(
	'quick_connect_tokens',
	{
		token: text('token').primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id),
		eventName: text('event_name'),
		eventLocation: text('event_location'),
		session: text('session'),
		notes: text('notes'),
		expiresAt: integer('expires_at', {
			mode: 'timestamp_ms',
		}).notNull(),
		created_at: integer('created_at', { mode: 'timestamp_ms' })
			.notNull()
			.default(sql`((strftime('%s', 'now') * 1000))`),
	},
);

// Validate token and get context
async function validateToken(token: string) {
	const tokenData = await db.query.quickConnectTokens.findFirst({
		where: eq(quickConnectTokens.token, token),
	});

	if (!tokenData) {
		throw new Error('Invalid or expired token');
	}

	if (Date.now() > tokenData.expiresAt) {
		// Clean up expired token
		await db
			.delete(quickConnectTokens)
			.where(eq(quickConnectTokens.token, token));
		throw new Error('Token has expired');
	}

	return tokenData;
}
```

### 3. Web Form Creation with Privacy Notice

```typescript
// src/routes/quick-connect/[token]/+page.server.ts
export const load = async ({ params }) => {
	const { token } = params;

	try {
		// Validate token and get context
		const tokenData = await validateToken(token);

		// Fetch CRM owner information
		const owner = await db.query.user.findFirst({
			where: eq(user.id, tokenData.userId),
		});

		if (!owner) {
			throw new Error('Owner not found');
		}

		return {
			owner: {
				name: owner.username,
				company: owner.company || '',
			},
			context: {
				eventName: tokenData.eventName,
				eventLocation: tokenData.eventLocation,
				session: tokenData.session,
				notes: tokenData.notes,
			},
			// Don't expose token data to client
			token: token,
		};
	} catch (error) {
		throw redirect(302, '/quick-connect/expired');
	}
};

export const actions = {
	default: async ({ request, params }) => {
		const { token } = params;
		const data = await request.formData();

		try {
			// Validate token again
			const tokenData = await validateToken(token);

			const name = data.get('name')?.toString();
			const email = data.get('email')?.toString();
			const githubUsername = data.get('github_username')?.toString();
			const githubData = data.get('github_data')?.toString();

			if (!name || !email) {
				return { success: false, error: 'Missing required fields' };
			}

			// Generate a unique ID for the contact
			const contactId = nanoid();

			// Create the new contact
			await db.insert(contact).values({
				id: contactId,
				userId: tokenData.userId,
				name,
				relationship: 'professional',
				vip: 0,
				lastUpdate: Date.now(),
				status: 'active',
				created_at: Date.now(),
				updated_at: Date.now(),
			});

			// Add contact info
			await db.insert(contactInfo).values({
				id: nanoid(),
				contactId,
				email,
				githubUsername: githubUsername || null,
				githubAvatarUrl: githubData
					? JSON.parse(githubData).avatar_url
					: null,
				githubBio: githubData ? JSON.parse(githubData).bio : null,
				created_at: Date.now(),
				updated_at: Date.now(),
			});

			// Create a "met" interaction
			await db.insert(interaction).values({
				id: nanoid(),
				contactId,
				type: 'met',
				date: Date.now(),
				notes: `Met at ${tokenData.eventName || 'an event'}${
					tokenData.session ? ` during ${tokenData.session}` : ''
				}${tokenData.notes ? `. Notes: ${tokenData.notes}` : ''}`,
				created_at: Date.now(),
				updated_at: Date.now(),
			});

			// Delete the token after use for security
			await db
				.delete(quickConnectTokens)
				.where(eq(quickConnectTokens.token, token));

			return { success: true };
		} catch (error) {
			return { success: false, error: 'Failed to add contact' };
		}
	},
};
```

### 4. GitHub API Integration

```typescript
// Fetch GitHub profile data
async function fetchGithubProfile(username: string) {
	const response = await fetch(
		`https://api.github.com/users/${username}`,
	);

	if (!response.ok) {
		throw new Error('GitHub profile not found');
	}

	const data = await response.json();

	return {
		avatar_url: data.avatar_url,
		bio: data.bio,
		company: data.company,
		blog: data.blog,
		location: data.location,
		public_repos: data.public_repos,
		followers: data.followers,
		twitter_username: data.twitter_username,
	};
}
```

### 5. Updated Form UI with Privacy Notice

```svelte
<!-- src/routes/quick-connect/[token]/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	const { data } = $props<{ data: PageData }>();
	const { owner, context } = data;

	let githubUsername = $state('');
	let githubProfile = $state(null);
	let isLoading = $state(false);

	async function fetchGithubData() {
		if (!githubUsername) return;

		isLoading = true;
		try {
			const response = await fetch(`/api/github/${githubUsername}`);
			if (response.ok) {
				githubProfile = await response.json();
			}
		} catch (error) {
			console.error('Failed to fetch GitHub profile:', error);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">
		Connect with {owner.name}
	</h1>

	{#if context.eventName}
		<div class="badge badge-secondary mb-4">
			{context.eventName}
			{#if context.session}
				- {context.session}
			{/if}
		</div>
	{/if}

	<p class="mb-6">
		Please fill in your information to connect on Developer Hub CRM
	</p>

	<div class="alert alert-info mb-6">
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
		<span>
			<strong>Privacy Notice:</strong> Only your name and email are required.
			If you choose to provide your GitHub username, only publicly available
			information from your GitHub profile will be imported. No account
			creation is needed.
		</span>
	</div>

	<form method="POST" use:enhance>
		<div class="form-control mb-4">
			<label for="name" class="label"
				>Name <span class="text-error">*</span></label
			>
			<input
				type="text"
				id="name"
				name="name"
				class="input input-bordered"
				required
			/>
		</div>

		<div class="form-control mb-4">
			<label for="email" class="label"
				>Email <span class="text-error">*</span></label
			>
			<input
				type="email"
				id="email"
				name="email"
				class="input input-bordered"
				required
			/>
		</div>

		<div class="form-control mb-4">
			<label for="github_username" class="label"
				>GitHub Username (Optional)</label
			>
			<div class="flex gap-2">
				<input
					type="text"
					id="github_username"
					name="github_username"
					class="input input-bordered flex-1"
					bind:value={githubUsername}
				/>
				<button
					type="button"
					class="btn btn-secondary"
					onclick={fetchGithubData}
					disabled={!githubUsername || isLoading}
				>
					Fetch Profile
				</button>
			</div>
		</div>

		{#if isLoading}
			<div class="my-4">
				<span class="loading loading-spinner"></span> Loading GitHub profile...
			</div>
		{/if}

		{#if githubProfile}
			<div class="card bg-base-200 mb-4 p-4">
				<div class="flex items-center gap-4">
					<img
						src={githubProfile.avatar_url}
						alt="GitHub Avatar"
						class="h-16 w-16 rounded-full"
					/>
					<div>
						<h3 class="font-bold">{githubUsername}</h3>
						<p class="text-sm">
							{githubProfile.bio || 'No bio provided'}
						</p>
					</div>
				</div>

				<div class="mt-2 text-sm">
					<p>
						<strong
							>The following public information will be imported:</strong
						>
					</p>
					<ul class="mt-1 list-disc pl-5">
						<li>Profile photo</li>
						<li>Bio</li>
						{#if githubProfile.company}<li>
								Company: {githubProfile.company}
							</li>{/if}
						{#if githubProfile.location}<li>
								Location: {githubProfile.location}
							</li>{/if}
						{#if githubProfile.blog}<li>
								Website: {githubProfile.blog}
							</li>{/if}
					</ul>
				</div>

				<input
					type="hidden"
					name="github_data"
					value={JSON.stringify(githubProfile)}
				/>
			</div>
		{/if}

		<button type="submit" class="btn btn-primary mt-4 w-full"
			>Connect</button
		>
	</form>
</div>
```

<!-- Expired token page -->

```svelte
<!-- src/routes/quick-connect/expired/+page.svelte -->
<div class="container mx-auto p-4 text-center">
	<div class="alert alert-error mb-6">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6 shrink-0 stroke-current"
			fill="none"
			viewBox="0 0 24 24"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
			/></svg
		>
		<span>This connection link has expired or is invalid.</span>
	</div>

	<p class="mb-4">
		Please ask the contact to generate a new QR code.
	</p>
</div>
```

## Implementation Benefits

1. **Low Friction**: The QR code approach makes adding contacts quick
   and easy
2. **Privacy-Focused**: Clear notices about what data is collected and
   used
3. **Context-Rich**: Event tagging provides valuable context for later
   reference
4. **Secure**: QR codes expire after a set time and are one-time use
5. **No Account Required**: Contacts can share their info without
   creating accounts

## Security Considerations

1. **QR Code Expiration**: Codes expire after a configurable period
   (default: 24 hours)
2. **One-Time Use**: Tokens are deleted after successful use
3. **Context Stored Server-Side**: Sensitive context information is
   not exposed in the URL
4. **Minimal Data Collection**: Only collects what's necessary or
   explicitly shared
5. **Transparency**: Clear privacy notices about data usage
