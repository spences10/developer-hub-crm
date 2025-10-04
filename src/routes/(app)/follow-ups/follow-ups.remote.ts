import { query } from '$app/server';
import {
	get_current_user_id,
	guarded_command,
	guarded_form,
} from '$lib/server/auth-helpers';
import { db } from '$lib/server/db';
import type { FollowUp } from '$lib/types/db';
import { redirect } from '@sveltejs/kit';
import * as v from 'valibot';

/**
 * Get all follow-ups for the current user
 */
export const get_all_follow_ups = query(async () => {
	const user_id = await get_current_user_id();

	const stmt = db.prepare(`
    SELECT
      f.*,
      c.name as contact_name
    FROM follow_ups f
    INNER JOIN contacts c ON f.contact_id = c.id
    WHERE c.user_id = ?
    ORDER BY f.due_date ASC
  `);

	return stmt.all(user_id) as Array<
		FollowUp & { contact_name: string }
	>;
});

/**
 * Get follow-ups for a specific contact
 */
export const get_contact_follow_ups = query.batch(
	v.pipe(v.string(), v.minLength(1)),
	async (
		contact_ids,
	): Promise<(contact_id: string) => FollowUp[]> => {
		const user_id = await get_current_user_id();

		// Verify the contacts belong to the current user
		const placeholders = contact_ids.map(() => '?').join(',');
		const contact_check = db.prepare(`
      SELECT id FROM contacts
      WHERE id IN (${placeholders}) AND user_id = ?
    `);
		const valid_contacts = contact_check.all(
			...contact_ids,
			user_id,
		) as Array<{ id: string }>;
		const valid_ids = new Set(valid_contacts.map((c) => c.id));

		// Fetch all follow-ups for valid contacts
		const stmt = db.prepare(`
      SELECT * FROM follow_ups
      WHERE contact_id IN (${placeholders})
      ORDER BY due_date ASC
    `);
		const all_follow_ups = stmt.all(...contact_ids) as FollowUp[];

		// Return lookup function
		return (contact_id) => {
			if (!valid_ids.has(contact_id)) {
				return [];
			}
			return all_follow_ups.filter(
				(f) => f.contact_id === contact_id,
			);
		};
	},
);

/**
 * Get upcoming follow-ups (due within next 7 days)
 */
export const get_upcoming_follow_ups = query(
	async (days: number = 7) => {
		const user_id = await get_current_user_id();

		const now = Date.now();
		const future = now + days * 24 * 60 * 60 * 1000; // Add days in milliseconds

		const stmt = db.prepare(`
      SELECT
        f.*,
        c.name as contact_name
      FROM follow_ups f
      INNER JOIN contacts c ON f.contact_id = c.id
      WHERE c.user_id = ?
        AND f.completed = 0
        AND f.due_date BETWEEN ? AND ?
      ORDER BY f.due_date ASC
    `);

		return stmt.all(user_id, now, future) as Array<
			FollowUp & { contact_name: string }
		>;
	},
);

/**
 * Get overdue follow-ups
 */
export const get_overdue_follow_ups = query(async () => {
	const user_id = await get_current_user_id();
	const now = Date.now();

	const stmt = db.prepare(`
    SELECT
      f.*,
      c.name as contact_name
    FROM follow_ups f
    INNER JOIN contacts c ON f.contact_id = c.id
    WHERE c.user_id = ?
      AND f.completed = 0
      AND f.due_date < ?
    ORDER BY f.due_date ASC
  `);

	return stmt.all(user_id, now) as Array<
		FollowUp & { contact_name: string }
	>;
});

/**
 * Create a new follow-up
 */
