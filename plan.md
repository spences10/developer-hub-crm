# Developer Hub CRM Plan

## Architecture Overview

```mermaid
graph TD
    subgraph "Frontend"
        UI[SvelteKit UI Components]
        Routes[SvelteKit Routes]
        State[State Modules (.svelte.ts)]
        Auth[Auth Client]
    end

    subgraph "Backend"
        API[SvelteKit API Routes]
        AuthServer[Lucia Auth]
        DB[Drizzle ORM]
    end

    subgraph "Database"
        Turso[(Turso Database)]
    end

    UI --> Routes
    Routes --> State
    Routes --> API
    API --> AuthServer
    API --> DB
    DB --> Turso
    Auth --> AuthServer
```

## Key Components

1. **Database Layer**

   - Turso for distributed SQLite database
   - Drizzle ORM for type-safe database operations
   - Schema management with Drizzle migrations
   - Efficient query building with Drizzle's fluent API

2. **Authentication System**

   - Lucia authentication library
   - Argon2 for secure password hashing
   - Session-based authentication with cookies
   - CSRF protection
   - Role-based access control

3. **Frontend Architecture**

   - SvelteKit with Svelte 5 runes
   - Modern state management with class-based .svelte.ts files
   - Tailwind v4 for styling (CSS-first approach)
   - DaisyUI v5 for UI components
   - Responsive design for mobile and desktop
   - Dark/light mode support

4. **API Layer**
   - SvelteKit form actions for secure server operations
   - Type-safe request/response handling
   - Error handling and validation
   - Rate limiting

## Data Model

### Core Entities

#### Users

- `id` (TEXT, PRIMARY KEY)
- `username` (TEXT, UNIQUE)
- `password_hash` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### Sessions

- `id` (TEXT, PRIMARY KEY)
- `user_id` (TEXT, FOREIGN KEY)
- `expires_at` (TIMESTAMP)

#### Contacts

- `id` (TEXT, PRIMARY KEY)
- `user_id` (TEXT, FOREIGN KEY)
- `name` (TEXT)
- `relationship` (TEXT)
- `birthday` (DATE, nullable)
- `industry` (TEXT)
- `location` (TEXT, nullable)
- `vip` (BOOLEAN)
- `last_update` (TIMESTAMP)
- `last_contacted` (DATE, nullable)
- `status` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### Interactions

- `id` (TEXT, PRIMARY KEY)
- `contact_id` (TEXT, FOREIGN KEY)
- `type` (TEXT)
- `date` (DATE)
- `notes` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### Background (for VIPs)

