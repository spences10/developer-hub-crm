/**
 * GitHub Following List API integration
 * Uses authenticated requests with user's OAuth token to access following list
 */

interface GitHubUser {
	login: string;
	id: number;
	avatar_url: string;
	html_url: string;
	type: string;
}

interface GitHubFollowingUser extends GitHubUser {
	name: string | null;
	email: string | null;
	bio: string | null;
	company: string | null;
	location: string | null;
	blog: string | null;
	twitter_username: string | null;
	public_repos: number;
	followers: number;
	following: number;
	social_accounts?: Array<{
		provider: string;
		url: string;
	}>;
}

/**
 * Fetch the list of users that the authenticated user follows
 * @param access_token - GitHub OAuth access token
 * @returns Array of GitHub users the user follows
 */
export async function fetch_following_list(
	access_token: string,
): Promise<GitHubUser[]> {
	const following: GitHubUser[] = [];
	let page = 1;
	const per_page = 100; // GitHub max

	try {
		while (true) {
			// Use /user/following (authenticated user endpoint) instead of /users/{username}/following
			const response = await fetch(
				`https://api.github.com/user/following?per_page=${per_page}&page=${page}`,
				{
					headers: {
						Accept: 'application/vnd.github+json',
						Authorization: `Bearer ${access_token}`,
						'X-GitHub-Api-Version': '2022-11-28',
						'User-Agent': 'Devhub-CRM',
					},
				},
			);

			if (!response.ok) {
				if (response.status === 401) {
					throw new Error(
						'GitHub access token is invalid or expired',
					);
				}
				if (response.status === 403) {
					const rate_limit = response.headers.get(
						'x-ratelimit-remaining',
					);
					throw new Error(
						`GitHub API rate limit exceeded. Remaining: ${rate_limit}`,
					);
				}
				throw new Error(`GitHub API error: ${response.status}`);
			}

			const users: GitHubUser[] = await response.json();

			if (users.length === 0) {
				break; // No more pages
			}

			following.push(...users);

			// Check if there are more pages
			const link_header = response.headers.get('link');
			if (!link_header || !link_header.includes('rel="next"')) {
				break;
			}

			page++;
		}

		return following;
	} catch (error) {
		console.error('Error fetching following list:', error);
		throw error;
	}
}

/**
 * Fetch detailed profile for a single user
 * @param access_token - GitHub OAuth access token
 * @param username - GitHub username to fetch
 * @returns Detailed user profile
 */
export async function fetch_user_profile(
	access_token: string,
	username: string,
): Promise<GitHubFollowingUser | null> {
	try {
		const response = await fetch(
			`https://api.github.com/users/${encodeURIComponent(username)}`,
			{
				headers: {
					Accept: 'application/vnd.github+json',
					Authorization: `Bearer ${access_token}`,
					'X-GitHub-Api-Version': '2022-11-28',
					'User-Agent': 'Devhub-CRM',
				},
			},
		);

		if (!response.ok) {
			if (response.status === 404) {
				return null;
			}
			if (response.status === 403) {
				throw new Error('GitHub API rate limit exceeded');
			}
			throw new Error(`GitHub API error: ${response.status}`);
		}

		const profile = await response.json();

		// Fetch social accounts
		try {
			const social_response = await fetch(
				`https://api.github.com/users/${encodeURIComponent(username)}/social_accounts`,
				{
					headers: {
						Accept: 'application/vnd.github+json',
						Authorization: `Bearer ${access_token}`,
						'X-GitHub-Api-Version': '2022-11-28',
						'User-Agent': 'Devhub-CRM',
					},
				},
			);

			if (social_response.ok) {
				profile.social_accounts = await social_response.json();
			}
		} catch (error) {
			console.warn('Could not fetch social accounts:', error);
		}

		return profile;
	} catch (error) {
		console.error(`Error fetching profile for ${username}:`, error);
		throw error;
	}
}

/**
 * Fetch detailed profiles for multiple users in batches
 * @param access_token - GitHub OAuth access token
 * @param usernames - Array of GitHub usernames
 * @param batch_size - Number of requests to make concurrently
 * @returns Array of detailed user profiles
 */
export async function fetch_user_profiles_batch(
	access_token: string,
	usernames: string[],
	batch_size: number = 10,
): Promise<GitHubFollowingUser[]> {
	const profiles: GitHubFollowingUser[] = [];

	// Process in batches to avoid overwhelming the API
	for (let i = 0; i < usernames.length; i += batch_size) {
		const batch = usernames.slice(i, i + batch_size);
		const batch_promises = batch.map((username) =>
			fetch_user_profile(access_token, username),
		);

		const batch_results = await Promise.allSettled(batch_promises);

		for (const result of batch_results) {
			if (result.status === 'fulfilled' && result.value !== null) {
				profiles.push(result.value);
			}
		}

		// Small delay between batches to be nice to the API
		if (i + batch_size < usernames.length) {
			await new Promise((resolve) => setTimeout(resolve, 500));
		}
	}

	return profiles;
}

/**
 * Check if a user has the required GitHub scope
 * @param access_token - GitHub OAuth access token
 * @returns true if user has user:follow scope
 */
export async function check_github_scopes(
	access_token: string,
): Promise<{ has_follow_scope: boolean; scopes: string[] }> {
	try {
		const response = await fetch('https://api.github.com/user', {
			headers: {
				Accept: 'application/vnd.github+json',
				Authorization: `Bearer ${access_token}`,
				'X-GitHub-Api-Version': '2022-11-28',
				'User-Agent': 'Devhub-CRM',
			},
		});

		if (!response.ok) {
			throw new Error(`GitHub API error: ${response.status}`);
		}

		// OAuth scope is returned in the X-OAuth-Scopes header
		const scopes_header =
			response.headers.get('x-oauth-scopes') || '';
		const scopes = scopes_header.split(',').map((s) => s.trim());

		return {
			has_follow_scope: scopes.includes('user:follow'),
			scopes,
		};
	} catch (error) {
		console.error('Error checking GitHub scopes:', error);
		throw error;
	}
}
