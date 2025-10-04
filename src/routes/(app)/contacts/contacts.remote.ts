import { query } from '$app/server';
import {
	get_current_user_id,
	guarded_command,
	guarded_form,
} from '$lib/server/auth-helpers';
import { db } from '$lib/server/db';
import { fetch_github_contact } from '$lib/server/github';
import type { Contact } from '$lib/types/db';
import { redirect } from '@sveltejs/kit';
import * as v from 'valibot';

/**
 * Get all contacts for the current user with optional search
 */
export const get_contacts = query.batch(
	v.optional(v.string(), ''),
	async (searches): Promise<(search?: string) => Contact[]> => {
		const user_id = await get_current_user_id();

		// For search queries, we can't really batch them efficiently
		// since each search term is different. Return a function that
		// executes the query for the specific search term.
		return (search = '') => {
			let sql = `
        SELECT * FROM contacts
        WHERE user_id = ?
      `;
			const params: any[] = [user_id];

			if (search && search.trim()) {
				sql += `
          AND (
            name LIKE ? OR
            email LIKE ? OR
            company LIKE ? OR
            github_username LIKE ?
          )
        `;
				const search_term = `%${search.trim()}%`;
				params.push(
					search_term,
					search_term,
					search_term,
					search_term,
				);
			}

			sql += ' ORDER BY name ASC';

			const stmt = db.prepare(sql);
			return stmt.all(...params) as Contact[];
		};
	},
);

/**
 * Get a single contact with additional stats
 */
export const get_contact = query.batch(
	v.pipe(v.string(), v.minLength(1)),
	async (ids) => {
		const user_id = await get_current_user_id();

		// Fetch all requested contacts in one go
		const placeholders = ids.map(() => '?').join(',');
		const contact_stmt = db.prepare(`
      SELECT * FROM contacts
      WHERE id IN (${placeholders}) AND user_id = ?
    `);
		const contacts = contact_stmt.all(...ids, user_id) as Contact[];

		// Get stats for all contacts
		const stats_stmt = db.prepare(`
      SELECT
        contact_id,
        COUNT(*) as interaction_count,
        MAX(created_at) as last_interaction_at
      FROM interactions
      WHERE contact_id IN (${placeholders})
      GROUP BY contact_id
    `);
		const stats = stats_stmt.all(...ids) as Array<{
			contact_id: string;
			interaction_count: number;
			last_interaction_at: number | null;
		}>;

		// Get follow-ups for all contacts
		const follow_ups_stmt = db.prepare(`
      SELECT contact_id, COUNT(*) as pending_follow_ups
      FROM follow_ups
      WHERE contact_id IN (${placeholders}) AND completed = 0
      GROUP BY contact_id
    `);
		const follow_ups = follow_ups_stmt.all(...ids) as Array<{
			contact_id: string;
			pending_follow_ups: number;
		}>;

		// Return lookup function
		return (id) => {
			const contact = contacts.find((c) => c.id === id);
			if (!contact) {
				redirect(404, '/contacts');
			}

			const contact_stats = stats.find((s) => s.contact_id === id);
			const contact_follow_ups = follow_ups.find(
				(f) => f.contact_id === id,
			);

			return {
				...contact,
				interaction_count: contact_stats?.interaction_count || 0,
				last_interaction_at:
					contact_stats?.last_interaction_at || null,
				pending_follow_ups:
					contact_follow_ups?.pending_follow_ups || 0,
			};
		};
	},
);

/**
 * Create a new contact
 */
