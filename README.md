# Developer Hub CRM

A modern CRM built with SvelteKit, Turso, and Drizzle ORM, designed
for managing developer relationships and interactions.

## Features

- 👤 Contact Management with VIP Support
- 🤝 Interaction Tracking
- 🎯 Smart Follow-ups
- 🧠 AI-Powered Features
- 📱 Responsive Design
- 🌓 Dark/Light Mode

## Tech Stack

- **Frontend**: SvelteKit + Svelte 5 + Tailwind CSS + DaisyUI
- **Database**: Turso (Distributed SQLite)
- **ORM**: Drizzle ORM
- **Auth**: Lucia Auth
- **Styling**: Tailwind v4 + DaisyUI v5

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
