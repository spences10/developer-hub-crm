# Query Examples

## Joins with Related Data

### Contact with Interaction Count

```typescript
import { db } from '$lib/server/db';

const stmt = db.prepare(`
  SELECT c.*, COUNT(i.id) as interaction_count
  FROM contacts c
  LEFT JOIN interactions i ON c.id = i.contact_id
  WHERE c.user_id = ?
  GROUP BY c.id
`);
const contacts = stmt.all(user_id);
```

### Contact with Tags

```typescript
const stmt = db.prepare(`
  SELECT
    c.*,
    GROUP_CONCAT(t.name, ', ') as tag_names,
    GROUP_CONCAT(t.id) as tag_ids
  FROM contacts c
  LEFT JOIN contact_tags ct ON c.id = ct.contact_id
  LEFT JOIN tags t ON ct.tag_id = t.id
  WHERE c.user_id = ?
  GROUP BY c.id
`);
const contacts = stmt.all(user_id);
```

### Contact with All Related Data

```typescript
const stmt = db.prepare(`
  SELECT
    c.*,
    COUNT(DISTINCT i.id) as interaction_count,
    COUNT(DISTINCT f.id) as pending_followups,
    COUNT(DISTINCT s.id) as social_link_count,
    GROUP_CONCAT(DISTINCT t.name, ', ') as tag_names
  FROM contacts c
  LEFT JOIN interactions i ON c.id = i.contact_id
  LEFT JOIN follow_ups f ON c.id = f.contact_id AND f.completed = 0
  LEFT JOIN social_links s ON c.id = s.contact_id
  LEFT JOIN contact_tags ct ON c.id = ct.contact_id
  LEFT JOIN tags t ON ct.tag_id = t.id
  WHERE c.user_id = ?
  GROUP BY c.id
`);
const contacts = stmt.all(user_id);
```

### Recent Interactions with Contact Details

```typescript
const stmt = db.prepare(`
  SELECT i.*, c.name as contact_name, c.email as contact_email
  FROM interactions i
  JOIN contacts c ON i.contact_id = c.id
  WHERE i.user_id = ?
  ORDER BY i.created_at DESC
  LIMIT ?
`);
const recent_interactions = stmt.all(user_id, limit);
```

## Transactions for Multi-Table Operations

### Insert Contact with Tags

```typescript
import { db } from '$lib/server/db';
import { nanoid } from 'nanoid';

const insert_contact_with_tags = db.transaction(
	(contact_data, tag_ids) => {
		// Insert contact
		const contact_stmt = db.prepare(`
    INSERT INTO contacts (id, user_id, name, email, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
		const contact_id = nanoid();
		const now = Date.now();
		contact_stmt.run(
			contact_id,
			user_id,
			contact_data.name,
			contact_data.email,
			now,
			now,
		);

		// Insert tags
		const tag_stmt = db.prepare(`
    INSERT INTO contact_tags (id, contact_id, tag_id, created_at)
    VALUES (?, ?, ?, ?)
  `);
		for (const tag_id of tag_ids) {
			tag_stmt.run(nanoid(), contact_id, tag_id, now);
		}

		return contact_id;
	},
);

