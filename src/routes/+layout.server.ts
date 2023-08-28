import { redirect } from '@sveltejs/kit'

export const load = async ({ locals, route }) => {
	const session = await locals.auth.validate()

	if (!session) {
		if (
			route.id === '/(auth)/login' ||
			route.id === '/(auth)/register'
		) {
			return
		}

		throw redirect(302, '/login')
	}

	return {
		userId: session.user.userId,
		username: session.user.username,
	}
}
