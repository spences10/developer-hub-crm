import { query } from '$app/server';
import {
	get_current_user_id,
	guarded_command,
	guarded_form,
} from '$lib/server/auth-helpers';
import { db } from '$lib/server/db';
import type { Interaction } from '$lib/types/db';
import * as v from 'valibot';

/**
 * Get all interactions for a specific contact
 */
export const get_interactions = query.batch(
	v.pipe(v.string(), v.minLength(1)),
	async (contact_ids) => {
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

		// Fetch all interactions for valid contacts
		const stmt = db.prepare(`
      SELECT * FROM interactions
      WHERE contact_id IN (${placeholders})
      ORDER BY created_at DESC
    `);
		const all_interactions = stmt.all(
			...contact_ids,
		) as Interaction[];

		// Return lookup function
		return (contact_id) => {
			if (!valid_ids.has(contact_id)) {
				return [];
			}
			return all_interactions.filter(
				(i) => i.contact_id === contact_id,
			);
		};
	},
);

/**
 * Get recent interactions across all contacts for the current user
 */
export const get_recent_interactions = query(
	async (
		limit: number = 10,
	): Promise<Array<Interaction & { contact_name: string }>> => {
		const user_id = await get_current_user_id();

		const stmt = db.prepare(`
      SELECT
        i.*,
        c.name as contact_name
      FROM interactions i
      INNER JOIN contacts c ON i.contact_id = c.id
      WHERE c.user_id = ?
      ORDER BY i.created_at DESC
      LIMIT ?
    `);

		return stmt.all(user_id, limit) as Array<
			Interaction & { contact_name: string }
		>;
	},
);

/**
 * Create a new interaction and update contact's last_contacted_at
 */
export const create_interaction = guarded_form(
	v.object({
		contact_id: v.pipe(v.string(), v.minLength(1)),
		type: v.picklist(['meeting', 'call', 'email', 'message']),
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

		// Use a transaction to create interaction and update contact
		const transaction = db.transaction(() => {
			const id = crypto.randomUUID();
			const now = Date.now();

			// Insert interaction
			const insert_stmt = db.prepare(`
        INSERT INTO interactions (id, contact_id, type, note, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
			insert_stmt.run(
				id,
				data.contact_id,
				data.type,
				data.note || null,
				now,
				now,
			);

			// Update contact's last_contacted_at
			const update_stmt = db.prepare(`
        UPDATE contacts
        SET last_contacted_at = ?, updated_at = ?
        WHERE id = ?
      `);
			update_stmt.run(now, now, data.contact_id);

			return { id };
		});

		transaction();
	},
);

const update_interaction_schema = v.object({
	id: v.pipe(v.string(), v.minLength(1)),
	type: v.picklist(['meeting', 'call', 'email', 'message']),
	note: v.optional(v.string()),
});

/**
 * Update an existing interaction
 */
export const update_interaction = guarded_command(
	update_interaction_schema,
	async (data: v.InferOutput<typeof update_interaction_schema>) => {
		const user_id = await get_current_user_id();

		// Verify the interaction belongs to a contact owned by the current user
		const check_stmt = db.prepare(`
      SELECT i.id
      FROM interactions i
      INNER JOIN contacts c ON i.contact_id = c.id
      WHERE i.id = ? AND c.user_id = ?
    `);
		const interaction = check_stmt.get(data.id, user_id);

		if (!interaction) {
			return {
				error: 'Interaction not found',
			};
		}

		const stmt = db.prepare(`
      UPDATE interactions
      SET type = ?, note = ?, updated_at = ?
      WHERE id = ?
    `);

		stmt.run(data.type, data.note || null, Date.now(), data.id);
	},
);

/**
 * Delete an interaction
 */
export const delete_interaction = guarded_command(
	v.pipe(v.string(), v.minLength(1)),
	async (id) => {
		const user_id = await get_current_user_id();

		// Verify the interaction belongs to a contact owned by the current user
		const check_stmt = db.prepare(`
      SELECT i.id
      FROM interactions i
      INNER JOIN contacts c ON i.contact_id = c.id
      WHERE i.id = ? AND c.user_id = ?
    `);
		const interaction = check_stmt.get(id, user_id);

		if (!interaction) {
			return {
				error: 'Interaction not found',
			};
		}

		const stmt = db.prepare(`
      DELETE FROM interactions
      WHERE id = ?
    `);

		stmt.run(id);
	},
);

/**
 * Get interaction statistics for a contact
 */
export const get_interaction_stats = query.batch(
	v.pipe(v.string(), v.minLength(1)),
	async (contact_ids) => {
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

		// Get stats for all contacts
		const stmt = db.prepare(`
      SELECT
        contact_id,
        type,
        COUNT(*) as count
      FROM interactions
      WHERE contact_id IN (${placeholders})
      GROUP BY contact_id, type
    `);

		const all_stats = stmt.all(...contact_ids) as Array<{
			contact_id: string;
			type: string;
			count: number;
		}>;

		// Return lookup function
		return (contact_id) => {
			if (!valid_ids.has(contact_id)) {
				return null;
			}

			const stats = all_stats.filter(
				(s) => s.contact_id === contact_id,
			);

			return {
				total: stats.reduce((sum, stat) => sum + stat.count, 0),
				by_type: stats.reduce(
					(acc, stat) => {
						acc[stat.type] = stat.count;
						return acc;
					},
					{} as Record<string, number>,
				),
			};
		};
	},
);
