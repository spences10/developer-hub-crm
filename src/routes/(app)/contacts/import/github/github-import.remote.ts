import { command, query } from '$app/server';
import { get_current_user_id } from '$lib/server/auth-helpers';
import { db } from '$lib/server/db';
import { github_profile_to_contact } from '$lib/server/github';
import {
	check_github_scopes,
	fetch_following_chunk,
	fetch_user_profiles_batch,
	get_following_count,
	get_rate_limit_status,
} from '$lib/server/github-following';
import * as v from 'valibot';

/**
 * Get the GitHub OAuth token for the current user
 */
async function get_github_token(): Promise<{
	access_token: string;
	username: string;
	has_follow_scope: boolean;
} | null> {
	const user_id = await get_current_user_id();

	// Get the GitHub account record for this user
	const account_stmt = db.prepare(`
    SELECT accessToken, accountId FROM account
    WHERE userId = ? AND providerId = 'github'
  `);

	const account = account_stmt.get(user_id) as
		| {
				accessToken: string | null;
				accountId: string;
		  }
		| undefined;

	if (!account || !account.accessToken) {
		return null;
	}

	// Check live GitHub API for scopes (don't trust database scope field)
	try {
		const scope_check = await check_github_scopes(
			account.accessToken,
		);
		return {
			access_token: account.accessToken,
			username: account.accountId,
			has_follow_scope: scope_check.has_follow_scope,
		};
	} catch (error) {
		console.error('Error checking GitHub scopes:', error);
		return null;
	}
}

/**
 * Check GitHub connection status (fast - DB only)
 * Scopes are verified when actually fetching data
 */
export const check_github_connection = query(
	async (): Promise<{
		connected: boolean;
		has_follow_scope: boolean;
		username?: string;
	}> => {
		try {
			const user_id = await get_current_user_id();

			// Just check if token exists in DB (fast)
			const account_stmt = db.prepare(`
        SELECT accessToken, accountId, scope FROM account
        WHERE userId = ? AND providerId = 'github'
      `);

			const account = account_stmt.get(user_id) as
				| {
						accessToken: string | null;
						accountId: string;
						scope: string | null;
				  }
				| undefined;

			if (!account || !account.accessToken) {
				return {
					connected: false,
					has_follow_scope: false,
				};
			}

			// Check scope from DB (might be stale, but fast)
			// Scopes are comma-separated in Better Auth
			const scopes = account.scope
				? account.scope.split(',').map((s) => s.trim())
				: [];
			const has_follow_scope = scopes.includes('user:follow');

			return {
				connected: true,
				has_follow_scope,
				username: account.accountId,
			};
		} catch (error) {
			console.error('Error checking GitHub connection:', error);
			return {
				connected: false,
				has_follow_scope: false,
			};
		}
	},
);

/**
 * Get the authenticated user's following count and rate limit info
 * This is called BEFORE loading the full list to show a warning
 */
export const get_github_following_info = query(async () => {
	try {
		const token_data = await get_github_token();

		if (!token_data) {
			return {
				error: 'GitHub account not connected',
			};
		}

		if (!token_data.has_follow_scope) {
			return {
				error:
					'Missing required GitHub permissions. Please reconnect your GitHub account.',
			};
		}

		// Get following count
		const count_info = await get_following_count(
			token_data.access_token,
		);

		// Get rate limit status
		const rate_limit = await get_rate_limit_status(
			token_data.access_token,
		);

		// Calculate estimates
		const api_calls_needed =
			Math.ceil(count_info.following_count / 100) + // Paginated following list
			count_info.following_count; // Individual profile fetches

		// Estimate time: ~10 profiles per second with batching and delays
		const estimated_seconds = Math.ceil(
			count_info.following_count / 10,
		);

		return {
			success: true,
			following_count: count_info.following_count,
			followers_count: count_info.followers_count,
			username: count_info.username,
			rate_limit: {
				limit: rate_limit.limit,
				remaining: rate_limit.remaining,
				used: rate_limit.used,
				reset: rate_limit.reset,
			},
			estimates: {
				api_calls: api_calls_needed,
				time_seconds: estimated_seconds,
			},
		};
	} catch (error: any) {
		console.error('Error fetching GitHub following info:', error);
		return {
			error: error.message || 'Failed to fetch GitHub info',
		};
	}
});

/**
 * Fetch a chunk of users the current user follows on GitHub
 * This enables chunked loading with progress feedback
 */
