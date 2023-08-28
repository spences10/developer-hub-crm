import { auth } from '$lib/server/lucia.js'
import { redirect } from '@sveltejs/kit'

export const POST = async ({ locals }) => {
	const session = await locals.auth.validate()
	if (session) {
		await auth.invalidateSession(session.sessionId)
		locals.auth.setSession(null)
	}
	throw redirect(302, '/login')
}
