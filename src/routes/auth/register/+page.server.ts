import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { hash } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load = (async (event) => {
	// If user is already logged in, redirect to dashboard
	if (event.locals.user) {
		return redirect(302, '/dashboard');
	}
	return {};
}) satisfies PageServerLoad;

export const actions = {
	register: async (event) => {
		const form_data = await event.request.formData();
		const username = form_data.get('username');
		const password = form_data.get('password');
		const confirm_password = form_data.get('confirmPassword');

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
		if (password !== confirm_password) {
			return fail(400, {
				message: 'Passwords do not match',
			});
		}

		// Check if username already exists
		const existing_user = await db
			.select({ id: table.user.id })
			.from(table.user)
			.where(eq(table.user.username, username))
			.then((results) => results.at(0));

		if (existing_user) {
			return fail(400, {
				message: 'Username already taken',
			});
		}

		const user_id = generate_user_id();
		const password_hash = await hash(password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1,
		});

		try {
			await db.insert(table.user).values({
				id: user_id,
				username,
				passwordHash: password_hash,
			});

			const session_token = auth.generateSessionToken();
			const session = await auth.createSession(
				session_token,
				user_id,
			);
			auth.setSessionTokenCookie(
				event,
				session_token,
				session.expiresAt,
			);
		} catch (e) {
			console.error('Registration error:', e);
			return fail(500, {
				message: 'An error occurred during registration',
			});
		}

		return redirect(302, '/dashboard');
	},
} satisfies Actions;

const generate_user_id = () => {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
};

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
