import { env } from '$env/dynamic/private';
import path from 'node:path';

/**
 * Get the database path based on environment
 *
 * Production (Coolify): Uses DATABASE_PATH env var -> /app/local.db
 * Local dev: Uses data/local.db
 */
export const get_database_path = () => {
	return (
		env.DATABASE_PATH || path.join(process.cwd(), 'data', 'local.db')
	);
};
