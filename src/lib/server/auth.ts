import { betterAuth } from 'better-auth';
import Database from 'better-sqlite3';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';

// Create separate database instance for Better Auth
const auth_db = new Database('local.db');

export const auth = betterAuth({
	database: auth_db,
	emailAndPassword: {
		enabled: true,
	},
	secret:
		process.env.AUTH_SECRET || 'dev-secret-change-in-production',
	baseURL: process.env.AUTH_BASE_URL || 'http://localhost:5173',
	plugins: [
		sveltekitCookies(getRequestEvent), // Automatically handles cookies
	],
});
