# GitHub Integration

## Overview

GitHub integration is the **primary differentiator** that makes Devhub
unique. Instead of manually tracking developer relationships, we
automatically sync GitHub activity to surface insights and suggest
actions.

## Core Features

### 1. GitHub Activity Tracking

**What it does:**

- Scheduled job checks contacts' public GitHub activity
- Surfaces releases, new repos, major contributions
- Generates actionable insights

**User Flow:**

```
1. User adds contact with GitHub username
2. Nightly job fetches recent activity
3. Dashboard shows: "Sarah released v2.0 yesterday"
4. User clicks → auto-drafts congratulations message
```

**Implementation:**

```typescript
// lib/server/github-sync.ts
export async function syncContactGitHubActivity(contactId: string) {
	const contact = await getContact(contactId);
	if (!contact.github_username) return;

	const activity = await fetchGitHubActivity(contact.github_username);

	// Store insights
	const insights = [];

	// Check for new releases
	for (const repo of activity.repos) {
		const latestRelease = await fetchLatestRelease(repo);
		if (latestRelease && isRecent(latestRelease.created_at)) {
			insights.push({
				type: 'release',
				repo: repo.name,
				version: latestRelease.tag_name,
				url: latestRelease.html_url,
				created_at: latestRelease.created_at,
			});
		}
	}

	// Check for new repos
	const newRepos = activity.repos.filter((r) =>
		isRecent(r.created_at),
	);
	for (const repo of newRepos) {
		insights.push({
			type: 'new_repo',
			repo: repo.name,
			description: repo.description,
			url: repo.html_url,
			created_at: repo.created_at,
		});
	}

	// Store in database
	await saveGitHubInsights(contactId, insights);

	return insights;
}
```

**Database Schema:**

```sql
CREATE TABLE github_insights (
  id TEXT PRIMARY KEY,
  contact_id TEXT NOT NULL,
  type TEXT NOT NULL, -- 'release', 'new_repo', 'major_contribution'
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  metadata JSON, -- flexible storage for type-specific data
  created_at INTEGER NOT NULL,
  acknowledged INTEGER DEFAULT 0, -- user has seen/acted on it
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);

CREATE INDEX idx_github_insights_contact ON github_insights(contact_id);
CREATE INDEX idx_github_insights_acknowledged ON github_insights(acknowledged);
```

### 2. Auto-Create Contacts from GitHub Stars

**What it does:**

- When someone stars your repo, create a contact automatically
- Enriches with their GitHub profile data
- Tags them with the repo they starred

**User Flow:**

```
1. User connects their GitHub account (OAuth)
2. Devhub watches their repos for stars
3. New star → auto-creates contact
4. User gets notification: "Alex Kumar starred sveltekit-starter"
5. Contact pre-filled with GitHub data
```

**Implementation:**

```typescript
// lib/server/github-webhooks.ts
export async function handleStarEvent(payload: GitHubWebhook) {
	const { repository, sender } = payload;

	// Find user who owns this repo
	const user = await getUserByGitHubRepo(repository.full_name);
	if (!user) return;

	// Check if contact already exists
	const existing = await findContactByGitHub(user.id, sender.login);
	if (existing) {
		// Just add a note
		await addInteraction(existing.id, {
			type: 'github_star',
			note: `Starred ${repository.name}`,
			created_at: Date.now(),
		});
		return;
	}

	// Create new contact
	const profile = await fetchGitHubProfile(sender.login);
	await createContact(user.id, {
		name: profile.name || profile.login,
		email: profile.email,
		github_username: profile.login,
		company: profile.company,
		notes: `Starred ${repository.name}\n\nBio: ${profile.bio || 'N/A'}`,
		tags: [`starred:${repository.name}`],
	});

	// Notify user
	await notifyUser(user.id, {
		type: 'new_star_contact',
		contact_name: profile.name || profile.login,
		repo: repository.name,
	});
}
```

**Webhook Setup:**

