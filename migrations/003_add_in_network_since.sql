-- Migration: Add In Network Since Field
-- Purpose: Track when a contact actually joined the user's network (separate from record creation date)
-- Date: 2025-10-19
-- Description: Adds in_network_since column to contacts table with backfill from created_at

-- Add in_network_since column to contacts table
-- Note: For new databases, schema.sql already creates this column
-- The migration runner will skip the ALTER TABLE if column exists
ALTER TABLE contacts ADD COLUMN in_network_since INTEGER;

-- Backfill existing contacts: set in_network_since to created_at for all existing records
UPDATE contacts SET in_network_since = created_at WHERE in_network_since IS NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_contacts_in_network_since ON contacts(in_network_since);
