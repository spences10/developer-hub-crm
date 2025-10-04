import { query } from '$app/server';
import {
	get_current_user_id,
	guarded_form,
} from '$lib/server/auth-helpers';
import { db } from '$lib/server/db';
import type { UserPreferences } from '$lib/types/db';
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
      INSERT INTO user_preferences (
        id, user_id, date_format, time_format,
        default_contact_sort, default_follow_up_days,
        default_interaction_type, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

			const id = crypto.randomUUID();
			const now = Date.now();

			insert_stmt.run(
				id,
				user_id,
				'YYYY-MM-DD',
				'24h',
				'name',
				7,
				null,
				now,
				now,
			);

			preferences = {
				id,
				user_id,
				date_format: 'YYYY-MM-DD',
				time_format: '24h',
				default_contact_sort: 'name',
				default_follow_up_days: 7,
				default_interaction_type: null,
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
		time_format: v.union([v.literal('12h'), v.literal('24h')]),
		default_contact_sort: v.union([
			v.literal('name'),
			v.literal('last_contacted'),
			v.literal('recently_added'),
			v.literal('company'),
		]),
		default_follow_up_days: v.pipe(
			v.string(),
			v.transform(Number),
			v.number(),
			v.minValue(1),
			v.maxValue(90),
		),
		default_interaction_type: v.optional(
			v.union([
				v.literal('meeting'),
				v.literal('call'),
				v.literal('email'),
				v.literal('message'),
				v.literal(''),
			]),
		),
	}),
	async (data) => {
		const user_id = await get_current_user_id();

		const stmt = db.prepare(`
      UPDATE user_preferences
      SET
        date_format = ?,
        time_format = ?,
        default_contact_sort = ?,
        default_follow_up_days = ?,
        default_interaction_type = ?,
        updated_at = ?
      WHERE user_id = ?
    `);

		stmt.run(
			data.date_format,
			data.time_format,
			data.default_contact_sort,
			data.default_follow_up_days,
			data.default_interaction_type || null,
			Date.now(),
			user_id,
		);

		// Refresh the query to update the UI
		await get_user_preferences().refresh();
	},
);
