import { command, getRequestEvent, query } from '$app/server';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import type { UserProfile, UserSocialLink } from '$lib/types/db';
import * as v from 'valibot';

export interface ProfileWithSocials extends UserProfile {
	image: string | null;
	social_links: UserSocialLink[];
	qr_code_url: string | null;
}

/**
 * Get public profile by username
 */
export const get_profile = query.batch(
	v.pipe(v.string(), v.minLength(1)),
	async (usernames) => {
		// Fetch all profiles with user image in a single query
		const profile_stmt = db.prepare(`
      SELECT
        up.*,
        u.image
      FROM user_profiles up
      JOIN user u ON up.user_id = u.id
      WHERE up.username IN (${usernames.map(() => '?').join(',')})
      AND up.is_public = 1
    `);

		const profiles = profile_stmt.all(
			...usernames,
		) as (UserProfile & {
			image: string | null;
			qr_code_url: string | null;
		})[];

		// Fetch social links for all profiles
		const user_ids = profiles.map((p) => p.user_id);

		if (user_ids.length === 0) {
			return () => null;
		}

		const socials_stmt = db.prepare(`
      SELECT * FROM user_social_links
      WHERE user_id IN (${user_ids.map(() => '?').join(',')})
      ORDER BY platform
    `);

		const all_social_links = socials_stmt.all(
			...user_ids,
		) as UserSocialLink[];

		// Return lookup function
		return (username: string): ProfileWithSocials | null => {
			const profile = profiles.find((p) => p.username === username);

			if (!profile) {
				return null;
			}

			const social_links = all_social_links.filter(
				(link) => link.user_id === profile.user_id,
			);

			return { ...profile, social_links };
		};
	},
);

/**
 * Track profile view for analytics
 */
export const track_profile_view = command(
	v.object({
		username: v.pipe(v.string(), v.minLength(1)),
		qr_scan: v.boolean(),
		referrer: v.nullable(v.string()),
	}),
	async ({ username, qr_scan, referrer }) => {
		const event = getRequestEvent();

		// Get current user if logged in
		const session = await auth.api.getSession({
			headers: event.request.headers,
		});

		const viewer_id = session?.user?.id || null;

		// Get the profile owner's user_id
		const profile_stmt = db.prepare(`
      SELECT user_id FROM user_profiles WHERE username = ?
    `);

		const profile = profile_stmt.get(username) as
			| { user_id: string }
			| undefined;

		if (!profile) {
			return { success: false, error: 'Profile not found' };
		}

		// Don't track own profile views
		if (viewer_id === profile.user_id) {
			return { success: true, self_view: true };
		}

		// Insert profile view
		const insert_stmt = db.prepare(`
      INSERT INTO profile_views (
        id, user_id, viewer_id, qr_scan, referrer, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `);

		insert_stmt.run(
			crypto.randomUUID(),
			profile.user_id,
			viewer_id,
			qr_scan ? 1 : 0,
			referrer,
			Date.now(),
		);

		return { success: true };
	},
);
