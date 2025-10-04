import Database from 'better-sqlite3';

const db = new Database('local.db');

// Enable foreign keys
db.pragma('foreign_keys = ON');

export { db };
