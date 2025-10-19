-- Migration: Add Interaction Types Table
-- Purpose: Store interaction types in database for flexibility and CRUD operations
-- Date: 2025-10-19
-- Description: Creates a table to manage interaction types with system defaults and user-created custom types

-- Interaction types table
CREATE TABLE IF NOT EXISTS interaction_types (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
  UNIQUE(user_id, value)
);

-- Index for performance when fetching types by user
CREATE INDEX IF NOT EXISTS idx_interaction_types_user_id ON interaction_types(user_id);
CREATE INDEX IF NOT EXISTS idx_interaction_types_value ON interaction_types(value);
CREATE INDEX IF NOT EXISTS idx_interaction_types_display_order ON interaction_types(display_order);

-- Seed system interaction types (user_id = NULL means system-wide)
INSERT INTO interaction_types (id, user_id, value, label, icon, color, display_order, created_at, updated_at)
SELECT
  'systype_meeting',
  NULL,
  'meeting',
  'Meeting',
  'Calendar',
  'bg-primary text-primary-content',
  0,
  CAST(strftime('%s', 'now') AS INTEGER) * 1000,
  CAST(strftime('%s', 'now') AS INTEGER) * 1000
WHERE NOT EXISTS (SELECT 1 FROM interaction_types WHERE value = 'meeting' AND user_id IS NULL)
UNION ALL
SELECT
  'systype_call',
  NULL,
  'call',
  'Call',
  'Call',
  'bg-secondary text-secondary-content',
  1,
  CAST(strftime('%s', 'now') AS INTEGER) * 1000,
  CAST(strftime('%s', 'now') AS INTEGER) * 1000
WHERE NOT EXISTS (SELECT 1 FROM interaction_types WHERE value = 'call' AND user_id IS NULL)
UNION ALL
SELECT
  'systype_email',
  NULL,
  'email',
  'Email',
  'Email',
  'bg-accent text-accent-content',
  2,
  CAST(strftime('%s', 'now') AS INTEGER) * 1000,
  CAST(strftime('%s', 'now') AS INTEGER) * 1000
WHERE NOT EXISTS (SELECT 1 FROM interaction_types WHERE value = 'email' AND user_id IS NULL)
UNION ALL
SELECT
  'systype_message',
  NULL,
  'message',
  'Message',
  'Message',
  'bg-info text-info-content',
  3,
  CAST(strftime('%s', 'now') AS INTEGER) * 1000,
  CAST(strftime('%s', 'now') AS INTEGER) * 1000
WHERE NOT EXISTS (SELECT 1 FROM interaction_types WHERE value = 'message' AND user_id IS NULL)
UNION ALL
SELECT
  'systype_coffee',
  NULL,
  'coffee',
  'Coffee',
  'TakeawayCoffee',
  'bg-warning text-warning-content',
  4,
  CAST(strftime('%s', 'now') AS INTEGER) * 1000,
  CAST(strftime('%s', 'now') AS INTEGER) * 1000
WHERE NOT EXISTS (SELECT 1 FROM interaction_types WHERE value = 'coffee' AND user_id IS NULL);
