# Table Relationships

## Overview

The database uses foreign keys with CASCADE deletes to maintain
referential integrity. All tables are user-scoped via the `user_id`
column.

## Core Tables

### contacts

Primary contact management table with user-scoped access.

**Columns:**

- `id` (TEXT PRIMARY KEY)
- `user_id` (TEXT) - FK to users table
- `name` (TEXT)
- `email` (TEXT)
- `company` (TEXT)
- `position` (TEXT)
- `phone` (TEXT)
- `notes` (TEXT)
- `created_at` (INTEGER)
- `updated_at` (INTEGER)
- `in_network_since` (INTEGER)

**Relationships:**

- One-to-many with `interactions`
- One-to-many with `follow_ups`
- One-to-many with `social_links`
- Many-to-many with `tags` (via `contact_tags`)

### interactions

Communication history linked to contacts.

**Columns:**

- `id` (TEXT PRIMARY KEY)
- `user_id` (TEXT) - FK to users table
- `contact_id` (TEXT) - FK to contacts table
- `type` (TEXT) - e.g., 'email', 'call', 'meeting'
- `notes` (TEXT)
- `created_at` (INTEGER)

**Relationships:**

- Many-to-one with `contacts`

### follow_ups

Scheduled follow-up tasks with completion tracking.

**Columns:**

- `id` (TEXT PRIMARY KEY)
- `user_id` (TEXT) - FK to users table
- `contact_id` (TEXT) - FK to contacts table
- `due_date` (INTEGER)
- `notes` (TEXT)
- `completed` (INTEGER) - Boolean (0/1)
- `created_at` (INTEGER)
- `updated_at` (INTEGER)

**Relationships:**

- Many-to-one with `contacts`

### tags

User-defined tags for organizing contacts.

**Columns:**

- `id` (TEXT PRIMARY KEY)
- `user_id` (TEXT) - FK to users table
- `name` (TEXT)
- `color` (TEXT)
- `created_at` (INTEGER)

**Relationships:**

- Many-to-many with `contacts` (via `contact_tags`)

### contact_tags

Join table for many-to-many contact/tag relationships.

**Columns:**

- `id` (TEXT PRIMARY KEY)
- `contact_id` (TEXT) - FK to contacts table
- `tag_id` (TEXT) - FK to tags table
- `created_at` (INTEGER)

**Relationships:**

- Many-to-one with `contacts`
- Many-to-one with `tags`

### social_links

Social media profiles for contacts.

**Columns:**

- `id` (TEXT PRIMARY KEY)
- `user_id` (TEXT) - FK to users table
- `contact_id` (TEXT) - FK to contacts table
- `platform` (TEXT) - e.g., 'linkedin', 'twitter', 'github'
- `url` (TEXT)
- `username` (TEXT)
- `created_at` (INTEGER)

**Relationships:**

- Many-to-one with `contacts`

## CASCADE Behavior

Deleting a user cascades to all their data:

```
users → contacts → interactions, follow_ups, social_links, contact_tags
users → tags → contact_tags
```

## User-Scoped Queries

All queries must include `user_id` in the WHERE clause for row-level
security:

```typescript
// ✅ Correct
const stmt = db.prepare(
	'SELECT * FROM contacts WHERE id = ? AND user_id = ?',
);
const contact = stmt.get(id, user_id);

// ❌ Wrong - security vulnerability
const stmt = db.prepare('SELECT * FROM contacts WHERE id = ?');
const contact = stmt.get(id);
```

## Common Join Patterns

### Contact with Tags

```typescript
const stmt = db.prepare(`
  SELECT c.*, GROUP_CONCAT(t.name) as tag_names
  FROM contacts c
  LEFT JOIN contact_tags ct ON c.id = ct.contact_id
  LEFT JOIN tags t ON ct.tag_id = t.id
  WHERE c.user_id = ?
  GROUP BY c.id
`);
const contacts = stmt.all(user_id);
```

### Contact with Interaction Count

```typescript
const stmt = db.prepare(`
  SELECT c.*, COUNT(i.id) as interaction_count
  FROM contacts c
  LEFT JOIN interactions i ON c.id = i.contact_id
  WHERE c.user_id = ?
  GROUP BY c.id
`);
const contacts = stmt.all(user_id);
```

### Contact with Pending Follow-ups

```typescript
const stmt = db.prepare(`
  SELECT c.*, COUNT(f.id) as pending_followups
  FROM contacts c
  LEFT JOIN follow_ups f ON c.id = f.contact_id AND f.completed = 0
  WHERE c.user_id = ?
  GROUP BY c.id
`);
const contacts = stmt.all(user_id);
```
