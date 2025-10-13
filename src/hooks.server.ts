import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { run_migrations } from '$lib/server/migrate';
import { themes } from '$lib/themes';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { readFileSync } from 'node:fs';
import { seed_demo } from './routes/api/ingest/seed-demo';

const DEMO_USER_EMAIL = env.DEMO_USER_EMAIL || 'demo@devhubcrm.com';

// Initialize schema on startup
const schema = readFileSync('schema.sql', 'utf-8');
db.exec(schema);

// Run any pending migrations
run_migrations();

// Auto-seed demo account in development if it doesn't exist
if (process.env.NODE_ENV !== 'production') {
	const demo_user = db
		.prepare('SELECT id FROM user WHERE email = ?')
		.get(DEMO_USER_EMAIL);

	if (!demo_user) {
		console.log('Demo user not found - seeding demo data...');
		seed_demo()
			.then((result) => {
				console.log('Demo seeded:', result.message);
			})
			.catch((error) => {
				console.error('Failed to seed demo:', error);
			});
	}
}

const sync_on_startup: Handle = async ({ event, resolve }) => {
	// SQLite migration: No sync needed for local database
	return await resolve(event);
};

export const theme: Handle = async ({ event, resolve }) => {
	const theme = event.cookies.get('theme');

	return await resolve(event, {
		transformPageChunk: ({ html }) => {
			if (theme && themes.includes(theme)) {
				return html.replace('data-theme=""', `data-theme="${theme}"`);
			}
			return html;
		},
	});
};

export const handle = sequence(sync_on_startup, theme);