export const create_follow_up = guarded_form(
	v.object({
		contact_id: v.pipe(v.string(), v.minLength(1)),
		due_date: v.pipe(
			v.string(),
			v.transform(Number),
			v.number(),
			v.minValue(0, 'Due date must be a valid timestamp'),
		),
		note: v.optional(v.string()),
	}),
	async (data) => {
		const user_id = await get_current_user_id();

		// Verify the contact belongs to the current user
		const contact_check = db.prepare(`
      SELECT id FROM contacts
      WHERE id = ? AND user_id = ?
    `);
		const contact = contact_check.get(data.contact_id, user_id);

		if (!contact) {
			return {
				error: 'Contact not found',
			};
		}

		const stmt = db.prepare(`
      INSERT INTO follow_ups (
        id, contact_id, due_date, note, completed, completed_at,
        created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

		const id = crypto.randomUUID();
		const now = Date.now();

		stmt.run(
			id,
			data.contact_id,
			data.due_date,
			data.note || null,
			0, // completed = false
			null, // completed_at
			now,
			now,
		);

		redirect(303, `/contacts/${data.contact_id}`);
	},
);

const update_follow_up_schema = v.object({
	id: v.pipe(v.string(), v.minLength(1)),
	due_date: v.pipe(
		v.number(),
		v.minValue(0, 'Due date must be a valid timestamp'),
	),
	note: v.optional(v.string()),
});

/**
 * Update an existing follow-up
 */
export const update_follow_up = guarded_command(
	update_follow_up_schema,
	async (data: v.InferOutput<typeof update_follow_up_schema>) => {
		const user_id = await get_current_user_id();

		// Verify the follow-up belongs to a contact owned by the current user
		const check_stmt = db.prepare(`
      SELECT f.id
      FROM follow_ups f
      INNER JOIN contacts c ON f.contact_id = c.id
      WHERE f.id = ? AND c.user_id = ?
    `);
		const follow_up = check_stmt.get(data.id, user_id);

		if (!follow_up) {
			return {
				error: 'Follow-up not found',
			};
		}

		const stmt = db.prepare(`
      UPDATE follow_ups
      SET due_date = ?, note = ?, updated_at = ?
      WHERE id = ?
    `);

		stmt.run(data.due_date, data.note || null, Date.now(), data.id);
	},
);

/**
 * Mark a follow-up as completed
 */
export const complete_follow_up = guarded_command(
	v.pipe(v.string(), v.minLength(1)),
	async (id) => {
		const user_id = await get_current_user_id();

		// Verify the follow-up belongs to a contact owned by the current user
		const check_stmt = db.prepare(`
      SELECT f.id
      FROM follow_ups f
      INNER JOIN contacts c ON f.contact_id = c.id
      WHERE f.id = ? AND c.user_id = ?
    `);
		const follow_up = check_stmt.get(id, user_id);

		if (!follow_up) {
			return {
				error: 'Follow-up not found',
			};
		}

		const stmt = db.prepare(`
      UPDATE follow_ups
      SET completed = 1, completed_at = ?, updated_at = ?
      WHERE id = ?
    `);

		const now = Date.now();
		stmt.run(now, now, id);
	},
);

/**
 * Reopen a completed follow-up
 */
export const reopen_follow_up = guarded_command(
	v.pipe(v.string(), v.minLength(1)),
	async (id) => {
		const user_id = await get_current_user_id();

		// Verify the follow-up belongs to a contact owned by the current user
		const check_stmt = db.prepare(`
      SELECT f.id
      FROM follow_ups f
      INNER JOIN contacts c ON f.contact_id = c.id
      WHERE f.id = ? AND c.user_id = ?
    `);
		const follow_up = check_stmt.get(id, user_id);

		if (!follow_up) {
			return {
				error: 'Follow-up not found',
			};
		}

		const stmt = db.prepare(`
      UPDATE follow_ups
      SET completed = 0, completed_at = NULL, updated_at = ?
      WHERE id = ?
    `);

		stmt.run(Date.now(), id);
	},
);

/**
 * Delete a follow-up
 */
export const delete_follow_up = guarded_command(
	v.pipe(v.string(), v.minLength(1)),
	async (id) => {
		const user_id = await get_current_user_id();

		// Verify the follow-up belongs to a contact owned by the current user
		const check_stmt = db.prepare(`
      SELECT f.id
      FROM follow_ups f
      INNER JOIN contacts c ON f.contact_id = c.id
      WHERE f.id = ? AND c.user_id = ?
    `);
		const follow_up = check_stmt.get(id, user_id);

		if (!follow_up) {
			return {
				error: 'Follow-up not found',
			};
		}

		const stmt = db.prepare(`
      DELETE FROM follow_ups
      WHERE id = ?
    `);

		stmt.run(id);
	},
);

/**
 * Get follow-up statistics for the current user
 */
export const get_follow_up_stats = query(async () => {
	const user_id = await get_current_user_id();
	const now = Date.now();

	const stmt = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN f.completed = 0 THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN f.completed = 1 THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN f.completed = 0 AND f.due_date < ? THEN 1 ELSE 0 END) as overdue
    FROM follow_ups f
    INNER JOIN contacts c ON f.contact_id = c.id
    WHERE c.user_id = ?
  `);

	return stmt.get(now, user_id) as {
		total: number;
		pending: number;
		completed: number;
		overdue: number;
	};
});
