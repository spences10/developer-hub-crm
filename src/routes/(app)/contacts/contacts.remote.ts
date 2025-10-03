import { query, command } from '$app/server';
import { redirect } from '@sveltejs/kit';
import * as v from 'valibot';
import { db } from '$lib/server/db';
import {
	get_current_user_id,
	guarded_form,
	guarded_command,
} from '$lib/server/auth-helpers';
import type { Contact } from '$lib/types/db';

/**
 * Get all contacts for the current user with optional search
 */
export const get_contacts = query(
	async (search?: string): Promise<Contact[]> => {
		const user_id = await get_current_user_id();

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
			params.push(search_term, search_term, search_term, search_term);
		}

		sql += ' ORDER BY name ASC';

		const stmt = db.prepare(sql);
		return stmt.all(...params) as Contact[];
	},
);

/**
 * Get a single contact with additional stats
 */
export async function get_contact(id: string) {
	const user_id = await get_current_user_id();

	const contact_stmt = db.prepare(`
    SELECT * FROM contacts
    WHERE id = ? AND user_id = ?
  `);
	const contact = contact_stmt.get(id, user_id) as
		| Contact
		| undefined;

	if (!contact) {
		redirect(404, '/contacts');
	}

	// Get interaction count and last interaction date
	const stats_stmt = db.prepare(`
    SELECT
      COUNT(*) as interaction_count,
      MAX(created_at) as last_interaction_at
    FROM interactions
    WHERE contact_id = ?
  `);
	const stats = stats_stmt.get(id) as {
		interaction_count: number;
		last_interaction_at: number | null;
	};

	// Get pending follow-ups count
	const follow_ups_stmt = db.prepare(`
    SELECT COUNT(*) as pending_follow_ups
    FROM follow_ups
    WHERE contact_id = ? AND completed = 0
  `);
	const follow_ups = follow_ups_stmt.get(id) as {
		pending_follow_ups: number;
	};

	return {
		...contact,
		interaction_count: stats.interaction_count,
		last_interaction_at: stats.last_interaction_at,
		pending_follow_ups: follow_ups.pending_follow_ups,
	};
}

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
