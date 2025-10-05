import { db } from '$lib/server/db';
import { themes } from '$lib/themes';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { readFileSync } from 'node:fs';

// Initialize schema on startup
const schema = readFileSync('schema.sql', 'utf-8');
db.exec(schema);

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
