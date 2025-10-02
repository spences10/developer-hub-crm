import { query, getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { auth } from './auth';

export const guarded_query = <T>(fn: () => T) => {
	return query(async () => {
		const event = getRequestEvent();

		const session = await auth.api.getSession({
			headers: event.request.headers,
		});

		if (!session) {
			redirect(307, '/auth/login');
		}

		return fn();
	});
};
