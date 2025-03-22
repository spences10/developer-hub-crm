import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { contact, interaction, background, contactInfo } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export const load = (async ({ params, locals }) => {
	// Protect this route - redirect to login if not authenticated
	if (!locals.user) {
		throw redirect(302, '/auth');
	}

	const contact_data = await db.query.contact.findFirst({
		where: eq(contact.id, params.id),
		with: {
			interactions: {
				orderBy: (interaction, { desc }) => [desc(interaction.date)],
			},
			background: true,
			contactInfo: true
		}
	});

	if (!contact_data) {
		throw error(404, 'Contact not found');
	}

	if (contact_data.userId !== locals.user.id) {
		throw error(403, 'Forbidden');
	}

	return {
		contact: contact_data,
		user: locals.user
	};
}) satisfies PageServerLoad;

export const actions = {
	add_interaction: async ({ request, params, locals }) => {
		if (!locals.user) {
			throw error(401, 'Unauthorized');
		}

		const data = await request.formData();
		const type = data.get('type')?.toString();
		const date = data.get('date')?.toString();
		const notes = data.get('notes')?.toString();

		if (!type || !date) {
			throw error(400, 'Missing required fields');
		}

		// Convert date string to Date object for database
		const date_obj = new Date(date);

		// Verify contact exists and belongs to user
		const contact_data = await db.query.contact.findFirst({
			where: eq(contact.id, params.id)
		});

		if (!contact_data) {
			throw error(404, 'Contact not found');
		}

		if (contact_data.userId !== locals.user.id) {
			throw error(403, 'Forbidden');
		}

		// Create interaction
		await db.insert(interaction).values({
			id: nanoid(),
			contactId: params.id,
			type,
			date: date_obj,
			notes: notes || null,
			created_at: new Date(),
			updated_at: new Date()
		});

		// Update contact's lastContacted
		await db.update(contact)
			.set({ lastContacted: date_obj })
			.where(eq(contact.id, params.id));

		return { success: true };
	},

	delete_interaction: async ({ request, params, locals }) => {
		if (!locals.user) {
			throw error(401, 'Unauthorized');
		}

		const data = await request.formData();
		const id = data.get('id')?.toString();

		if (!id) {
			throw error(400, 'Missing interaction ID');
		}

		// Verify interaction exists and belongs to user's contact
		const interaction_data = await db.query.interaction.findFirst({
			where: eq(interaction.id, id),
			with: {
				contact: true
			}
		});

		if (!interaction_data) {
			throw error(404, 'Interaction not found');
		}

		if (interaction_data.contact.userId !== locals.user.id) {
			throw error(403, 'Forbidden');
		}

		// Delete interaction
		await db.delete(interaction).where(eq(interaction.id, id));

		// Update contact's lastContacted to the most recent remaining interaction
		const most_recent_interaction = await db.query.interaction.findFirst({
			where: eq(interaction.contactId, params.id),
			orderBy: (interaction, { desc }) => [desc(interaction.date)]
		});

		await db.update(contact)
			.set({ 
				lastContacted: most_recent_interaction ? most_recent_interaction.date : null 
			})
			.where(eq(contact.id, params.id));

		return { success: true };
	}
} satisfies Actions;
