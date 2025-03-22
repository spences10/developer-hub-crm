import { redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load = (async (event) => {
	// Redirect to login if not authenticated
	if (!event.locals.user) {
		return redirect(302, '/auth/login');
	}
	
	// Redirect to dashboard if authenticated
	return redirect(302, '/dashboard');
}) satisfies PageServerLoad;

export const actions = {
	logout: async (event) => {
		const session_id = event.cookies.get(auth.sessionCookieName);
		if (!session_id) {
			return redirect(302, '/');
		}

		await auth.invalidateSession(session_id);
		event.cookies.delete(auth.sessionCookieName, { path: '/' });
		return redirect(302, '/');
	},
} satisfies Actions;
