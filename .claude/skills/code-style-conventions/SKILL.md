---
name: Code Style & Naming Conventions
description:
  Follow project naming conventions and code style rules. Use when
  writing code, creating files, defining functions/variables, or
  refactoring. Critical! kebab-case for files, snake_case for
  functions/variables, PascalCase for types, lang="ts" for Svelte.
---

# Code Style & Naming Conventions

## File Naming

**Rule: `kebab-case` for ALL files**

```
✅ contact-details-card.svelte
✅ get-user-preferences.ts
✅ date-helpers.ts
✅ contact-stats-cards.svelte
✅ interaction-item.svelte

❌ ContactDetailsCard.svelte
❌ get_user_preferences.ts
❌ dateHelpers.ts
```

## Function & Variable Names

**Rule: `snake_case` for functions and variables**

```typescript
✅ const user_id = 'abc123';
✅ function get_current_user_id() { }
✅ const is_overdue = check_date(due_date);
✅ let selected_items = $state([]);
✅ const formatted_date = format_date(date);

❌ const userId = 'abc123';
❌ function getCurrentUserId() { }
❌ const isOverdue = checkDate(dueDate);
❌ let selectedItems = $state([]);
```

## Type Names

**Rule: `PascalCase` for types and interfaces**

```typescript
✅ interface Props { }
✅ interface Contact { }
✅ type DateFormat = 'YYYY-MM-DD' | 'MM/DD/YYYY';
✅ interface StatCard { }

❌ interface props { }
❌ interface contact { }
❌ type dateFormat = ...
```

## Svelte Components

**Rule: Always `lang="ts"` on script tags**

```svelte
✅ <script lang="ts">
  interface Props {
    title: string;
    onclick?: () => void;
  }
  let { title, onclick }: Props = $props();
</script>

❌ <script>
  export let title;
</script>
```

## Remote Functions

**Rule: `*.remote.ts` for server-side logic**

```
src/routes/
├── (app)/
│   ├── contacts/
│   │   ├── contacts.remote.ts    ✅
│   │   └── +page.svelte
│   └── interactions/
│       ├── interactions.remote.ts ✅
│       └── +page.svelte
```

## Constants

**Rule: `UPPER_SNAKE_CASE` for constants**

```typescript
✅ const MAX_RETRIES = 3;
✅ const DEFAULT_TIMEOUT = 5000;
✅ const API_BASE_URL = 'https://api.example.com';

❌ const maxRetries = 3;
❌ const default_timeout = 5000;
```

## Database Naming

**Rule: `snake_case` for table and column names**

```sql
✅ CREATE TABLE user_profiles (
  user_id INTEGER,
  email_address TEXT,
  created_at TIMESTAMP
);

❌ CREATE TABLE userProfiles (
  userId INTEGER,
  emailAddress TEXT,
  created_at TIMESTAMP
);
```

## Quick Reference

| Type             | Convention         | Example               |
| ---------------- | ------------------ | --------------------- |
| Files            | `kebab-case`       | `contact-card.svelte` |
| Functions        | `snake_case`       | `get_contacts()`      |
| Variables        | `snake_case`       | `user_id`             |
| Types/Interfaces | `PascalCase`       | `interface Props`     |
| Constants        | `UPPER_SNAKE_CASE` | `MAX_ITEMS = 100`     |
| DB Tables        | `snake_case`       | `user_profiles`       |
| DB Columns       | `snake_case`       | `created_at`          |

For more context, see [PROJECT_RULES.md](PROJECT_RULES.md).
