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
- `created_at` (TIMESTAMP_MS)
- `updated_at` (TIMESTAMP_MS)

#### Sessions

- `id` (TEXT, PRIMARY KEY)
- `user_id` (TEXT, FOREIGN KEY)
- `expires_at` (TIMESTAMP_MS)

#### Contacts

- `id` (TEXT, PRIMARY KEY)
- `user_id` (TEXT, FOREIGN KEY)
- `name` (TEXT)
- `relationship` (TEXT)
- `birthday` (TIMESTAMP_MS, nullable)
- `industry` (TEXT)
- `location` (TEXT, nullable)
- `vip` (BOOLEAN)
- `last_update` (TIMESTAMP_MS)
- `last_contacted` (TIMESTAMP_MS, nullable)
- `status` (TEXT)
- `created_at` (TIMESTAMP_MS)
- `updated_at` (TIMESTAMP_MS)

#### Interactions

- `id` (TEXT, PRIMARY KEY)
- `contact_id` (TEXT, FOREIGN KEY)
- `type` (TEXT)
- `date` (TIMESTAMP_MS)
- `notes` (TEXT, nullable)
- `transcript_source` (TEXT, nullable) 
- `ai_suggestions` (TEXT, nullable) 
- `confidence` (INTEGER, nullable) 
- `created_at` (TIMESTAMP_MS)
- `updated_at` (TIMESTAMP_MS)

#### Background (VIP Info)

- `id` (TEXT, PRIMARY KEY)
- `contact_id` (TEXT, FOREIGN KEY)
- `family` (TEXT, nullable)
- `company` (TEXT, nullable)
- `likes_dislikes` (TEXT, nullable)
- `misc_notes` (TEXT, nullable)
- `created_at` (TIMESTAMP_MS)
- `updated_at` (TIMESTAMP_MS)

#### Contact Info (VIP Info)

- `id` (TEXT, PRIMARY KEY)
- `contact_id` (TEXT, FOREIGN KEY)
- `main_app` (TEXT, nullable)
- `email` (TEXT, nullable)
- `phone_number` (TEXT, nullable)
- `social_links` (TEXT, nullable) 
- `created_at` (TIMESTAMP_MS)
- `updated_at` (TIMESTAMP_MS)

## Implementation Plan

### Phase 1: Foundation

1. **Project Setup**

   - Initialize SvelteKit project
   - Configure Tailwind v4 and DaisyUI v5
   - Set up Turso database connection
   - Configure Drizzle ORM for database operations
   - Implement base layout and navigation

2. **Authentication System**
   - Implement user registration and login with Lucia
   - Set up session-based authentication
   - Configure Argon2 for secure password hashing
   - Develop session management with cookies
   - Add authentication guards for routes 

### Phase 2: Core Features

1. **Contact Management**

   - Create contact schema with Drizzle ORM
   - Implement contact CRUD operations (backend)
   - Develop contact form for creation and editing
   - Implement contact listing with filtering
   - Fix reactivity issues with Svelte 5 runes
   - Implement proper null checks for user data
   - Create contact detail view
   - Add VIP functionality (toggle in UI)
   - Implement contact search

2. **Interaction Tracking**

   - Define interaction schema with Drizzle ORM
   - Implement interaction CRUD operations
   - Create interaction history view
   - Add interaction filtering
   - Develop notes functionality

3. **VIP Features**
   - Define VIP-related schemas with Drizzle ORM
   - Implement extended profile for VIPs
   - Create background information section
   - Develop contact information section
   - Add VIP dashboard view

### Phase 3: Advanced Features

1. **AI Features**
   - ✅ Update database schema for AI features
   - Implement speech-to-text form filling
   - Add smart suggestions based on interaction history
   - Develop confidence scoring for AI suggestions
   - Create AI-assisted note summarization

2. **Reminder System**

   - Implement follow-up reminders
   - Create status tracking
   - Develop notification system
   - Add email notifications

3. **Dashboard**

   - Create overview dashboard
   - Implement contact status visualization
   - Add recent interactions display
   - Develop VIP quick access

4. **Mobile Optimization**

   - Ensure responsive design 
   - Optimize for touch interfaces
   - Implement progressive enhancement
   - Add offline capabilities

### Phase 4: Polish & Performance

1. **Performance Optimization**

   - Implement lazy loading for large lists
   - Add caching for frequently accessed data
   - Optimize database queries
   - Add client-side state management

2. **UI/UX Improvements**

   - Add loading states and transitions
   - Implement error boundaries
   - Add form validation feedback
   - Improve accessibility

3. **Testing & Documentation**

   - Write unit tests for core functionality
   - Add end-to-end tests with Playwright
   - Document API endpoints
   - Create user documentation

### Current Status

#### Completed
- Project setup and configuration
- Basic authentication system
- Contact management core features
- Database schema updates for AI features
- Basic dashboard implementation

#### In Progress
- Mobile optimization
- Authentication guards
- Reactivity with Svelte 5 runes

#### Next Steps
1. Begin implementing AI features:
   - Speech-to-text integration
   - Smart suggestions system
   - Confidence scoring
2. Complete interaction tracking system
3. Develop VIP features
4. Implement reminder system

## Folder Structure

```
/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── ui/            
│   │   │   ├── contacts/      
│   │   │   ├── interactions/  
│   │   │   └── dashboard/     
│   │   ├── server/
│   │   │   ├── db/
│   │   │   │   ├── schema.ts  
│   │   │   │   ├── index.ts   
│   │   │   │   └── migrations/
│   │   │   ├── auth.ts        
│   │   │   └── api/           
│   │   ├── state/             
│   │   ├── types/             
│   │   └── utils/             
│   ├── routes/
│   │   ├── api/               
│   │   ├── auth/              
│   │   ├── contacts/          
│   │   ├── interactions/      
│   │   └── dashboard/         
│   ├── app.html               
│   └── app.css                
├── static/                    
├── migrations/                
├── tests/                     
└── scripts/                   
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
	return client.execute(sql, params);
}
```

### Authentication

Using Lucia for authentication:

```typescript
// src/lib/server/auth.ts
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';
import { turso } from '@lucia-auth/adapter-turso';
import { client } from '$lib/server/db';

export const auth = lucia({
	adapter: turso(client, {
		user: 'user',
		session: 'session',
	}),
	env: import.meta.env.DEV ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	getUserAttributes: (data) => {
		return {
			username: data.username,
		};
	},
});

export type Auth = typeof auth;
```

### State Management

Using Svelte 5 runes for reactive state:

```typescript
// src/lib/state/contacts.svelte.ts
class ContactState {
	contacts = $state.raw([]);
	loading = $state(false);
	error = $state<string | null>(null);
}

export const contactState = new ContactState();
```

## Known Issues and Next Steps

### Completed

- Basic CRUD operations for contacts
- Authentication system with Lucia
- Responsive layout with DaisyUI
- Contact state management with Svelte 5 runes
- Optimistic UI updates for contacts

### In Progress

- Mobile optimization
- Authentication guards
- Reactivity with Svelte 5 runes

### To Do

- Background information system
- Contact info management
- Offline capabilities
- Progressive enhancement
- Integration tests
- E2E tests with Playwright
