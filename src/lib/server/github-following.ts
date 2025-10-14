/**
 * GitHub Following List API integration
 * Uses authenticated requests with user's OAuth token to access following list
 */

import { db } from './db';

// Cache TTL: 24 hours in milliseconds
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

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
 * @param on_progress - Optional callback for progress updates
 * @returns Array of detailed user profiles
 */
export async function fetch_user_profiles_batch(
	access_token: string,
	usernames: string[],
	batch_size: number = 10,
	on_progress?: (loaded: number, total: number) => void,
): Promise<GitHubFollowingUser[]> {
	const profiles: GitHubFollowingUser[] = [];
	const total = usernames.length;

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

		// Report progress if callback provided
		if (on_progress) {
			on_progress(profiles.length, total);
		}

		// Small delay between batches to be nice to the API
		if (i + batch_size < usernames.length) {
			await new Promise((resolve) => setTimeout(resolve, 500));
		}
	}

	return profiles;
}

/**
 * Fetch a chunk of following profiles with detailed info
 * @param access_token - GitHub OAuth access token
 * @param username - GitHub username (for checking existing contacts)
 * @param offset - Starting index
 * @param limit - Number of profiles to fetch
 * @returns Chunk of profiles with metadata
 */
export async function fetch_following_chunk(
	access_token: string,
	offset: number,
	limit: number,
): Promise<{
	profiles: GitHubFollowingUser[];
	has_more: boolean;
	offset: number;
	total_loaded: number;
}> {
	try {
		// First, get the full following list to know usernames
		const following_list = await fetch_following_list(access_token);
		const total = following_list.length;

		// Calculate chunk boundaries
		const end = Math.min(offset + limit, total);
		const chunk_usernames = following_list
			.slice(offset, end)
			.map((user) => user.login);

		// Fetch detailed profiles for this chunk
		const profiles = await fetch_user_profiles_batch(
			access_token,
			chunk_usernames,
			10,
		);

		return {
			profiles,
			has_more: end < total,
			offset: end,
			total_loaded: end,
		};
	} catch (error) {
		console.error('Error fetching following chunk:', error);
		throw error;
	}
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

/**
 * Get the authenticated user's following count without fetching the full list
 * @param access_token - GitHub OAuth access token
 * @returns Following count and user info
 */
export async function get_following_count(
	access_token: string,
): Promise<{
	following_count: number;
	followers_count: number;
	username: string;
}> {
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
			if (response.status === 401) {
				throw new Error('GitHub access token is invalid or expired');
			}
			throw new Error(`GitHub API error: ${response.status}`);
		}

		const user = await response.json();

		return {
			following_count: user.following || 0,
			followers_count: user.followers || 0,
			username: user.login,
		};
	} catch (error) {
		console.error('Error fetching following count:', error);
		throw error;
	}
}

/**
 * Get the current rate limit status for the authenticated user
 * @param access_token - GitHub OAuth access token
 * @returns Rate limit information
 */
export async function get_rate_limit_status(
	access_token: string,
): Promise<{
	limit: number;
	remaining: number;
	reset: number;
	used: number;
}> {
	try {
		const response = await fetch(
			'https://api.github.com/rate_limit',
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
			throw new Error(`GitHub API error: ${response.status}`);
		}

		const data = await response.json();
		const core_rate = data.resources.core;

		return {
			limit: core_rate.limit,
			remaining: core_rate.remaining,
			reset: core_rate.reset,
			used: core_rate.used,
		};
	} catch (error) {
		console.error('Error fetching rate limit:', error);
		throw error;
	}
}

/**
 * Get cached GitHub profiles for a user if they exist and are fresh
 * @param user_id - User ID
 * @returns Cached profiles or null if cache miss or expired
 */
export function get_cached_profiles(
	user_id: string,
): GitHubFollowingUser[] | null {
	try {
		const stmt = db.prepare(`
      SELECT profile_data, cached_at
      FROM github_following_cache
      WHERE user_id = ?
    `);

		const row = stmt.get(user_id) as
			| {
					profile_data: string;
					cached_at: number;
			  }
			| undefined;

		if (!row) {
			return null;
		}

		// Check if cache is still fresh (< 24 hours old)
		const now = Date.now();
		const age_ms = now - row.cached_at;

		if (age_ms > CACHE_TTL_MS) {
			// Cache expired, delete it
			clear_cache(user_id);
			return null;
		}

		// Parse and return cached profiles
		const profiles = JSON.parse(
			row.profile_data,
		) as GitHubFollowingUser[];
		return profiles;
	} catch (error) {
		console.error('Error reading cache:', error);
		return null;
	}
}

/**
 * Save GitHub profiles to cache
 * @param user_id - User ID
 * @param profiles - Array of GitHub profiles to cache
 */
export function save_profiles_to_cache(
	user_id: string,
	profiles: GitHubFollowingUser[],
): void {
	try {
		const now = Date.now();
		const profile_data = JSON.stringify(profiles);

		// Delete existing cache for this user
		clear_cache(user_id);

		// Insert new cache
		const stmt = db.prepare(`
      INSERT INTO github_following_cache (id, user_id, profile_data, cached_at)
      VALUES (?, ?, ?, ?)
    `);

		stmt.run(crypto.randomUUID(), user_id, profile_data, now);
	} catch (error) {
		console.error('Error saving to cache:', error);
		// Don't throw - caching failure shouldn't break the flow
	}
}

/**
 * Clear cache for a user
 * @param user_id - User ID
 */
export function clear_cache(user_id: string): void {
	try {
		const stmt = db.prepare(`
      DELETE FROM github_following_cache
      WHERE user_id = ?
    `);

		stmt.run(user_id);
	} catch (error) {
		console.error('Error clearing cache:', error);
	}
}

/**
 * Get cache timestamp for a user
 * @param user_id - User ID
 * @returns Timestamp when cache was created, or null if no cache
 */
export function get_cache_timestamp(user_id: string): number | null {
	try {
		const stmt = db.prepare(`
      SELECT cached_at
      FROM github_following_cache
      WHERE user_id = ?
    `);

		const row = stmt.get(user_id) as
			| {
					cached_at: number;
			  }
			| undefined;

		return row ? row.cached_at : null;
	} catch (error) {
		console.error('Error getting cache timestamp:', error);
		return null;
	}
}
