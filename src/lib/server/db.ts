import Database from 'better-sqlite3';
import * as sqliteVec from 'sqlite-vec';
import { get_database_path } from './db-path';

const db = new Database(get_database_path());

// Load sqlite-vec extension for vector similarity search
try {
	sqliteVec.load(db);
	console.log('sqlite-vec extension loaded successfully');
} catch (error) {
	console.warn('sqlite-vec extension failed to load:', error);
	console.warn('Vector similarity queries will not work');
}

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Wait up to 5 seconds on busy instead of failing immediately
db.pragma('busy_timeout = 5000');

// Balance between durability and performance
db.pragma('synchronous = NORMAL');

export { db };