```typescript
// routes/api/webhooks/github/+server.ts
import { verify } from '@octokit/webhooks-methods';

export async function POST({ request }) {
	const signature = request.headers.get('x-hub-signature-256');
	const body = await request.text();

	// Verify webhook signature
	const isValid = await verify(
		process.env.GITHUB_WEBHOOK_SECRET,
		body,
		signature,
	);

	if (!isValid) {
		return new Response('Invalid signature', { status: 401 });
	}

	const payload = JSON.parse(body);
	const event = request.headers.get('x-github-event');

	switch (event) {
		case 'star':
			await handleStarEvent(payload);
			break;
		case 'watch':
			await handleWatchEvent(payload);
			break;
		// Add more events as needed
	}

	return new Response('OK');
}
```

### 3. Auto-Create Interactions from GitHub Activity

**What it does:**

- PR collaborations → logged as interactions
- Issue discussions → logged as interactions
- Co-authored commits → logged as interactions

**User Flow:**

```
1. User works with Sarah on a PR
2. Devhub detects collaboration
3. Auto-logs interaction: "Collaborated on PR #123 in sveltekit-starter"
4. Interaction appears in Sarah's timeline
```

**Implementation:**

```typescript
// lib/server/github-collaboration.ts
export async function detectCollaborations(userId: string) {
	const user = await getUser(userId);
	const userGitHub = user.github_username;

	// Fetch user's recent activity
	const events = await fetchGitHubEvents(userGitHub);

	for (const event of events) {
		// PR review or comment
		if (
			event.type === 'PullRequestReviewEvent' ||
			event.type === 'PullRequestReviewCommentEvent'
		) {
			const prAuthor = event.payload.pull_request.user.login;

			if (prAuthor !== userGitHub) {
				// Find or create contact
				const contact = await findOrCreateContact(userId, prAuthor);

				// Log interaction
				await createInteraction(contact.id, {
					type: 'github_pr',
					note: `Reviewed PR: ${event.payload.pull_request.title}`,
					metadata: {
						pr_url: event.payload.pull_request.html_url,
						pr_number: event.payload.pull_request.number,
						repo: event.repo.name,
					},
					created_at: new Date(event.created_at).getTime(),
				});
			}
		}

		// Issue comments
		if (event.type === 'IssueCommentEvent') {
			const issueAuthor = event.payload.issue.user.login;

			if (issueAuthor !== userGitHub) {
				const contact = await findOrCreateContact(
					userId,
					issueAuthor,
				);

				await createInteraction(contact.id, {
					type: 'github_issue',
					note: `Discussed: ${event.payload.issue.title}`,
					metadata: {
						issue_url: event.payload.issue.html_url,
						issue_number: event.payload.issue.number,
						repo: event.repo.name,
					},
					created_at: new Date(event.created_at).getTime(),
				});
			}
		}
	}
}
```

### 4. GitHub Profile Refresh

**What it does:**

- Re-fetches contact's GitHub data on demand
- Updates bio, company, location, repos
- Keeps contact data fresh

**User Flow:**

```
1. User views contact detail page
2. Clicks "Refresh GitHub Data"
3. System fetches latest profile
4. Updates contact fields + shows diff
```

**Implementation:**

```typescript
// lib/server/github-refresh.ts
export async function refreshContactGitHub(contactId: string) {
	const contact = await getContact(contactId);
	if (!contact.github_username) {
		throw new Error('No GitHub username');
	}

	const profile = await fetchGitHubProfile(contact.github_username);
	const socialAccounts = await fetchGitHubSocialAccounts(
		contact.github_username,
	);

	// Track what changed
	const changes = [];

	if (profile.company !== contact.company) {
		changes.push({
			field: 'company',
			old: contact.company,
			new: profile.company,
		});
	}

	if (profile.bio && profile.bio !== extractBio(contact.notes)) {
		changes.push({
			field: 'bio',
			old: extractBio(contact.notes),
			new: profile.bio,
		});
	}

	// Update contact
	await updateContact(contactId, {
		name: profile.name || contact.name,
		email: profile.email || contact.email,
		company: profile.company,
		notes: updateNotesWithBio(contact.notes, profile),
		updated_at: Date.now(),
	});

	// Update social links
	await syncSocialLinks(contactId, socialAccounts);

	// Update skills from repos
	await updateSkillTags(contactId, profile);

	return { success: true, changes };
}
```

### 5. Activity-Based Follow-Up Suggestions

**What it does:**

- Analyzes GitHub activity
- Suggests relevant follow-ups
- Auto-drafts context-aware tasks

**User Flow:**

