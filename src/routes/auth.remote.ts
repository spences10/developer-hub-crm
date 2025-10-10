import { command, form, getRequestEvent, query } from '$app/server';
import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import * as v from 'valibot';

export const register = form(
	v.object({
		name: v.pipe(v.string(), v.minLength(1, 'Name is required')),
		email: v.pipe(v.string(), v.email('Invalid email address')),
		password: v.pipe(
			v.string(),
			v.minLength(8, 'Password must be at least 8 characters'),
		),
	}),
	async ({ name, email, password }) => {
		const event = getRequestEvent();

		try {
			await auth.api.signUpEmail({
				body: { name, email, password },
				headers: event.request.headers,
			});
		} catch (error: any) {
			console.error('Registration error:', error);
			return {
				error: error.message || 'Registration failed',
			};
		}

		// Redirect MUST be outside try/catch because it throws an error
		redirect(303, '/register/success');
	},
);

export const login = form(
	v.object({
		email: v.pipe(v.string(), v.email('Invalid email address')),
		password: v.pipe(
			v.string(),
			v.minLength(1, 'Password is required'),
		),
	}),
	async ({ email, password }) => {
		const event = getRequestEvent();

		try {
			// sveltekitCookies plugin handles cookies automatically
			await auth.api.signInEmail({
				body: { email, password },
				headers: event.request.headers,
			});
		} catch (error: any) {
			// Check if error is due to unverified email
			if (
				error.message?.includes('verify') ||
				error.message?.includes('verification')
			) {
				return {
					error:
						'Please verify your email address before logging in.',
					unverified: true,
					email,
				};
			}
			return {
				error: error.message || 'Invalid email or password',
			};
		}

		redirect(303, '/dashboard');
	},
);

export const logout = command(async () => {
	const event = getRequestEvent();

	await auth.api.signOut({
		headers: event.request.headers,
	});

	return { success: true };
});

export const get_current_user = query(async () => {
	const event = getRequestEvent();

	const session = await auth.api.getSession({
		headers: event.request.headers,
	});

	return session?.user ?? null;
});

export const demo_login = command(async () => {
	const event = getRequestEvent();

	try {
		await auth.api.signInEmail({
			body: {
				email: 'demo@devhubcrm.com',
				password: 'demo1234567890',
			},
			headers: event.request.headers,
		});

		return { success: true };
	} catch (error: any) {
		console.error('Demo login error:', error);
		return {
			success: false,
			error: error.message || 'Demo login failed',
		};
	}
});

export const resend_verification_email = command(
	v.pipe(v.string(), v.email('Invalid email address')),
	async (email: string) => {
		const event = getRequestEvent();

		try {
			await auth.api.sendVerificationEmail({
				body: { email, callbackURL: '/dashboard' },
				headers: event.request.headers,
			});

			return {
				success: true,
				message: 'Verification email sent! Please check your inbox.',
			};
		} catch (error: any) {
			return {
				error: error.message || 'Failed to send verification email',
			};
		}
	},
);

export const forgot_password = form(
	v.object({
		email: v.pipe(v.string(), v.email('Invalid email address')),
	}),
	async ({ email }) => {
		const event = getRequestEvent();

		try {
			await auth.api.forgetPassword({
				body: {
					email,
					redirectTo: '/reset-password',
				},
				headers: event.request.headers,
			});
		} catch (error: any) {
			console.error('Forgot password error:', error);
			// Don't reveal if email exists - still redirect to success page
		}

		// Always redirect to success page for security (don't reveal if email exists)
		redirect(303, '/forgot-password/sent');
	},
);

export const reset_password = form(
	v.object({
		password: v.pipe(
			v.string(),
			v.minLength(8, 'Password must be at least 8 characters'),
		),
		token: v.pipe(v.string(), v.minLength(1, 'Token is required')),
	}),
	async ({ password, token }) => {
		const event = getRequestEvent();

		try {
			await auth.api.resetPassword({
				body: { newPassword: password, token },
				headers: event.request.headers,
			});
		} catch (error: any) {
			console.error('Reset password error:', error);
			return {
				error:
					error.message ||
					'Failed to reset password. The link may have expired.',
			};
		}

		redirect(303, '/login?reset=success');
	},
);