export const fetch_github_following_chunk = query(
	v.object({
		offset: v.pipe(v.number(), v.minValue(0)),
		limit: v.pipe(v.number(), v.minValue(1), v.maxValue(100)),
	}),
	async (params: { offset: number; limit: number }) => {
		try {
			const token_data = await get_github_token();

			if (!token_data) {
				return {
					error: 'GitHub account not connected',
				};
			}

			if (!token_data.has_follow_scope) {
				return {
					error:
						'Missing required GitHub permissions. Please reconnect your GitHub account.',
				};
			}

			// Fetch chunk
			const chunk_result = await fetch_following_chunk(
				token_data.access_token,
				params.offset,
				params.limit,
			);

			// Get existing contacts to mark duplicates
			const user_id = await get_current_user_id();
			const existing_contacts_stmt = db.prepare(`
        SELECT github_username FROM contacts
        WHERE user_id = ? AND github_username IS NOT NULL
      `);
			const existing_contacts = existing_contacts_stmt.all(
				user_id,
			) as Array<{
				github_username: string;
			}>;
			const existing_usernames = new Set(
				existing_contacts.map((c) => c.github_username.toLowerCase()),
			);

			return {
				success: true,
				profiles: chunk_result.profiles.map((profile) => ({
					...profile,
					already_imported: existing_usernames.has(
						profile.login.toLowerCase(),
					),
				})),
				has_more: chunk_result.has_more,
				offset: chunk_result.offset,
				total_loaded: chunk_result.total_loaded,
			};
		} catch (error: any) {
			console.error('Error fetching GitHub following chunk:', error);
			return {
				error:
					error.message || 'Failed to fetch GitHub following chunk',
			};
		}
	},
);

/**
 * Import selected GitHub users as contacts
 */
export const import_github_contacts = command(
	v.object({
		usernames: v.array(v.string()),
	}),
	async (data: { usernames: string[] }) => {
		try {
			const user_id = await get_current_user_id();
			const token_data = await get_github_token();

			if (!token_data) {
				return {
					error: 'GitHub account not connected',
				};
			}

			if (!token_data.has_follow_scope) {
				return {
					error: 'Missing required GitHub permissions',
				};
			}

			// Fetch profiles for selected users
			const profiles = await fetch_user_profiles_batch(
				token_data.access_token,
				data.usernames,
				10,
			);

			// Check which contacts already exist
			const placeholders = data.usernames.map(() => '?').join(',');
			const existing_stmt = db.prepare(`
        SELECT github_username FROM contacts
        WHERE user_id = ? AND LOWER(github_username) IN (${placeholders})
      `);
			const existing = existing_stmt.all(
				user_id,
				...data.usernames.map((u) => u.toLowerCase()),
			) as Array<{ github_username: string }>;
			const existing_set = new Set(
				existing.map((e) => e.github_username.toLowerCase()),
			);

			// Import contacts
			const insert_stmt = db.prepare(`
        INSERT INTO contacts (
          id, user_id, name, email, company,
          github_username, avatar_url, notes,
          last_contacted_at, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

			const social_link_stmt = db.prepare(`
        INSERT INTO social_links (id, contact_id, platform, url, created_at)
        VALUES (?, ?, ?, ?, ?)
      `);

			const now = Date.now();
			let imported_count = 0;
			let skipped_count = 0;

			for (const profile of profiles) {
				// Skip if already exists
				if (existing_set.has(profile.login.toLowerCase())) {
					skipped_count++;
					continue;
				}

				const contact_data = github_profile_to_contact(profile);
				const contact_id = crypto.randomUUID();

				// Insert contact
				insert_stmt.run(
					contact_id,
					user_id,
					contact_data.name,
					contact_data.email || null,
					contact_data.company || null,
					contact_data.github_username,
					contact_data.avatar_url,
					contact_data.notes,
					null, // last_contacted_at
					now,
					now,
				);

				// Insert social links
				for (const link of contact_data.social_links) {
					social_link_stmt.run(
						crypto.randomUUID(),
						contact_id,
						link.platform,
						link.url,
						now,
					);
				}

				imported_count++;
			}

			return {
				success: true,
				imported_count,
				skipped_count,
			};
		} catch (error: any) {
			console.error('Error importing GitHub contacts:', error);
			return {
				error: error.message || 'Failed to import contacts',
			};
		}
	},
);