export const create_contact = guarded_form(
	v.object({
		name: v.pipe(v.string(), v.minLength(1, 'Name is required')),
		email: v.optional(v.pipe(v.string(), v.email('Invalid email'))),
		phone: v.optional(v.string()),
		company: v.optional(v.string()),
		title: v.optional(v.string()),
		github_username: v.optional(v.string()),
		is_vip: v.optional(v.boolean()),
		birthday: v.optional(v.string()), // YYYY-MM-DD format
		notes: v.optional(v.string()),
	}),
	async (data) => {
		const user_id = await get_current_user_id();

		const stmt = db.prepare(`
      INSERT INTO contacts (
        id, user_id, name, email, phone, company, title,
        github_username, is_vip, birthday, notes,
        last_contacted_at, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

		const id = crypto.randomUUID();
		const now = Date.now();

		stmt.run(
			id,
			user_id,
			data.name,
			data.email || null,
			data.phone || null,
			data.company || null,
			data.title || null,
			data.github_username || null,
			data.is_vip ? 1 : 0,
			data.birthday || null,
			data.notes || null,
			null, // last_contacted_at
			now,
			now,
		);

		redirect(303, `/contacts/${id}`);
	},
);

const update_contact_schema = v.object({
	id: v.pipe(v.string(), v.minLength(1)),
	name: v.pipe(v.string(), v.minLength(1, 'Name is required')),
	email: v.optional(v.pipe(v.string(), v.email('Invalid email'))),
	phone: v.optional(v.string()),
	company: v.optional(v.string()),
	title: v.optional(v.string()),
	github_username: v.optional(v.string()),
	is_vip: v.optional(v.boolean()),
	birthday: v.optional(v.string()),
	notes: v.optional(v.string()),
});

/**
 * Update an existing contact
 */
export const update_contact = guarded_command(
	update_contact_schema,
	async (data: v.InferOutput<typeof update_contact_schema>) => {
		const user_id = await get_current_user_id();

		const stmt = db.prepare(`
      UPDATE contacts
      SET
        name = ?,
        email = ?,
        phone = ?,
        company = ?,
        title = ?,
        github_username = ?,
        is_vip = ?,
        birthday = ?,
        notes = ?,
        updated_at = ?
      WHERE id = ? AND user_id = ?
    `);

		stmt.run(
			data.name,
			data.email || null,
			data.phone || null,
			data.company || null,
			data.title || null,
			data.github_username || null,
			data.is_vip ? 1 : 0,
			data.birthday || null,
			data.notes || null,
			Date.now(),
			data.id,
			user_id,
		);
	},
);

/**
 * Delete a contact
 */
export const delete_contact = guarded_command(
	v.pipe(v.string(), v.minLength(1)),
	async (id) => {
		const user_id = await get_current_user_id();

		const stmt = db.prepare(`
      DELETE FROM contacts
      WHERE id = ? AND user_id = ?
    `);

		stmt.run(id, user_id);

		redirect(303, '/contacts');
	},
);

/**
 * Get VIP contacts for the current user
 */
export const get_vip_contacts = query(
	async (): Promise<Contact[]> => {
		const user_id = await get_current_user_id();

		const stmt = db.prepare(`
    SELECT * FROM contacts
    WHERE user_id = ? AND is_vip = 1
    ORDER BY name ASC
  `);

		return stmt.all(user_id) as Contact[];
	},
);

/**
 * Get recently added contacts (last 7 days)
 */
export const get_recent_contacts = query(
	async (limit: number = 5): Promise<Contact[]> => {
		const user_id = await get_current_user_id();

		const stmt = db.prepare(`
    SELECT * FROM contacts
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT ?
  `);

		return stmt.all(user_id, limit) as Contact[];
	},
);

/**
 * Get contacts with upcoming birthdays (within next 30 days)
 */
export const get_upcoming_birthdays = query(
	async (): Promise<Contact[]> => {
		const user_id = await get_current_user_id();

		// This is a simplified version - would need more complex logic for cross-year birthdays
		const stmt = db.prepare(`
    SELECT * FROM contacts
    WHERE user_id = ? AND birthday IS NOT NULL
    ORDER BY birthday ASC
  `);

		return stmt.all(user_id) as Contact[];
	},
);

/**
 * Fetch contact data from GitHub username
 */
export const fetch_github_data = guarded_command(
	v.pipe(v.string(), v.minLength(1, 'GitHub username is required')),
	async (username: string) => {
		const contact_data = await fetch_github_contact(username);

		if (!contact_data) {
			return {
				error: 'GitHub user not found',
			};
		}

		return {
			success: true,
			data: contact_data,
		};
	},
);
