-- Backfill last_contacted_at for all contacts based on their most recent interaction
-- This ensures the "Reconnect Suggestions" widget shows accurate days since last contact

UPDATE contacts
SET last_contacted_at = (
  SELECT MAX(i.created_at)
  FROM interactions i
  WHERE i.contact_id = contacts.id
)
WHERE EXISTS (
  SELECT 1
  FROM interactions i
  WHERE i.contact_id = contacts.id
);
