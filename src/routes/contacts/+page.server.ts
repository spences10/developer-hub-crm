import { db } from '$lib/server/database'
import { contacts } from '$lib/server/schema'
import { error } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export const load = async ({ locals }) => {
	// Fetch the user details from locals
	const authDetails = await locals.auth?.validate()
	if (!authDetails) {
		throw error(401, 'Unauthorized')
	}
	const { user } = authDetails
	const user_id = user.userId

	let all_contacts
	try {
		all_contacts = await db
			.select()
			.from(contacts)
			.where(eq(contacts.user_id, user_id))
	} catch (err) {
		console.log(`Error: ${err}`)
		return {
			status: 500,
			body: 'Something went wrong fetching contacts',
		}
	}
	return {
		status: 200,
		body: { all_contacts },
	}
}
