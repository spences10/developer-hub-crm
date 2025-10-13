import { env } from '$env/dynamic/private';
import { get_database_path } from '$lib/server/db-path';
import Database from 'better-sqlite3';
import fs from 'node:fs/promises';
import path from 'node:path';

export const pull_database = async () => {
	try {
		const db_path = get_database_path();
		const backups_dir = path.join(path.dirname(db_path), 'backups');

		// Ensure backups directory exists
		await fs.mkdir(backups_dir, { recursive: true });

		const production_url =
			env.PRODUCTION_URL || 'https://devhub.party';

		console.log(`[pull_database] Database path: ${db_path}`);
		console.log(`[pull_database] Backups directory: ${backups_dir}`);
		console.log(`[pull_database] Production URL: ${production_url}`);

		// Download latest backup from production
		console.log('Downloading latest backup from production...');
		const response = await fetch(
			`${production_url}/api/ingest/download`,
			{
				headers: {
					Authorization: `Bearer ${env.INGEST_TOKEN}`,
				},
			},
		);

		if (!response.ok) {
			throw new Error(
				`Failed to download backup: ${response.status} ${response.statusText}`,
			);
		}

		// Save downloaded backup to temporary location
		const now = new Date();
		const date = now.toISOString().split('T')[0];
		const hour = now.getHours().toString().padStart(2, '0');
		const minute = now.getMinutes().toString().padStart(2, '0');
		const downloaded_filename = `local-downloaded-${date}-${hour}${minute}.db`;
		const downloaded_path = path.join(
			backups_dir,
			downloaded_filename,
		);

		const arrayBuffer = await response.arrayBuffer();
		await fs.writeFile(downloaded_path, new Uint8Array(arrayBuffer));

		console.log(
			`[pull_database] Downloaded backup saved to: ${downloaded_path}`,
		);

		// Create backup of current local database before replacing using SQLite backup API
		const current_backup_name = `local-backup-${date}-${hour}${minute}.db`;
		const current_backup_path = path.join(
			backups_dir,
			current_backup_name,
		);

		try {
			const current_db = new Database(db_path, { readonly: true });
			try {
				await current_db.backup(current_backup_path);
				console.log(
					`[pull_database] Current database backed up to: ${current_backup_path}`,
				);
			} finally {
				current_db.close();
			}
		} catch (error) {
			console.warn(
				'Could not backup current database (may not exist):',
				error,
			);
		}

		// Replace local database with downloaded backup using SQLite backup API
		// This avoids corruption issues with WAL mode (see: scottspence.com/posts/sqlite-corruption-fs-copyfile-issue)
		const downloaded_db = new Database(downloaded_path, {
			readonly: true,
		});

		try {
			await downloaded_db.backup(db_path);
			console.log(
				`[pull_database] Database replaced with production backup`,
			);
		} finally {
			downloaded_db.close();
		}

		const imported_size = await fs.stat(db_path);

		return {
			message: 'Database pulled from production successfully',
			downloaded_backup: downloaded_filename,
			database_size: `${Math.round(imported_size.size / 1024 / 1024)}MB`,
			local_backup_created: current_backup_name,
		};
	} catch (error) {
		console.error('Error pulling database:', error);
		throw error;
	}
};
