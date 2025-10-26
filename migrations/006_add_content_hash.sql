-- Add content_hash columns for incremental embedding updates
-- Only re-embed when content actually changes

-- Add content_hash to contacts table
ALTER TABLE contacts ADD COLUMN content_hash TEXT;

-- Add content_hash to interactions table
ALTER TABLE interactions ADD COLUMN content_hash TEXT;

-- Create indexes for efficient hash lookups
CREATE INDEX IF NOT EXISTS idx_contacts_content_hash ON contacts(content_hash);
CREATE INDEX IF NOT EXISTS idx_interactions_content_hash ON interactions(content_hash);
