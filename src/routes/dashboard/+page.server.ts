import { db } from '$lib/server/db';
import { contact } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Protect this route - redirect to login if not authenticated
	if (!locals.user) {
		throw redirect(302, '/auth');
	}

	const user_id = locals.user.id;

	// Get user contacts for dashboard stats
	const user_contacts = await db.query.contact.findMany({
		where: eq(contact.userId, user_id),
		orderBy: (contact, { desc }) => [desc(contact.lastUpdate)],
	});

	return {
		user: locals.user,
		contacts: user_contacts,
	};
};