// Execute transaction
const contact_id = insert_contact_with_tags(
	{ name: 'John Doe', email: 'john@example.com' },
	['tag_id_1', 'tag_id_2'],
);
```

### Update Contact and Add Interaction

```typescript
const update_contact_and_add_interaction = db.transaction(
	(contact_id, contact_updates, interaction_data) => {
		const now = Date.now();

		// Update contact
		const update_stmt = db.prepare(`
    UPDATE contacts
    SET name = ?, email = ?, updated_at = ?
    WHERE id = ? AND user_id = ?
  `);
		update_stmt.run(
			contact_updates.name,
			contact_updates.email,
			now,
			contact_id,
			user_id,
		);

		// Add interaction
		const interaction_stmt = db.prepare(`
    INSERT INTO interactions (id, user_id, contact_id, type, notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
		interaction_stmt.run(
			nanoid(),
			user_id,
			contact_id,
			interaction_data.type,
			interaction_data.notes,
			now,
		);

		return { contact_id, interaction_id: nanoid() };
	},
);

// Execute
const result = update_contact_and_add_interaction(
	'contact_123',
	{ name: 'John Doe', email: 'john@example.com' },
	{ type: 'email', notes: 'Sent proposal' },
);
```

### Bulk Insert Contacts

```typescript
const bulk_insert_contacts = db.transaction((contacts_data) => {
	const stmt = db.prepare(`
    INSERT INTO contacts (id, user_id, name, email, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

	const now = Date.now();
	const inserted_ids = [];

	for (const contact of contacts_data) {
		const id = nanoid();
		stmt.run(id, user_id, contact.name, contact.email, now, now);
		inserted_ids.push(id);
	}

	return inserted_ids;
});

// Execute
const ids = bulk_insert_contacts([
	{ name: 'Alice', email: 'alice@example.com' },
	{ name: 'Bob', email: 'bob@example.com' },
	{ name: 'Charlie', email: 'charlie@example.com' },
]);
```

## Reactive Updates with SvelteKit

### Trigger Revalidation After Mutations

```typescript
import { invalidate } from '$app/navigation';

// After INSERT/UPDATE/DELETE
stmt.run(/* ... */);
invalidate('app:contacts'); // Triggers reload of contacts data
```

### Multiple Dependencies

```typescript
// After updating a contact
const stmt = db.prepare(
	'UPDATE contacts SET name = ? WHERE id = ? AND user_id = ?',
);
stmt.run(name, id, user_id);

// Invalidate multiple dependencies
invalidate('app:contacts');
invalidate('app:interactions');
invalidate('app:dashboard');
```

### In Remote Functions

```typescript
import { command } from '$app/server';
import { db } from '$lib/server/db';
import * as v from 'valibot';

export const update_contact = command(
	v.object({
		id: v.string(),
		name: v.string(),
	}),
	async ({ id, name }) => {
		const stmt = db.prepare(
			'UPDATE contacts SET name = ?, updated_at = ? WHERE id = ? AND user_id = ?',
		);
		stmt.run(name, Date.now(), id, user_id);

		// Return invalidation hints
		return {
			success: true,
			invalidate: ['app:contacts'],
		};
	},
);
```

## Pagination

### Limit and Offset

```typescript
const page = 1;
const per_page = 20;
const offset = (page - 1) * per_page;

const stmt = db.prepare(`
  SELECT * FROM contacts
  WHERE user_id = ?
  ORDER BY created_at DESC
  LIMIT ? OFFSET ?
`);
const contacts = stmt.all(user_id, per_page, offset);

// Get total count
const count_stmt = db.prepare(
	'SELECT COUNT(*) as total FROM contacts WHERE user_id = ?',
);
const { total } = count_stmt.get(user_id);
```

### Cursor-Based Pagination

```typescript
const cursor = '2024-01-01T00:00:00.000Z'; // Last item's created_at
const limit = 20;

const stmt = db.prepare(`
  SELECT * FROM contacts
  WHERE user_id = ? AND created_at < ?
  ORDER BY created_at DESC
  LIMIT ?
`);
const contacts = stmt.all(user_id, Date.parse(cursor), limit);
```

## Search and Filtering

### Full-Text Search

```typescript
const search_term = '%john%';

const stmt = db.prepare(`
  SELECT * FROM contacts
  WHERE user_id = ?
    AND (
      name LIKE ? OR
      email LIKE ? OR
      company LIKE ? OR
      notes LIKE ?
    )
  ORDER BY name
`);
const results = stmt.all(
	user_id,
	search_term,
	search_term,
	search_term,
	search_term,
);
```

### Filter by Tags

```typescript
const tag_ids = ['tag1', 'tag2'];

const placeholders = tag_ids.map(() => '?').join(',');
const stmt = db.prepare(`
  SELECT DISTINCT c.*
  FROM contacts c
  JOIN contact_tags ct ON c.id = ct.contact_id
  WHERE c.user_id = ?
    AND ct.tag_id IN (${placeholders})
`);
const contacts = stmt.all(user_id, ...tag_ids);
```

### Filter by Date Range

```typescript
const start_date = Date.parse('2024-01-01');
const end_date = Date.parse('2024-12-31');

const stmt = db.prepare(`
  SELECT * FROM interactions
  WHERE user_id = ?
    AND created_at >= ?
    AND created_at <= ?
  ORDER BY created_at DESC
`);
const interactions = stmt.all(user_id, start_date, end_date);
```

## Aggregations

### Contact Statistics

```typescript
const stmt = db.prepare(`
  SELECT
    COUNT(*) as total_contacts,
    COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as with_email,
    COUNT(CASE WHEN company IS NOT NULL THEN 1 END) as with_company
  FROM contacts
  WHERE user_id = ?
`);
const stats = stmt.get(user_id);
```

### Interaction Trends

```typescript
const stmt = db.prepare(`
  SELECT
    type,
    COUNT(*) as count,
    DATE(created_at / 1000, 'unixepoch') as date
  FROM interactions
  WHERE user_id = ?
    AND created_at >= ?
  GROUP BY type, date
  ORDER BY date DESC
`);
const trends = stmt.all(
	user_id,
	Date.now() - 30 * 24 * 60 * 60 * 1000,
); // Last 30 days
```

### Top Contacts by Interaction

```typescript
const stmt = db.prepare(`
  SELECT
    c.id,
    c.name,
    c.email,
    COUNT(i.id) as interaction_count,
    MAX(i.created_at) as last_interaction
  FROM contacts c
  LEFT JOIN interactions i ON c.id = i.contact_id
  WHERE c.user_id = ?
  GROUP BY c.id
  ORDER BY interaction_count DESC
  LIMIT ?
`);
const top_contacts = stmt.all(user_id, 10);
```
