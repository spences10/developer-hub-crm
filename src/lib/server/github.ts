/**
 * GitHub API integration for fetching public profile data
 * Used for the "Quick Connect" feature to import GitHub profiles as contacts
 */

interface GitHubProfile {
	login: string;
	name: string | null;
	email: string | null;
	bio: string | null;
	company: string | null;
	location: string | null;
	blog: string | null;
	avatar_url: string;
	public_repos: number;
	followers: number;
	following: number;
	twitter_username: string | null;
	social_accounts?: Array<{
		provider: string;
		url: string;
	}>;
}

interface ContactFromGitHub {
	name: string;
	email: string | null;
	company: string | null;
	github_username: string;
	avatar_url: string;
	notes: string;
	social_links: Array<{
		platform: string;
		url: string;
	}>;
}

/**
 * Fetch a GitHub user's public profile
 * @param username - GitHub username
 * @returns GitHub profile data or null if not found
 */
export async function fetch_github_profile(
	username: string,
): Promise<GitHubProfile | null> {
	if (!username || username.trim() === '') {
		return null;
	}

	try {
		// Fetch main profile
		const response = await fetch(
			`https://api.github.com/users/${encodeURIComponent(username)}`,
			{
				headers: {
					Accept: 'application/vnd.github+json',
					'X-GitHub-Api-Version': '2022-11-28',
					'User-Agent': 'Developer-Hub-CRM',
				},
			},
		);

		if (!response.ok) {
			if (response.status === 404) {
				return null;
			}
			throw new Error(`GitHub API error: ${response.status}`);
		}

		const profile = await response.json();

		// Fetch social accounts from separate endpoint
		try {
			const social_response = await fetch(
				`https://api.github.com/users/${encodeURIComponent(username)}/social_accounts`,
				{
					headers: {
						Accept: 'application/vnd.github+json',
						'X-GitHub-Api-Version': '2022-11-28',
						'User-Agent': 'Developer-Hub-CRM',
					},
				},
			);

			if (social_response.ok) {
				profile.social_accounts = await social_response.json();
			}
		} catch (error) {
			// If social accounts fetch fails, continue without them
			console.warn('Could not fetch social accounts:', error);
		}

		return profile;
	} catch (error) {
		console.error('Error fetching GitHub profile:', error);
		return null;
	}
}

/**
 * Convert GitHub profile to contact data format
 * @param profile - GitHub profile data
 * @returns Contact data ready for database insertion
 */
export function github_profile_to_contact(
	profile: GitHubProfile,
): ContactFromGitHub {
	// Build a notes field with useful info from GitHub
	const notes_parts: string[] = [];

	if (profile.bio) {
		notes_parts.push(`Bio: ${profile.bio}`);
	}

	if (profile.location) {
		notes_parts.push(`Location: ${profile.location}`);
	}

	notes_parts.push(
		`GitHub Stats: ${profile.public_repos} repos, ${profile.followers} followers`,
	);

	// Extract social links
	const social_links: Array<{ platform: string; url: string }> = [];

	// Add Twitter/X link if available
	if (profile.twitter_username) {
		social_links.push({
			platform: 'twitter',
			url: `https://twitter.com/${profile.twitter_username}`,
		});
	}

	// Add blog/website if available
	if (profile.blog) {
		social_links.push({
			platform: 'website',
			url: profile.blog.startsWith('http')
				? profile.blog
				: `https://${profile.blog}`,
		});
	}

	// Add social accounts from GitHub's social_accounts field
	if (profile.social_accounts && profile.social_accounts.length > 0) {
		for (const account of profile.social_accounts) {
			// Map GitHub provider names to our platform names
			const platform_map: Record<string, string> = {
				twitter: 'twitter',
				linkedin: 'linkedin',
				bluesky: 'bluesky',
			};

			const platform =
				platform_map[account.provider.toLowerCase()] ||
				account.provider.toLowerCase();

			// Avoid duplicates (e.g., if twitter is in both fields)
			if (
				!social_links.some(
					(link) =>
						link.platform === platform && link.url === account.url,
				)
			) {
				social_links.push({
					platform,
					url: account.url,
				});
			}
		}
	}

	return {
		name: profile.name || profile.login,
		email: profile.email,
		company: profile.company,
		github_username: profile.login,
		avatar_url: profile.avatar_url,
		notes: notes_parts.join('\n'),
		social_links,
	};
}

/**
 * Fetch GitHub profile and convert to contact format
 * @param username - GitHub username
 * @returns Contact data or null if profile not found
 */
export async function fetch_github_contact(
	username: string,
): Promise<ContactFromGitHub | null> {
	const profile = await fetch_github_profile(username);

	if (!profile) {
		return null;
	}

	return github_profile_to_contact(profile);
}
