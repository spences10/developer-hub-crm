import { getRequestEvent, query } from '$app/server';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import {
	create_user_profile_from_github,
	fetch_github_user_data,
	user_has_profile,
} from '$lib/server/profile-helpers';
import { redirect } from '@sveltejs/kit';

/**
 * Ensure user is authenticated and has a profile
 * Creates profile from GitHub data if missing
 */
export const ensure_profile = query(async () => {
	const event = getRequestEvent();

	const session = await auth.api.getSession({
		headers: event.request.headers,
	});

	if (!session?.user) {
		redirect(302, '/login');
	}

	const user_id = session.user.id;

	// Check if user has a profile
	if (!user_has_profile(user_id)) {
		// Get the user's GitHub account
		const account_stmt = db.prepare(`
      SELECT * FROM account
      WHERE userId = ? AND providerId = 'github'
    `);

		const github_account = account_stmt.get(user_id) as
			| {
					accessToken: string;
			  }
			| undefined;

		if (github_account?.accessToken) {
			try {
				// Fetch GitHub user data
				const github_data = await fetch_github_user_data(
					github_account.accessToken,
				);

				// Create profile from GitHub data
				await create_user_profile_from_github(user_id, github_data);

				console.log('✅ Created user profile from GitHub data');
			} catch (error) {
				console.error('Failed to create profile from GitHub:', error);
				// Continue without profile - user can create manually later
			}
		}
	}

	return { authenticated: true };
});
