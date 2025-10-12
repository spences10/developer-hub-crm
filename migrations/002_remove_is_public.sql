-- Migration: Remove redundant is_public column
-- Created: 2025-10-12
-- Description: Removes the is_public column from user_profiles table as visibility is now the single source of truth
-- Note: Requires SQLite 3.35.0+ (March 2021). If using older SQLite, see manual migration steps below.

-- Remove the redundant is_public column
ALTER TABLE user_profiles DROP COLUMN is_public;

-- Manual migration for SQLite < 3.35.0:
-- If the above fails, uncomment and run the following:
/*
-- 1. Create new table without is_public
CREATE TABLE user_profiles_new (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  github_username TEXT,
  bio TEXT,
  tagline TEXT,
  location TEXT,
  website TEXT,
  visibility TEXT NOT NULL DEFAULT 'public',
  custom_slug TEXT UNIQUE,
  qr_code_url TEXT,
  qr_settings TEXT,
  github_synced_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- 2. Copy data (excluding is_public)
INSERT INTO user_profiles_new
  SELECT id, user_id, username, github_username, bio, tagline, location,
         website, visibility, custom_slug, qr_code_url, qr_settings,
         github_synced_at, created_at, updated_at
  FROM user_profiles;

-- 3. Drop old table
DROP TABLE user_profiles;

-- 4. Rename new table
ALTER TABLE user_profiles_new RENAME TO user_profiles;

-- 5. Recreate indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_custom_slug ON user_profiles(custom_slug);
*/
