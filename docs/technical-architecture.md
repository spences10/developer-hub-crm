# Technical Architecture

## High-Level Overview

**Current Stack:**

- Frontend: SvelteKit + Svelte 5
- Database: SQLite (better-sqlite3)
- Auth: Better Auth
- Hosting: Coolify (self-hosted)

**Architecture Philosophy:**

- Start simple, scale later
- SQLite until we need PostgreSQL
- Monolith until we need microservices
- Self-hosted until we need cloud scale

---

## Database Schema Additions

### New Tables for Features

**Public Profiles:**

```sql
CREATE TABLE public_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  slug TEXT UNIQUE,
  is_public INTEGER DEFAULT 1,
  bio TEXT,
  location TEXT,
  website TEXT,
  custom_domain TEXT,
  qr_code_url TEXT,
  view_count INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);
```

**Profile Analytics:**

```sql
CREATE TABLE profile_views (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL,
  viewer_id TEXT,
  ip_address TEXT,
  referrer TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (profile_id) REFERENCES public_profiles(id)
);
```

**GitHub Insights:**

```sql
CREATE TABLE github_insights (
  id TEXT PRIMARY KEY,
  contact_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  metadata JSON,
  created_at INTEGER NOT NULL,
  acknowledged INTEGER DEFAULT 0,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);
```

**AI Agent Reports:**

```sql
CREATE TABLE agent_reports (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  report_type TEXT NOT NULL,
  priorities JSON,
  insights JSON,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);
```

**Tags:**

```sql
CREATE TABLE tags (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE contact_tags (
  contact_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (contact_id, tag_id),
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

---

## Background Job System

**Why We Need It:**

- GitHub activity sync (nightly)
- AI agent runs (daily digest)
- Email notifications
- Webhook retries
- Data cleanup

**Options:**

**Option A: Simple Cron (Start Here)**

- Node-cron for scheduled tasks
- Works for low-scale
- Easy to implement
- Migrate later if needed

**Option B: BullMQ (Scale Later)**

- Redis-based job queue
- Retry logic, priority queues
- Web UI for monitoring
- Better for high-scale

**Recommendation:** Start with cron, migrate to BullMQ at 1,000+ users

**Job Types:**

1. `sync-github-activity` - Nightly for all contacts
2. `run-daily-agent` - Morning digest generation
3. `send-notifications` - Email/webhook delivery
4. `cleanup-old-data` - Archive/delete old records

---

## GitHub API Integration

**Rate Limits:**

- Authenticated: 5,000 req/hour
- Unauthenticated: 60 req/hour

**Strategy:**

**1. Use User OAuth Tokens**

- Each user's token = separate limit
- Spreads load across users
- Users get 5,000/hour for their syncs

**2. Aggressive Caching**

- Profile: 1 hour TTL
- Repos: 6 hours TTL
- Activity: 30 min TTL
- Social links: 24 hours TTL

**3. Batch & Throttle**

- Sync 100 contacts/hour (not all at once)
- Spread across 24 hours
- Prioritize VIPs and active contacts

**4. Tiered Sync Frequency**

- Free: 10 contacts/day
- Pro: All contacts daily
- Premium: Real-time webhooks

---

## AI Integration

**Model Options:**

**Claude/GPT API (Start Here):**

- Use Claude 3.5 Sonnet or GPT-4
- Cost: $0.01-0.05 per operation
- Best quality, easy integration
- Send only necessary context (privacy)

**Self-Hosted OSS (Future):**

- Llama 3.1, Mistral, etc.
- Infrastructure cost only
- Privacy-first
- Lower quality

**Hybrid (Long-term):**

- Free tier: OSS models
- Paid tier: Claude/GPT

**Data Minimization:**

- Only send: name, company, interactions summary
- Never send: email, phone, private notes
- Anonymize when possible

---

## CLI Tool Architecture

**Tech Stack:**

- Commander.js (command framework)
- Inquirer (interactive prompts)
- Chalk (colors)
- Ora (spinners)
- Axios (API client)

**Distribution:**

- NPM package: `@devhub/cli`
- Global install: `npm i -g @devhub/cli`

**Authentication:**

- OAuth via browser popup
- Or API token (manual)
- Store token in `~/.devhub/config.json`

**API Client:**

- REST API calls to main app
- Same endpoints as web UI
- JWT auth header

---

## Public Profile System

**URL Routing:**

- `/@username` → Public profile page
- `/api/profiles/@username` → JSON API
- Custom domains → CNAME → profile

**QR Code Generation:**

- Use `qrcode` npm package
- Generate on profile create/update
- Store as data URL or upload to R2/S3

**SEO Optimization:**

- Server-side render (SSR)
- Open Graph meta tags
- Schema.org Person markup
- Sitemap for all public profiles

---

## Webhooks & API

**Outgoing Webhooks:**

- User configures webhook URLs
- Trigger events: follow-up due, contact added, etc.
- Retry logic: 3 attempts with backoff
- Signature verification (HMAC)

**REST API:**

- `/api/contacts` - CRUD contacts
- `/api/interactions` - Log interactions
- `/api/follow-ups` - Manage follow-ups
- `/api/sync` - Trigger GitHub sync

**Authentication:**

- JWT tokens (Better Auth)
- API keys for CLI/integrations
- Rate limiting: 100 req/min (free), 1000 req/min (paid)

---

## Deployment Architecture

**Current (Self-Hosted):**

```
Coolify
  └── Node.js (SvelteKit)
      └── SQLite (local file)
