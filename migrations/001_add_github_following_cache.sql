-- Migration: Add GitHub following cache table
-- Purpose: Cache GitHub profiles for 24 hours to reduce API calls and improve performance
-- Date: 2025-10-14

-- GitHub following cache table (cache GitHub profiles for 24h)
CREATE TABLE IF NOT EXISTS github_following_cache (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  profile_data TEXT NOT NULL,
  cached_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_github_following_cache_user_id ON github_following_cache(user_id);
CREATE INDEX IF NOT EXISTS idx_github_following_cache_cached_at ON github_following_cache(cached_at);
