# Developer Hub CRM - Connect, Relate, Meet

A modern CRM built with SvelteKit, Turso, and Drizzle ORM,
specifically designed for developers to manage professional
relationships and networking.

## How is CRM Relevant to a Developer?

1. **Networking**: As a developer, you interact with numerous people –
   colleagues, potential employers, freelancers, or clients. This CRM
   helps keep track of these contacts, ensuring you never lose touch.

2. **Project Tracking**: If you're freelancing or running a software
   business, use this CRM to manage leads and clients, track project
   statuses, and payment schedules.

3. **Knowledge Sharing**: Track whom you've shared particular
   resources or information with, ensuring you never repeat or forget
   to share essential materials.

4. **Mentorship & Learning**: Track mentees, their progress, and
   topics covered. If you attend workshops or courses, note down who
   you met and follow-up actions.

5. **Job Opportunities**: Use the CRM to track job offers, interviews,
   and related interactions.

6. **Personal Branding & Content**: Manage your audience,
   collaborations, and feedback for blogs, podcasts, or any content
   creation.

7. **Reminders**: Get notifications for follow-ups, sending
   portfolios, checking in on old clients, or catching up with
   developer friends.

## Features

- 👤 Contact Management with VIP Support
- 🤝 Interaction Tracking (meetings, calls, emails, messages)
- 🗓️ Important Dates (birthdays, last contacted)
- 🎯 Smart Follow-ups with Customizable Timing
- 💼 Industry and Relationship Categorization
- 🌟 VIP Contact Information with Detailed Profiles
- 🧠 AI-Powered Suggestions and Notes (Premium Feature)
- 📱 Responsive Design for Desktop and Mobile
- 🌓 Dark/Light Mode

## Unique Developer Networking Features

- **🔗 Quick Connect**: Share a QR code that leads contacts to a
  simple form where they can enter their GitHub username to instantly
  connect and pre-populate their profile data
  - Configurable context tags for events, conferences, and sessions
  - GitHub profile integration for developer-specific information
  - No account creation required for new contacts
  - Secure, expiring QR codes for networking events

## Feature Roadmap

### Phase 1: Core Functionality (Current)

- Contact management
- Interaction tracking
- VIP features
- Basic dashboard

### Phase 2: Developer-Specific Enhancements

- GitHub integration for profile data prefilling
- Tech stack tracking for contacts
- Enhanced interaction categorization for developer contexts

### Phase 3: Advanced Networking Features

- **🏷️ Conference Mode**: Tag and organize contacts by events and
  sessions
- **📊 Tech Stack Visualization**: See what technologies your contacts
  work with
- **🤓 Contextual Search**: Find contacts by technology, not just by
  name
- **🔄 Matching Algorithm**: Discover collaboration opportunities
  based on skills and interests
- **📝 Technical Discussion Notes**: Record code snippets and
  technical conversations with context

### Phase 4: Premium Features

- AI-powered suggestions and insights
- Advanced analytics
- Integration with additional developer platforms

## Data Model

The application focuses on two main things:

1. Reminding users to maintain contact with important people
2. Being easy to update and maintain

### Primary Entities:

- **Contacts**: Core contact information with VIP designation option
- **Interactions**: Track all meetings, calls, and communications
- **VIP Information**: Extended data for your most important contacts
- **Status Tracking**: Know when it's time to reconnect with contacts

## Tech Stack

- **Frontend**: SvelteKit + Svelte 5 + Tailwind CSS + daisyUI
- **Database**: Turso (Distributed SQLite)
- **ORM**: Drizzle ORM
- **Auth**: Lucia Auth
- **Styling**: Tailwind v4 + daisyUI v5

## Development Setup

1. **Clone and Install**

```bash
git clone https://github.com/spences10/developer-hub-crm.git
cd developer-hub-crm
pnpm install
```

2. **Environment Setup**

Create a `.env` file in the root directory:

```env
DATABASE_URL="libsql://your-database-url"
DATABASE_AUTH_TOKEN="your-database-token"
```

3. **Database Setup**

First, install the Turso CLI and authenticate:

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login to Turso
turso auth login
```

Create a new Turso database:

```bash
turso db create developer-hub-crm-dev
turso db tokens create developer-hub-crm-dev
```

4. **Database Schema Management**

The project uses Drizzle ORM for schema management. Available
commands:

```bash
# Generate migrations from schema changes
pnpm run db:gen

# Push schema changes to the database
pnpm run db:push

# Note: For Turso databases, make sure to wrap timestamp defaults in double parentheses:
# Example: .default(sql\`((strftime('%s', 'now') * 1000))\`)
```

5. **Development Server**

```bash
# Start the development server
pnpm run dev

# Start with network access
pnpm run dev -- --host
```

## Building for Production

```bash
pnpm run build
pnpm run preview
```

## Contributing

1. Fork the repository
2. Create your feature branch
   (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the
[LICENSE](LICENSE) file for details.