```
1. Sarah releases v2.0
2. Dashboard shows suggestion: "Sarah released v2.0 → send congrats"
3. Click "Create Follow-up"
4. Pre-filled: "Congratulate Sarah on v2.0 release"
5. User reviews, schedules, done
```

**Implementation:**

```typescript
// lib/server/github-suggestions.ts
export async function generateFollowUpSuggestions(userId: string) {
	const contacts = await getContacts(userId);
	const suggestions = [];

	for (const contact of contacts) {
		const insights = await getRecentGitHubInsights(contact.id);

		for (const insight of insights) {
			if (insight.acknowledged) continue;

			const suggestion = {
				contact_id: contact.id,
				contact_name: contact.name,
				reason: formatReason(insight),
				suggested_action: generateAction(insight),
				insight_id: insight.id,
				priority: calculatePriority(insight, contact),
			};

			suggestions.push(suggestion);
		}
	}

	// Sort by priority
	return suggestions.sort((a, b) => b.priority - a.priority);
}

function generateAction(insight: GitHubInsight) {
	switch (insight.type) {
		case 'release':
			return `Congratulate on ${insight.metadata.version} release`;
		case 'new_repo':
			return `Check out their new project: ${insight.metadata.repo}`;
		case 'major_contribution':
			return `Ask about their work on ${insight.metadata.repo}`;
		default:
			return 'Follow up';
	}
}

function calculatePriority(insight: GitHubInsight, contact: Contact) {
	let priority = 50;

	// VIP contacts get higher priority
	if (contact.is_vip) priority += 30;

	// Recent activity is more urgent
	const daysAgo =
		(Date.now() - insight.created_at) / (1000 * 60 * 60 * 24);
	if (daysAgo < 2) priority += 20;
	else if (daysAgo < 7) priority += 10;

	// Releases are higher priority than new repos
	if (insight.type === 'release') priority += 15;

	return priority;
}
```

### 6. Relationship Graph

**What it does:**

- Maps mutual GitHub connections
- "Who can introduce me to X?"
- Visualizes developer network

**User Flow:**

```
1. User wants to connect with Evan You
2. Searches "Evan You" in CRM
3. System shows: "You have 3 mutual connections"
   - Rich Harris (both follow, collaborated on Vite)
   - Sarah Drasner (both starred vue-next)
   - Dan Abramov (mutual followers)
4. User asks Rich for intro
```

**Implementation:**

```typescript
// lib/server/github-graph.ts
export async function findMutualConnections(
	userId: string,
	targetGitHubUsername: string,
) {
	const user = await getUser(userId);
	const userContacts = await getContacts(userId);

	// Fetch target's followers/following
	const targetFollowing = await fetchGitHubFollowing(
		targetGitHubUsername,
	);
	const targetFollowers = await fetchGitHubFollowers(
		targetGitHubUsername,
	);

	const mutuals = [];

	for (const contact of userContacts) {
		if (!contact.github_username) continue;

		const connections = [];

		// Check if contact follows target
		if (
			targetFollowers.some((f) => f.login === contact.github_username)
		) {
			connections.push('follows_target');
		}

		// Check if target follows contact
		if (
			targetFollowing.some((f) => f.login === contact.github_username)
		) {
			connections.push('followed_by_target');
		}

		// Check for repo collaborations
		const collabs = await findCollaborations(
			contact.github_username,
			targetGitHubUsername,
		);
		if (collabs.length > 0) {
			connections.push({ type: 'collaborated', repos: collabs });
		}

		if (connections.length > 0) {
			mutuals.push({
				contact,
				connections,
				strength: calculateConnectionStrength(connections),
			});
		}
	}

	return mutuals.sort((a, b) => b.strength - a.strength);
}
```

### 7. Skill/Tech Auto-Tagging

**What it does:**

- Analyzes contact's GitHub repos
- Extracts languages, frameworks, tools
- Auto-tags contacts for easy filtering

**User Flow:**

```
1. User imports Sarah from GitHub
2. System analyzes her repos
3. Auto-tags: React, TypeScript, Node.js, PostgreSQL
4. User can search: "Find all contacts who use Rust"
5. Results show contacts tagged with Rust
```

**Implementation:**

