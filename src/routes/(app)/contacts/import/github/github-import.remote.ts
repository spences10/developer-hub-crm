import { command, query } from '$app/server';
import { get_current_user_id } from '$lib/server/auth-helpers';
import { db } from '$lib/server/db';
import { github_profile_to_contact } from '$lib/server/github';
import {
	check_github_scopes,
	fetch_following_list,
	fetch_user_profiles_batch,
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
 * Check GitHub connection status and required scopes
 */
export const check_github_connection = query(
	async (): Promise<{
		connected: boolean;
		has_follow_scope: boolean;
		username?: string;
		scopes?: string[];
	}> => {
		try {
			const token_data = await get_github_token();

			if (!token_data) {
				return {
					connected: false,
					has_follow_scope: false,
				};
			}

			// Verify the token is still valid and check actual scopes from GitHub
			try {
				const scope_check = await check_github_scopes(
					token_data.access_token,
				);

				return {
					connected: true,
					has_follow_scope: scope_check.has_follow_scope,
					username: token_data.username,
					scopes: scope_check.scopes,
				};
			} catch (error) {
				console.error('Error checking GitHub scopes:', error);
				// Token might be invalid
				return {
					connected: false,
					has_follow_scope: false,
				};
			}
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
 * Fetch the list of users the current user follows on GitHub
 */
export const fetch_github_following = query(async () => {
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

		const following_list = await fetch_following_list(
			token_data.access_token,
		);

		// Fetch detailed profiles for all users
		const usernames = following_list.map((user) => user.login);
		const profiles = await fetch_user_profiles_batch(
			token_data.access_token,
			usernames,
			10, // batch size
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
			profiles: profiles.map((profile) => ({
				...profile,
				already_imported: existing_usernames.has(
					profile.login.toLowerCase(),
				),
			})),
		};
	} catch (error: any) {
		console.error('Error fetching GitHub following:', error);
		return {
			error: error.message || 'Failed to fetch GitHub following list',
		};
	}
});

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
