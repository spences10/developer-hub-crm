import { db } from '$lib/server/database'
import { contacts, insert_contacts_schema } from '$lib/server/schema'
import { error } from '@sveltejs/kit'
import type { Action, Actions } from './$types'

export const load = async () => {}

const date_to_timestamp = (date_string: string) => {
	const date = new Date(date_string)
	return Math.floor(date.getTime() / 1000)
}

const add_contact: Action = async ({ locals, request }) => {
	const formData = Object.fromEntries(await request.formData())

	// Fetch the user details from locals
	const authDetails = await locals.auth?.validate()
	if (!authDetails) {
		throw error(401, 'Unauthorized')
	}
	const { user } = authDetails
	const userId = user.userId

	// Create a new object to store parsed data
	const parsedFormData: { [k: string]: any } = { ...formData }

	// Include the user_id in parsedFormData
	parsedFormData.user_id = userId

	if (formData.vip === 'on') {
		parsedFormData.vip = 1
	} else {
		parsedFormData.vip = 0
	}

	// Convert date fields to Unix timestamp
	parsedFormData.birthday = new Date(
		date_to_timestamp(formData.birthday.toString()) * 1000,
	)
	parsedFormData.last_update = new Date(
		date_to_timestamp(formData.last_update.toString()) * 1000,
	)
	parsedFormData.last_contacted = new Date(
		date_to_timestamp(formData.last_contacted.toString()) * 1000,
	)

	// Validate using Drizzle-Zod schema
	const parsedData = insert_contacts_schema.safeParse(parsedFormData)

	if (!parsedData.success) {
		// Handle validation errors
		console.error(parsedData.error)
		return {
			status: 400,
			body: parsedData.error,
		}
	}

	// If validation succeeds, insert into database
	try {
		await db.insert(contacts).values(parsedData.data)
	} catch (err) {
		console.log(`Error: ${err}`)
		throw error(500, 'Something went wrong adding contact')
	}
	return {
		success: true,
	}
}

export const actions: Actions = { add_contact }
