# Developer Hub CRM Plan - Connect, Relate, Meet

## Architecture Overview

```mermaid
graph TD
    subgraph "Frontend"
        UI[SvelteKit UI Components]
        Routes[SvelteKit Routes]
        State["State Modules (.svelte.ts)"]
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

## Core Application Focus

The Developer Hub CRM focuses on two key aspects:

1. **Reminding developers to maintain contact with important
   people** - Ensuring you never lose touch with valuable connections
2. **Being easy to update and maintain** - Reducing friction to make
   the application genuinely useful

## Developer-Centric Use Cases

1. **Professional Networking Management**

   - Track contacts from conferences, meetups, and workplaces
   - Categorize by industry, skills, and relationship type
   - Set custom follow-up schedules based on relationship importance

2. **Project and Client Tracking**

   - Manage freelance clients and project statuses
   - Track communication history with clients
   - Set reminders for project milestones and payments

3. **Knowledge and Resource Sharing**

   - Record resources shared with contacts
   - Track mentorship relationships and progress
   - Document learning from interactions

4. **Career and Job Opportunity Management**

   - Track job applications, interviews, and recruiters
   - Store portfolio sharing history
   - Set follow-up reminders for opportunities

5. **Content Creation and Collaboration**
   - Manage collaborators for blogs, podcasts, or open source projects
   - Track audience feedback
   - Set reminders for content collaborations

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

### Phase 2: Developer-Specific Enhancements

- **Enhanced Reminder System**: Status tracking and customizable
  follow-ups
- **Quick Connect Feature**: QR code generation and GitHub profile
  prefilling
- Job and opportunity tracking
- Resource sharing tracking
- Mentorship tracking

### Phase 3: Advanced Features

- Comprehensive VIP features
- Enhanced dashboard with real-time data
- Advanced interaction tracking

### Phase 4: Advanced Networking Features

- Conference mode and event-based organization
- Tech stack visualization
- Contextual search by technology
- Collaboration matching algorithm
- Technical discussion note taking

### Phase 5: Premium Features

- AI-powered features (as a paid tier)
- Advanced analytics
- Integration with additional developer platforms
- Enterprise features

## Next Steps

1. **Enhance Reminder System** (Prioritized):

   - Implement specialized status tracking system for developer
     relationships
   - Create customizable follow-up reminders with timing preferences
   - Add visual status indicators throughout the UI
   - Develop automated status updates based on interaction history
   - Implement dashboard widget showing contacts needing attention
   - Add UI for setting per-contact follow-up frequency and importance
     level
   - Create analytics for relationship health

   > _Why prioritized: The reminder system is the core functionality
   > of any CRM - maintaining relationships over time. It addresses
   > the primary purpose of "ensuring developers never lose touch with
   > valuable connections" and provides immediate value for existing
   > contacts. This feature leverages the existing schema (`status`
   > and `last_contacted` fields) and forms the foundation for other
   > advanced features._

2. **Implement Quick Connect Feature**:

   - Create QR code generation with configurable context (event name,
     location, session)
   - Implement QR code expiration mechanism (default: 24 hours)
   - Build web form with privacy notice and GitHub integration
   - Create token validation and storage system
   - Develop notification for new contacts added through Quick Connect
   - Add automatic context tagging for contacts based on QR code
     configuration

3. **Complete Developer-Focused Features**:

   - Add job tracking functionality for interviews and opportunities
   - Implement resource sharing tracking
   - Create mentorship relationship tracking
   - Add content creation collaboration tracking

4. **Complete Interaction Tracking System**:

   - Add more interaction types (project milestones, interviews, etc.)
   - Implement interaction filtering and search
   - Add interaction analytics and insights
   - Implement custom interaction types

5. **Complete VIP Features**:

   - Add UI for editing background information
   - Add UI for editing contact information
   - Implement comprehensive VIP dashboard
   - Add VIP activation/deactivation with data preservation

6. **Enhance the Dashboard**:

   - Replace mock data with real data
   - Add contact status visualization
   - Add recent interactions display
   - Add VIP quick access
   - Create developer-specific insights widgets

7. **Implement AI Features** (premium feature):
   - Speech-to-text form filling
   - Smart suggestions for follow-ups
   - Confidence scoring for AI suggestions
   - AI-assisted note summarization

## Feature Roadmap

The development of Developer Hub CRM will proceed in phases:

```mermaid
graph TD
    %% Phases
    subgraph Phase1["Phase 1: Foundation"]
        Auth[Authentication System]
        DB[Database Setup]
        UI[Basic UI Framework]
        ContactCRUD[Contact CRUD]
    end

    subgraph Phase2["Phase 2: Developer-Specific Features"]
        Reminder[Enhanced Reminder System]
        QC[Quick Connect Feature]
        JobTrack[Job/Opportunity Tracking]
        Resources[Resource Sharing]
        Mentorship[Mentorship Tracking]
    end

    subgraph Phase3["Phase 3: Advanced Features"]
        VIP[Comprehensive VIP Features]
        Dashboard[Enhanced Dashboard]
        AdvInteraction[Advanced Interaction Tracking]
    end

    subgraph Phase4["Phase 4: Advanced Networking"]
        Conference[Conference Mode]
        TechViz[Tech Stack Visualization]
        ContextSearch[Contextual Tech Search]
        Matching[Collaboration Matching]
    end

    subgraph Phase5["Phase 5: Premium"]
        AI[AI Features]
        Analytics[Advanced Analytics]
        Integration[Platform Integrations]
        Enterprise[Enterprise Features]
    end

    %% Dependencies
    Auth --> ContactCRUD
    DB --> ContactCRUD
    UI --> ContactCRUD

    ContactCRUD --> Reminder
    Reminder --> QC
    ContactCRUD --> QC

    Reminder --> VIP
    QC --> JobTrack
    QC --> Resources

    Reminder --> Dashboard
    VIP --> Dashboard

    Dashboard --> Conference
    AdvInteraction --> TechViz

    Conference --> AI
    Dashboard --> Analytics

    %% Current Focus
    style Reminder fill:#f96,stroke:#333,stroke-width:4px

    %% Completed
    style Auth fill:#9f9,stroke:#333
    style DB fill:#9f9,stroke:#333
    style UI fill:#9f9,stroke:#333
    style ContactCRUD fill:#9f9,stroke:#333

    %% In Progress
    style VIP fill:#ff9,stroke:#333
    style Dashboard fill:#ff9,stroke:#333
```

### Phase 1: Core Functionality (Current)

- Basic contact management
- Interaction tracking
- VIP designation
- User authentication

### Phase 2: Developer-Specific Enhancements

- **Enhanced Reminder System**: Status tracking and customizable
  follow-ups
- **Quick Connect Feature**: QR code generation and GitHub profile
  prefilling
- Job and opportunity tracking
- Resource sharing tracking
- Mentorship tracking

### Phase 3: Advanced Features

- Comprehensive VIP features
- Enhanced dashboard with real-time data
- Advanced interaction tracking

### Phase 4: Advanced Networking Features

- Conference mode and event-based organization
- Tech stack visualization
- Contextual search by technology
- Collaboration matching algorithm
- Technical discussion note taking

### Phase 5: Premium Features

- AI-powered features (as a paid tier)
- Advanced analytics
- Integration with additional developer platforms
- Enterprise features

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

- VIP feature implementation (partial)
- Interaction tracking system (partial)
- Mobile optimization
- Dashboard functionality with real data
- Reminder system implementation (started)

### To Do

- Background information system
- Contact info management
- Offline capabilities
- Progressive enhancement
- Integration tests
- E2E tests with Playwright
