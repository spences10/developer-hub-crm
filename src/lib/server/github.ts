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
}

interface ContactFromGitHub {
	name: string;
	email: string | null;
	company: string | null;
	github_username: string;
	notes: string;
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
		const response = await fetch(
			`https://api.github.com/users/${encodeURIComponent(username)}`,
			{
				headers: {
					Accept: 'application/vnd.github.v3+json',
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

		return await response.json();
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

	if (profile.blog) {
		notes_parts.push(`Website: ${profile.blog}`);
	}

	notes_parts.push(
		`GitHub Stats: ${profile.public_repos} repos, ${profile.followers} followers`,
	);

	return {
		name: profile.name || profile.login,
		email: profile.email,
		company: profile.company,
		github_username: profile.login,
		notes: notes_parts.join('\n'),
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
