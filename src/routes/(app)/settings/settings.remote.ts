import { query } from '$app/server';
import {
	get_current_user_id,
	guarded_form,
} from '$lib/server/auth-helpers';
import { db } from '$lib/server/db';
import type { UserPreferences } from '$lib/types/db';
import { redirect } from '@sveltejs/kit';
import * as v from 'valibot';

/**
 * Get user preferences, creating default if doesn't exist
 */
export const get_user_preferences = query(
	async (): Promise<UserPreferences> => {
		const user_id = await get_current_user_id();

		// Try to get existing preferences
		const stmt = db.prepare(
			'SELECT * FROM user_preferences WHERE user_id = ?',
		);
		let preferences = stmt.get(user_id) as
			| UserPreferences
			| undefined;

		// If no preferences exist, create default ones
		if (!preferences) {
			const insert_stmt = db.prepare(`
      INSERT INTO user_preferences (id, user_id, date_format, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `);

			const id = crypto.randomUUID();
			const now = Date.now();
			const default_format = 'YYYY-MM-DD';

			insert_stmt.run(id, user_id, default_format, now, now);

			preferences = {
				id,
				user_id,
				date_format: default_format,
				created_at: now,
				updated_at: now,
			};
		}

		return preferences;
	},
);

/**
 * Update user preferences
 */
export const update_preferences = guarded_form(
	v.object({
		date_format: v.union([
			v.literal('YYYY-MM-DD'),
			v.literal('MM/DD/YYYY'),
			v.literal('DD/MM/YYYY'),
		]),
	}),
	async (data) => {
		const user_id = await get_current_user_id();

		const stmt = db.prepare(`
      UPDATE user_preferences
      SET date_format = ?, updated_at = ?
      WHERE user_id = ?
    `);

		stmt.run(data.date_format, Date.now(), user_id);

		redirect(303, '/settings');
	},
);
