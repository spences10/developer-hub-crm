import { db } from '$lib/server/db';
import { readFileSync } from 'node:fs';

// Initialize schema on startup
const schema = readFileSync('schema.sql', 'utf-8');
db.exec(schema);

export async function handle({ event, resolve }) {
	return resolve(event);
}
