import { hash, verify } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

export const load = (async (event) => {
	// If user is already logged in, redirect to dashboard
	if (event.locals.user) {
		return redirect(302, '/dashboard');
	}
	return {};
}) satisfies PageServerLoad;

export const actions = {
	login: async (event) => {
		const form_data = await event.request.formData();
		const username = form_data.get('username');
		const password = form_data.get('password');

		if (!validate_username(username)) {
			return fail(400, {
				message:
					'Invalid username (min 3, max 31 characters, alphanumeric only)',
			});
		}
		if (!validate_password(password)) {
			return fail(400, {
				message: 'Invalid password (min 6, max 255 characters)',
			});
		}

		const results = await db
			.select()
			.from(table.user)
			.where(eq(table.user.username, username));

		const existing_user = results.at(0);
		if (!existing_user) {
			return fail(400, { message: 'Incorrect username or password' });
		}

		const valid_password = await verify(
			existing_user.passwordHash,
			password,
			{
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1,
			},
		);
		if (!valid_password) {
			return fail(400, { message: 'Incorrect username or password' });
		}

		const session_token = auth.generateSessionToken();
		const session = await auth.createSession(
			session_token,
			existing_user.id,
		);
		auth.setSessionTokenCookie(
			event,
			session_token,
			session.expiresAt,
		);

		return redirect(302, '/dashboard');
	},
} satisfies Actions;

const validate_username = (username: unknown): username is string => {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-z0-9_-]+$/.test(username)
	);
};

const validate_password = (password: unknown): password is string => {
	return (
		typeof password === 'string' &&
		password.length >= 6 &&
		password.length <= 255
	);
};
