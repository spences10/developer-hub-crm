# Advanced Query Patterns

## JOINs

```typescript
const stmt = db.prepare(`
  SELECT 
    c.*,
    COUNT(i.id) as interaction_count,
    MAX(i.created_at) as last_interaction_at
  FROM contacts c
  LEFT JOIN interactions i ON i.contact_id = c.id
  WHERE c.user_id = ?
  GROUP BY c.id
  ORDER BY c.name
`);
const contacts = stmt.all(user_id);
```

## Transactions

Wrap multiple operations that must succeed/fail together:

```typescript
const insert_with_tags = db.transaction((data) => {
	const id = nanoid();
	const now = Date.now();

	// Insert contact
	db.prepare(
		`
    INSERT INTO contacts (id, user_id, name, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `,
	).run(id, data.user_id, data.name, now, now);

	// Insert tags
	if (data.tag_ids) {
		const insert_tag = db.prepare(`
      INSERT INTO contact_tags (id, contact_id, tag_id, created_at)
      VALUES (?, ?, ?, ?)
    `);
		for (const tag_id of data.tag_ids) {
			insert_tag.run(nanoid(), id, tag_id, now);
		}
	}

	return id;
});

// Use
const contact_id = insert_with_tags({
	user_id,
	name: 'John',
	tag_ids: ['tag1'],
});
```

## Search with LIKE

```typescript
const stmt = db.prepare(`
  SELECT * FROM contacts 
  WHERE user_id = ? 
  AND (name LIKE ? OR email LIKE ? OR company LIKE ?)
  ORDER BY name
`);
const search_term = `%${query}%`;
const contacts = stmt.all(
	user_id,
	search_term,
	search_term,
	search_term,
);
```

## Pagination

```typescript
const stmt = db.prepare(`
  SELECT * FROM contacts 
  WHERE user_id = ? 
  ORDER BY name
  LIMIT ? OFFSET ?
`);
const per_page = 20;
const offset = (page - 1) * per_page;
const contacts = stmt.all(user_id, per_page, offset);
```

## Count Queries

```typescript
const stmt = db.prepare(
	'SELECT COUNT(*) as count FROM contacts WHERE user_id = ?',
);
const result = stmt.get(user_id) as { count: number };
const total = result.count;
```

## Aggregation

```typescript
const stmt = db.prepare(`
  SELECT 
    type,
    COUNT(*) as count,
    MAX(created_at) as latest
  FROM interactions
  WHERE contact_id IN (SELECT id FROM contacts WHERE user_id = ?)
  GROUP BY type
  ORDER BY count DESC
`);
const stats = stmt.all(user_id);
```

## Date Ranges

```typescript
const seven_days_ago = Date.now() - 7 * 24 * 60 * 60 * 1000;
const stmt = db.prepare(`
  SELECT * FROM interactions 
  WHERE created_at > ? 
  ORDER BY created_at DESC
`);
const recent = stmt.all(seven_days_ago);
```

## Nullable Fields

Use `null` for empty optional fields:

```typescript
stmt.run(
	id,
	user_id,
	data.name,
	data.email || null,
	data.phone || null,
	now,
	now,
);
```

## Schema Location

- Schema: `schema.sql` (root)
- Migrations: `migrations/` directory
- Database instance: `lib/server/db.ts`
- Types: `lib/types/db.ts`
