import { getRequestEvent } from '$app/server';
import { betterAuth } from 'better-auth';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import Database from 'better-sqlite3';

// Create separate database instance for Better Auth
const auth_db = new Database('local.db');

// Enable WAL mode for better concurrency
auth_db.pragma('journal_mode = WAL');
auth_db.pragma('busy_timeout = 5000');
auth_db.pragma('synchronous = NORMAL');

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
