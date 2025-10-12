import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { db } from './db';

// Create migrations table if it doesn't exist
function init_migrations_table() {
	db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      applied_at INTEGER NOT NULL
    )
  `);
}

// Get list of applied migrations
function get_applied_migrations(): string[] {
	const stmt = db.prepare('SELECT name FROM migrations ORDER BY id');
	const rows = stmt.all() as { name: string }[];
	return rows.map((row) => row.name);
}

// Apply a single migration
function apply_migration(name: string, sql: string) {
	const transaction = db.transaction(() => {
		db.exec(sql);
		db.prepare(
			'INSERT INTO migrations (name, applied_at) VALUES (?, ?)',
		).run(name, Date.now());
	});

	transaction();
}

// Run all pending migrations
export function run_migrations() {
	init_migrations_table();

	const applied = get_applied_migrations();
	const migrations_dir = 'migrations';

	// Get all migration files
	let migration_files: string[] = [];
	try {
		migration_files = readdirSync(migrations_dir)
			.filter((f) => f.endsWith('.sql'))
			.sort();
	} catch (error) {
		// Migrations directory doesn't exist or is empty
		console.log('No migrations directory found');
		return;
	}

	// Apply pending migrations
	const pending = migration_files.filter((f) => !applied.includes(f));

	if (pending.length === 0) {
		console.log('No pending migrations');
		return;
	}

	console.log(`Applying ${pending.length} migration(s)...`);

	for (const file of pending) {
		console.log(`  - ${file}`);
		const sql = readFileSync(join(migrations_dir, file), 'utf-8');
		apply_migration(file, sql);
	}

	console.log('Migrations complete');
}
