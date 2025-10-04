import Database from 'better-sqlite3';

const db = new Database('local.db');

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Wait up to 5 seconds on busy instead of failing immediately
db.pragma('busy_timeout = 5000');

// Balance between durability and performance
db.pragma('synchronous = NORMAL');

export { db };
