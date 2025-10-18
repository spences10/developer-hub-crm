---
name: GitHub API Integration
description:
  Guide for GitHub API integration in this project. Use when
  implementing GitHub features like importing contacts, fetching
  profiles, or working with GitHub data.
---

# GitHub Integration

## Quick Start

```typescript
// lib/server/github.ts
import { GITHUB_TOKEN } from '$env/static/private';

async function fetch_github<T>(endpoint: string): Promise<T> {
	const response = await fetch(`https://api.github.com${endpoint}`, {
		headers: {
			Authorization: `Bearer ${GITHUB_TOKEN}`,
			Accept: 'application/vnd.github.v3+json',
			'User-Agent': 'DevHub-CRM',
		},
	});

	if (!response.ok) {
		throw new Error(`GitHub API error: ${response.status}`);
	}

	return response.json();
}
```

## Import Contact from GitHub

```typescript
// contacts.remote.ts
import { form } from '@sveltejs/kit/server';
import * as v from 'valibot';

const schema = v.object({
	username: v.pipe(v.string(), v.minLength(1)),
});

export const import_github_user = form(schema, async (data) => {
	const user_id = await get_current_user_id();

	// Fetch profile
	const profile = await fetch_github<GitHubProfile>(
		`/users/${data.username}`,
	);

	// Check if exists
	const existing = db
		.prepare(
			`
    SELECT id FROM contacts WHERE user_id = ? AND github_username = ?
  `,
		)
		.get(user_id, profile.login);

	if (existing) {
		throw new Error('Contact already exists');
	}

	// Create contact
	const id = nanoid();
	db.prepare(
		`
    INSERT INTO contacts (id, user_id, name, email, github_username, avatar_url, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,
	).run(
		id,
		user_id,
		profile.name || profile.login,
		profile.email,
		profile.login,
		profile.avatar_url,
		Date.now(),
		Date.now(),
	);

	return redirect(`/contacts/${id}`);
});
```

## Caching Strategy

Cache GitHub data for 24 hours to respect rate limits (5,000/hour):

```typescript
export const get_github_following = query(async () => {
	const user_id = await get_current_user_id();

	// Check cache (24h TTL)
	const cached = db
		.prepare(
			`
    SELECT profile_data, cached_at 
    FROM github_following_cache 
    WHERE user_id = ?
  `,
		)
		.get(user_id);

	const cache_ttl = 24 * 60 * 60 * 1000;
	const is_fresh =
		cached && Date.now() - cached.cached_at < cache_ttl;

	if (is_fresh) {
		return JSON.parse(cached.profile_data);
	}

	// Fetch fresh data
	const following = await fetch_github(
		`/users/${username}/following`,
	);

	// Store in cache
	db.prepare(
		`
    INSERT OR REPLACE INTO github_following_cache (id, user_id, profile_data, cached_at)
    VALUES (?, ?, ?, ?)
  `,
	).run(nanoid(), user_id, JSON.stringify(following), Date.now());

	return following;
});
```

## Key Points

- **Rate limits**: 5,000 requests/hour (authenticated)
- **Cache aggressively**: 24h TTL for profile data
- **Error handling**: Check for 404 (not found), 403 (rate limit)
- **Throttle bulk operations**: 100ms delay between requests

For detailed patterns (OAuth, bulk import, rate limiting), see
[REFERENCE.md](REFERENCE.md).