- `id` (TEXT, PRIMARY KEY)
- `contact_id` (TEXT, FOREIGN KEY)
- `family` (TEXT, nullable)
- `company` (TEXT, nullable)
- `likes_dislikes` (TEXT, nullable)
- `misc_notes` (TEXT, nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### ContactInfo (for VIPs)

- `id` (TEXT, PRIMARY KEY)
- `contact_id` (TEXT, FOREIGN KEY)
- `main_app` (TEXT, nullable)
- `email` (TEXT, nullable)
- `phone_number` (TEXT, nullable)
- `social_links` (TEXT, nullable) // JSON stored as TEXT
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Implementation Plan

### Phase 1: Foundation

1. **Project Setup**

   - ✅ Initialize SvelteKit project
   - ✅ Configure Tailwind v4 and DaisyUI v5
   - ✅ Set up Turso database connection
   - ✅ Configure Drizzle ORM for database operations
   - ❌ Implement base layout and navigation

2. **Authentication System**
   - ✅ Implement user registration and login with Lucia
   - ✅ Set up session-based authentication
   - ✅ Configure Argon2 for secure password hashing
   - ✅ Develop session management with cookies
   - ⚠️ Add authentication guards for routes (implemented for demo
     only)

### Phase 2: Core Features

1. **Contact Management**

   - ✅ Create contact schema with Drizzle ORM
   - ❌ Implement contact CRUD operations
   - ❌ Develop contact listing with filtering and sorting
   - ❌ Create contact detail view
   - ❌ Add VIP functionality
   - ❌ Implement contact search

2. **Interaction Tracking**

   - ✅ Define interaction schema with Drizzle ORM
   - ❌ Implement interaction CRUD operations
   - ❌ Create interaction history view
   - ❌ Add interaction filtering
   - ❌ Develop notes functionality

3. **VIP Features**
   - ✅ Define VIP-related schemas with Drizzle ORM
   - ❌ Implement extended profile for VIPs
   - ❌ Create background information section
   - ❌ Develop contact information section
   - ❌ Add VIP dashboard view

### Phase 3: Advanced Features

1. **Reminder System**

   - ❌ Implement follow-up reminders
   - ❌ Create status tracking
   - ❌ Develop notification system
   - ❌ Add email notifications

2. **Dashboard**

   - ❌ Create overview dashboard
   - ❌ Implement contact status visualization
   - ❌ Add recent interactions display
   - ❌ Develop VIP quick access

3. **Mobile Optimization**
   - ❌ Ensure responsive design
   - ❌ Optimize for touch interfaces
   - ❌ Implement progressive enhancement
   - ❌ Add offline capabilities

## Folder Structure

```
/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── ui/            # Reusable UI components
│   │   │   ├── contacts/      # Contact-related components
│   │   │   ├── interactions/  # Interaction-related components
│   │   │   └── dashboard/     # Dashboard components
│   │   ├── server/
│   │   │   ├── db/
│   │   │   │   ├── schema.ts  # Drizzle schema definitions
│   │   │   │   ├── index.ts   # Database connection
│   │   │   │   └── migrations/# Drizzle migrations
│   │   │   ├── auth.ts        # Lucia authentication
│   │   │   └── api/           # API utilities
│   │   ├── state/             # .svelte.ts state modules
│   │   ├── types/             # TypeScript type definitions
│   │   └── utils/             # Utility functions
│   ├── routes/
│   │   ├── api/               # API endpoints
│   │   ├── auth/              # Auth routes (login, register)
│   │   ├── contacts/          # Contact management routes
│   │   ├── interactions/      # Interaction management routes
│   │   └── dashboard/         # Dashboard routes
│   ├── app.html               # HTML template
│   └── app.css                # Global styles
├── static/                    # Static assets
├── migrations/                # Database migrations
├── tests/                     # Test files
└── scripts/                   # Utility scripts
```

## Technical Approach

### Database Access

Using Drizzle ORM for type-safe database operations:

```typescript
// src/lib/server/db/index.ts
import { createClient } from 'drizzle-orm';

const client = createClient({
	url: process.env.DATABASE_URL || 'file:local.db',
});

export async function query<T>(
	sql: string,
	params: Record<string, any> = {},
): Promise<T[]> {
	const result = await client.execute({ sql, args: params });
	return result.rows as T[];
}

export async function queryOne<T>(
	sql: string,
	params: Record<string, any> = {},
): Promise<T | null> {
	const results = await query<T>(sql, params);
	return results[0] || null;
}

export async function execute(
	sql: string,
	params: Record<string, any> = {},
): Promise<{ rowsAffected: number }> {
	const result = await client.execute({ sql, args: params });
	return { rowsAffected: result.rowsAffected };
}

export async function transaction<T>(
	callback: (tx: typeof client) => Promise<T>,
): Promise<T> {
	return client.transaction(callback);
}
```

### Authentication

Implementing Lucia authentication library:

```typescript
// src/lib/server/auth/lucia.ts
import { createAuth } from 'lucia-auth';

const auth = createAuth({
	// Lucia auth configuration
});

export async function createSession(user: any) {
	return auth.createSession(user);
}

export async function verifySession(session: any) {
	return auth.verifySession(session);
}
```

### Frontend Components and State Management

Using Svelte 5 runes for component-level state management:

```svelte
<!-- src/lib/components/contacts/ContactList.svelte -->
<script>
  let { contacts } = $props();
  let searchTerm = $state('');
  
  $derived filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
</script>

<div class="search-container">
	<input
		type="text"
		placeholder="Search contacts..."
		bind:value={searchTerm}
	/>
</div>

<div class="contacts-grid">
	{#each filteredContacts as contact}
		<ContactCard {contact} />
	{/each}
</div>
```

Using .svelte.ts files for global state management:

```typescript
// src/lib/state/contacts.svelte.ts
export const contacts = $state({
	items: [],
	loading: false,
	error: null,
});

// Functions to manipulate state
export function addContact(contact) {
	contacts.items = [...contacts.items, contact];
}

export function removeContact(id) {
	contacts.items = contacts.items.filter(
		(contact) => contact.id !== id,
	);
}

export function setLoading(isLoading) {
	contacts.loading = isLoading;
}

export function setError(error) {
	contacts.error = error;
}
```

## Best Practices

1. **State Management**

   - Use `.svelte.ts` files for global state
   - Be cautious with global state in isomorphic applications
     (server/client)
   - Consider using Svelte Kit's context system for server-rendered
     state
   - Keep state modules focused on specific domains (contacts,
     interactions, etc.)
   - Provide clear functions for state manipulation rather than direct
     access

2. **Security**

   - Implement proper authentication and authorization
   - Use prepared statements for all SQL queries
   - Apply CSRF protection for forms
   - Validate all user inputs
   - Implement rate limiting for API endpoints

3. **Performance**

   - Use efficient SQL queries with proper indexing
   - Implement caching where appropriate
   - Optimize bundle size with code splitting
   - Use lazy loading for routes
   - Implement proper database connection pooling

4. **Code Quality**

   - Follow TypeScript best practices
   - Implement comprehensive error handling
   - Write unit and integration tests
   - Use consistent code formatting
   - Document code with JSDoc comments

5. **User Experience**
   - Implement responsive design for all screen sizes
   - Add loading states for asynchronous operations
   - Provide clear error messages
   - Implement form validation with helpful feedback
   - Support keyboard navigation

## Deployment Strategy

1. **Development Environment**

   - Local development with SQLite
   - Hot module reloading
   - Development-specific environment variables

2. **Staging Environment**

   - Deployed to Vercel/Netlify preview
   - Connected to Turso staging database
   - Automated deployments from staging branch

3. **Production Environment**
   - Deployed to Vercel/Netlify production
   - Connected to Turso production database
   - Automated deployments from main branch
   - Monitoring and error tracking

## Migration Considerations

If you decide to switch from Turso to PocketBase in the future:

1. Create data migration scripts
2. Adapt authentication system to use PocketBase
3. Update API endpoints to use PocketBase SDK
4. Modify frontend to work with PocketBase response format

## Next Steps

1. Implement contact CRUD operations
2. Develop contact listing with filtering and sorting
3. Create contact detail view
4. Add VIP functionality
5. Implement contact search
