import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { contact, interaction, background, contactInfo } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = (async ({ params, locals }) => {
	// Protect this route - redirect to login if not authenticated
	if (!locals.user) {
		throw redirect(302, '/auth');
	}

	const contactData = await db.query.contact.findFirst({
		where: eq(contact.id, params.id),
		with: {
			interactions: {
				orderBy: (interaction, { desc }) => [desc(interaction.date)],
			},
			background: true,
			contactInfo: true
		}
	});

	if (!contactData) {
		throw error(404, 'Contact not found');
	}

	if (contactData.userId !== locals.user.id) {
		throw error(403, 'Forbidden');
	}

	return {
		contact: contactData,
		user: locals.user
	};
}) satisfies PageServerLoad;
