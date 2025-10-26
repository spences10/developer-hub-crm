-- Add vector embeddings and dashboard insights cache
-- sqlite-vec extension required (loaded in db.ts)

-- Contact embeddings virtual table
-- Stores embeddings of contact information (name, company, title, notes)
CREATE VIRTUAL TABLE IF NOT EXISTS contact_embeddings USING vec0(
  contact_id TEXT PRIMARY KEY,
  embedding FLOAT[1024]
);

-- Interaction embeddings virtual table
-- Stores embeddings of interaction content (type, contact name, note)
CREATE VIRTUAL TABLE IF NOT EXISTS interaction_embeddings USING vec0(
  interaction_id TEXT PRIMARY KEY,
  embedding FLOAT[1024]
);

-- Pre-computed dashboard insights cache
-- Stores expensive vector calculations for fast dashboard loading
CREATE TABLE IF NOT EXISTS dashboard_insights (
  user_id TEXT PRIMARY KEY,
  network_topics TEXT, -- JSON: [{topic, count, contact_ids, sample_keywords}]
  reconnect_suggestions TEXT, -- JSON: [{contact_id, contact_name, days_since_contact, reason, similarity_score}]
  last_updated INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Index for efficient dashboard queries
CREATE INDEX IF NOT EXISTS idx_dashboard_insights_last_updated
ON dashboard_insights(last_updated);
