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
   - ✅ Implement base layout and navigation

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
   - ✅ Implement contact CRUD operations (backend)
   - ✅ Develop contact form for creation and editing
   - ✅ Implement contact listing with filtering
   - ⚠️ Fix reactivity issues with Svelte 5 runes
   - ⚠️ Implement proper null checks for user data
   - ❌ Create contact detail view
   - ✅ Add VIP functionality (toggle in UI)
   - ✅ Implement contact search

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

   - ✅ Create overview dashboard
   - ✅ Implement contact status visualization
   - ❌ Add recent interactions display
   - ❌ Develop VIP quick access

3. **Mobile Optimization**
   - ⚠️ Ensure responsive design (partially implemented)
   - ❌ Optimize for touch interfaces
   - ❌ Implement progressive enhancement
   - ❌ Add offline capabilities

### Phase 4: AI-Enhanced Features

1. **Speech-to-Text Form Filling**

   - ❌ Implement speech recognition for form input
   - ❌ Develop AI processing for entity extraction
   - ❌ Create field mapping system for auto-filling forms
   - ❌ Build user interface for recording and previewing
   - ❌ Add confidence indicators and selective application
   - ❌ Implement transcript editing capabilities

   ```mermaid
   graph TD
       subgraph "User Interface"
           Form[Form Component]
           MicButton[Microphone Button]
           TranscriptPreview[Transcript Preview]
           FieldMapping[Field Mapping UI]
       end

       subgraph "Speech Processing"
           SpeechCapture[Speech Capture]
           Transcription[Speech-to-Text Service]
       end

       subgraph "AI Processing"
           NLP[Natural Language Processing]
           EntityExtraction[Entity Extraction]
           FieldMatcher[Field Matcher]
       end

       subgraph "Data Flow"
           FormState[Form State]
           DB[Database]
       end

       MicButton --> SpeechCapture
       SpeechCapture --> Transcription
       Transcription --> TranscriptPreview
       TranscriptPreview --> NLP
       NLP --> EntityExtraction
       EntityExtraction --> FieldMatcher
       FieldMatcher --> FieldMapping
       FieldMapping --> FormState
       FormState --> Form
       Form --> DB
   ```

2. **Smart Suggestions**
   - ❌ Implement AI-powered follow-up suggestions
   - ❌ Create smart templates based on interaction history
   - ❌ Develop personalized reminder scheduling

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
// src/lib/state/contact-store.svelte.ts
class ContactStore {
	contacts = $state([]);
	loading = $state(false);
	error = $state(null);

	async fetchContacts() {
		this.loading = true;
		try {
			const response = await fetch('/api/contacts');
			this.contacts = await response.json();
			this.error = null;
		} catch (err) {
			this.error = err.message;
		} finally {
			this.loading = false;
		}
	}

	// Other methods...
}

export const contactStore = new ContactStore();
```

## Known Issues and Next Steps

### Completed

- ✅ Basic CRUD operations for contacts
- ✅ Authentication system with Lucia
- ✅ Responsive layout with DaisyUI
- ✅ Contact state management with Svelte 5 runes
- ✅ Optimistic UI updates for contacts

### In Progress

- ⚠️ Mobile optimization
- ⚠️ Contact filtering and search
- ⚠️ Contact interactions tracking

### To Do

- ❌ Background information system
- ❌ Contact info management
- ❌ Offline capabilities
- ❌ Progressive enhancement
- ❌ Integration tests
- ❌ E2E tests with Playwright
