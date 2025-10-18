# GitHub Integration Reference

## GitHub Profile Type

```typescript
interface GitHubProfile {
	login: string;
	name: string | null;
	email: string | null;
	avatar_url: string;
	bio: string | null;
	company: string | null;
	location: string | null;
	blog: string;
	twitter_username: string | null;
	public_repos: number;
	followers: number;
	following: number;
}
```

## Fetch Following List

```typescript
export async function fetch_github_following(
	username: string,
	per_page: number = 100,
): Promise<GitHubUser[]> {
	const following: GitHubUser[] = [];
	let page = 1;
	let has_more = true;

	while (has_more) {
		const users = await fetch_github<GitHubUser[]>(
			`/users/${username}/following?per_page=${per_page}&page=${page}`,
		);
		following.push(...users);
		has_more = users.length === per_page;
		page++;
	}

	return following;
}
```

## Bulk Import with Rate Limiting

```typescript
export const import_github_following_batch = command(async () => {
	const user_id = await get_current_user_id();
	const following = await get_github_following();

	const imported: string[] = [];
	const skipped: string[] = [];

	for (const user of following) {
		// Check if exists
		const existing = db
			.prepare(
				`
      SELECT id FROM contacts WHERE user_id = ? AND github_username = ?
    `,
			)
			.get(user_id, user.login);

		if (existing) {
			skipped.push(user.login);
			continue;
		}

		// Fetch full profile
		const profile = await fetch_github_profile(user.login);

		// Create contact
		// ... insert logic

		imported.push(user.login);

		// Rate limit: wait 100ms
		await new Promise((resolve) => setTimeout(resolve, 100));
	}

	return { imported: imported.length, skipped: skipped.length };
});
```

## Check Rate Limit

```typescript
export async function get_rate_limit() {
	const data = await fetch_github<{
		rate: {
			limit: number;
			remaining: number;
			reset: number;
			used: number;
		};
	}>('/rate_limit');

	return {
		limit: data.rate.limit,
		remaining: data.rate.remaining,
		reset: new Date(data.rate.reset * 1000),
		used: data.rate.used,
	};
}
```

## Error Handling

```typescript
try {
	const profile = await fetch_github_profile(username);
} catch (error) {
	if (error instanceof Error) {
		if (error.message.includes('404')) {
			throw new Error('GitHub user not found');
		}
		if (error.message.includes('403')) {
			throw new Error('Rate limit exceeded. Try again later.');
		}
		if (error.message.includes('401')) {
			throw new Error('GitHub auth failed. Check token.');
		}
	}
	throw error;
}
```

## Cache Schema

```sql
CREATE TABLE IF NOT EXISTS github_following_cache (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  profile_data TEXT NOT NULL,
  cached_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);
```

## Resources

- GitHub module: `lib/server/github.ts`
- Following cache: `lib/server/github-following.ts`
- Project docs: `docs/github-integration.md`
