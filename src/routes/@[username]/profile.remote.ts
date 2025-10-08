import { query } from '$app/server';
import { db } from '$lib/server/db';
import type { UserProfile, UserSocialLink } from '$lib/types/db';
import * as v from 'valibot';

export interface ProfileWithSocials extends UserProfile {
	image: string | null;
	social_links: UserSocialLink[];
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
		) as (UserProfile & { image: string | null })[];

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