```typescript
// lib/server/github-skills.ts
export async function extractSkillsFromGitHub(
	githubUsername: string,
) {
	const repos = await fetchGitHubRepos(githubUsername);

	const languageCounts: Record<string, number> = {};
	const frameworks = new Set<string>();

	// Count languages across all repos
	for (const repo of repos) {
		if (repo.language) {
			languageCounts[repo.language] =
				(languageCounts[repo.language] || 0) + 1;
		}

		// Detect frameworks from repo topics
		const topicFrameworks = detectFrameworks(repo.topics || []);
		topicFrameworks.forEach((f) => frameworks.add(f));

		// Also check README for framework mentions
		if (repo.description) {
			const descFrameworks = detectFrameworksInText(repo.description);
			descFrameworks.forEach((f) => frameworks.add(f));
		}
	}

	// Top languages (appeared in 2+ repos or top 5)
	const topLanguages = Object.entries(languageCounts)
		.filter(([_, count]) => count >= 2)
		.sort(([_, a], [__, b]) => b - a)
		.slice(0, 5)
		.map(([lang]) => lang);

	return {
		languages: topLanguages,
		frameworks: Array.from(frameworks),
		repo_count: repos.length,
		total_stars: repos.reduce(
			(sum, r) => sum + r.stargazers_count,
			0,
		),
	};
}

function detectFrameworks(topics: string[]): string[] {
	const frameworkMap: Record<string, string> = {
		svelte: 'Svelte',
		sveltekit: 'SvelteKit',
		react: 'React',
		nextjs: 'Next.js',
		vue: 'Vue',
		nuxt: 'Nuxt',
		angular: 'Angular',
		nestjs: 'NestJS',
		express: 'Express',
		fastify: 'Fastify',
		// ... add more
	};

	return topics
		.map((t) => frameworkMap[t.toLowerCase()])
		.filter(Boolean);
}
```

## Rate Limiting Strategy

**GitHub API Limits:**

- Authenticated: 5,000 requests/hour
- Unauthenticated: 60 requests/hour

**Our Strategy:**

1. **User OAuth Tokens** (preferred)
   - Each user's GitHub OAuth token = separate rate limit
   - Spreads load across users
   - Users get 5,000 req/hour for their own syncs

2. **Smart Caching**

   ```typescript
   // Cache GitHub data aggressively
   const CACHE_DURATION = {
   	profile: 1 * 60 * 60 * 1000, // 1 hour
   	repos: 6 * 60 * 60 * 1000, // 6 hours
   	activity: 30 * 60 * 1000, // 30 min
   	social_links: 24 * 60 * 60 * 1000, // 24 hours
   };
   ```

3. **Batch Processing**

   ```typescript
   // Instead of syncing all contacts at once,
   // spread across the day
   async function scheduleGitHubSyncs() {
   	const contacts = await getAllContactsWithGitHub();
   	const batchSize = 100;
   	const delayBetweenBatches = 60 * 60 * 1000; // 1 hour

   	for (let i = 0; i < contacts.length; i += batchSize) {
   		const batch = contacts.slice(i, i + batchSize);
   		await scheduleBatch(
   			batch,
   			(i / batchSize) * delayBetweenBatches,
   		);
   	}
   }
   ```

4. **Tiered Sync Frequency**
   - **Free users:** 10 contacts synced per day
   - **Pro users:** All contacts synced daily
   - **Premium users:** Real-time webhook updates

## Pricing Tiers

| Feature                  | Free            | Pro         | Premium          |
| ------------------------ | --------------- | ----------- | ---------------- |
| GitHub import (manual)   | ✅              | ✅          | ✅               |
| Profile refresh          | ✅              | ✅          | ✅               |
| Activity sync            | 10 contacts/day | Unlimited   | Unlimited        |
| Auto-create from stars   | ❌              | ✅          | ✅               |
| Auto-create interactions | ❌              | ✅          | ✅               |
| Relationship graph       | ❌              | ✅          | ✅               |
| Skill auto-tagging       | ✅ Basic        | ✅ Advanced | ✅ Advanced      |
| Follow-up suggestions    | ❌              | ✅          | ✅ + AI-enhanced |

## Future Enhancements

- **GitLab/Bitbucket support** - Expand beyond GitHub
- **Contribution heatmap** - Visualize interaction patterns
- **GitHub Sponsors integration** - Track sponsorships
- **Repo collaboration timeline** - Detailed collab history
- **Trending developer discovery** - Find rising stars in your niche