```

**Scale Plan (Future):**

```
Load Balancer
  ├── App Server 1 (SvelteKit)
  ├── App Server 2 (SvelteKit)
  └── App Server N (SvelteKit)
       └── PostgreSQL (shared)
       └── Redis (jobs, cache)
       └── S3/R2 (QR codes, assets)
```

**When to Migrate:**

- SQLite → PostgreSQL: >10,000 active users
- Monolith → Services: >50,000 users
- Self-host → Cloud: When revenue supports it

---

## Database Migrations

**Current:** `schema.sql` (manual)

**Needed:** Proper migration system

**Options:**

- Drizzle ORM (migrations + type safety)
- Kysely (SQL builder + migrations)
- Custom (simple SQL files + version tracking)

**Recommendation:** Start simple

- Migration files: `migrations/001_add_tags.sql`
- Version tracking: `migrations` table
- Run on app startup
- Manual for now, automate later

---

## Monitoring & Analytics

**Application Monitoring:**

- Error tracking: Sentry
- Performance: (built-in, later New Relic/DataDog)
- Logs: stdout (later Loki/CloudWatch)

**Business Metrics:**

- User signups (by source)
- Feature adoption (CLI, profiles, AI)
- Conversion (free → paid)
- Churn rate
- Revenue (MRR, ARR)

**Store in:**

- SQLite analytics tables (start)
- PostHog/Mixpanel (if budget allows)

---

## Security Considerations

**Auth & Access:**

- Better Auth handles sessions
- API keys for CLI/integrations
- Rate limiting per user
- CSRF protection (SvelteKit built-in)

**Data Protection:**

- Passwords hashed (Better Auth)
- API tokens encrypted
- GitHub tokens encrypted
- No PII in logs

**GitHub API:**

- Never store GitHub access tokens in plaintext
- Refresh tokens when needed
- Respect rate limits (avoid bans)

**AI Privacy:**

- Minimal data sent to AI APIs
- No PII (email, phone) in prompts
- Option to disable AI features
- Self-hosted models for privacy mode

---

## Performance Optimization

**Database:**

- Indexes on frequently queried fields
- Pagination (limit/offset)
- Batch queries where possible
- SQLite WAL mode (already enabled)

**Caching:**

- GitHub API responses (aggressive)
- Rendered profiles (SSR cache)
- AI responses (same prompt = same result)
- Redis for session/cache (when scale)

**Frontend:**

- Code splitting (SvelteKit automatic)
- Lazy load components
- Image optimization
- Bundle size monitoring

---

## Scalability Checkpoints

**100 users:**

- Current architecture works fine
- SQLite sufficient
- Cron jobs adequate

**1,000 users:**

- Consider BullMQ for jobs
- Monitor SQLite performance
- Add Redis for caching

**10,000 users:**

- Migrate to PostgreSQL
- Multiple app instances
- Dedicated job workers
- CDN for assets

**100,000 users:**

- Microservices (if needed)
- Database sharding
- Kubernetes/cloud-native
- Full monitoring stack

---

## Tech Debt to Address

**Now:**

- [x] Basic CRM (done)
- [ ] Proper migrations system
- [ ] Background job system
- [ ] Error tracking (Sentry)

**Soon:**

- [ ] Redis for caching
- [ ] BullMQ for jobs
- [ ] Automated tests (E2E)
- [ ] Performance monitoring

**Later:**

- [ ] PostgreSQL migration
- [ ] Multi-region deployment
- [ ] Real-time features (WebSockets)
- [ ] Mobile app (React Native?)

---

## Development Workflow

**Local Setup:**

```bash
git clone repo
pnpm install
cp .env.example .env
pnpm run dev
```

**Database:**

- SQLite file: `local.db`
- Seed data: `pnpm run seed`
- Reset: delete `local.db`, restart

**Testing:**

- Unit: Vitest
- E2E: Playwright
- Run: `pnpm test`

**Deployment:**

- Push to main → Coolify auto-deploy
- Migrations run on startup
- Zero-downtime (eventually)

---

## Key Architectural Decisions

**Why SQLite?**

- Simple, fast, reliable
- Perfect for <10k users
- Local file = easy backups
- Migrate to Postgres later if needed

**Why Monolith?**

- Simpler to develop & deploy
- SvelteKit handles it all
- Split later if performance demands
- Premature optimization = waste

**Why Self-Hosted (Coolify)?**

- Lower cost initially
- Full control
- Good for MVP
- Migrate to cloud when revenue justifies

**Why Better Auth?**

- Modern, well-maintained
- Built for SvelteKit
- OAuth support (GitHub login)
- Less work than custom auth

---

## Future Considerations

**Real-Time Features:**

- WebSockets for live updates
- Collaborative editing (team tier)
- Live notifications

**Mobile App:**

- React Native or Flutter
- Same API, different UI
- QR scanner built-in

**Offline-First:**

- Service workers
- IndexedDB sync
- Works without internet

**GraphQL API:**

- For complex queries
- Better than REST for mobile
- Consider if needed
