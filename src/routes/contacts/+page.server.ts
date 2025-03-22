import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { contact } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export const load: PageServerLoad = async ({ locals }) => {
	// Protect this route - redirect to login if not authenticated
	if (!locals.user) {
		throw redirect(302, '/auth');
	}

	const user_id = locals.user.id;
	const user_contacts = await db.query.contact.findMany({
		where: eq(contact.userId, user_id),
		orderBy: (contact, { desc }) => [desc(contact.lastUpdate)]
	});

	return {
		contacts: user_contacts,
		user: locals.user
	};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		// Protect this action - redirect to login if not authenticated
		if (!locals.user) {
			throw redirect(302, '/auth');
		}

		const user_id = locals.user.id;
		const form_data = await request.formData();
		const name = form_data.get('name')?.toString();
		const relationship = form_data.get('relationship')?.toString();
		const industry = form_data.get('industry')?.toString();
		const location = form_data.get('location')?.toString();
		const vip = form_data.has('vip');

		if (!name) {
			return fail(400, { error: 'Name is required' });
		}

		try {
			const new_contact = await db.insert(contact).values({
				id: nanoid(),
				userId: user_id,
				name,
				relationship: relationship || null,
				industry: industry || null,
				location: location || null,
				vip: vip ? 1 : 0,
				lastUpdate: new Date()
			});

			return { success: true };
		} catch (err) {
			console.error('Failed to create contact:', err);
			return fail(500, { error: 'Failed to create contact' });
		}
	},

	update: async ({ request, locals }) => {
		// Protect this action - redirect to login if not authenticated
		if (!locals.user) {
			throw redirect(302, '/auth');
		}

		const user_id = locals.user.id;
		const form_data = await request.formData();
		const id = form_data.get('id')?.toString();
		const name = form_data.get('name')?.toString();
		const relationship = form_data.get('relationship')?.toString();
		const industry = form_data.get('industry')?.toString();
		const location = form_data.get('location')?.toString();
		const vip = form_data.has('vip');

		if (!id || !name) {
			return fail(400, { error: 'ID and name are required' });
		}

		try {
			// Verify the contact belongs to the user
			const existing_contact = await db.query.contact.findFirst({
				where: (contact, { and, eq }) => 
					and(eq(contact.id, id), eq(contact.userId, user_id))
			});

			if (!existing_contact) {
				return fail(404, { error: 'Contact not found' });
			}

			await db.update(contact)
				.set({
					name,
					relationship: relationship || null,
					industry: industry || null,
					location: location || null,
					vip: vip ? 1 : 0,
					lastUpdate: new Date()
				})
				.where(eq(contact.id, id));

			return { success: true };
		} catch (err) {
			console.error('Failed to update contact:', err);
			return fail(500, { error: 'Failed to update contact' });
		}
	},

	delete: async ({ request, locals }) => {
		// Protect this action - redirect to login if not authenticated
		if (!locals.user) {
			throw redirect(302, '/auth');
		}

		const user_id = locals.user.id;
		const form_data = await request.formData();
		const id = form_data.get('id')?.toString();

		if (!id) {
			return fail(400, { error: 'Contact ID is required' });
		}

		try {
			// Verify the contact belongs to the user
			const existing_contact = await db.query.contact.findFirst({
				where: (contact, { and, eq }) => 
					and(eq(contact.id, id), eq(contact.userId, user_id))
			});

			if (!existing_contact) {
				return fail(404, { error: 'Contact not found' });
			}

			await db.delete(contact).where(eq(contact.id, id));
			return { success: true };
		} catch (err) {
			console.error('Failed to delete contact:', err);
			return fail(500, { error: 'Failed to delete contact' });
		}
	}
};
