# Technical Architecture

## Current Stack

- Frontend: SvelteKit + Svelte 5
- Database: SQLite (better-sqlite3)
- Auth: Better Auth
- Hosting: Coolify (self-hosted)

**Philosophy:** Start simple, scale later. SQLite until we need
PostgreSQL. Monolith until we need microservices. Self-hosted until we
need cloud scale.

## New Database Tables

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

## Background Jobs

**Options:**

- Start: Node-cron for scheduled tasks (simple, good for low-scale)
- Scale: BullMQ at 1,000+ users (Redis-based, retry logic, priority
  queues)

**Job types:**

1. `sync-github-activity` - Nightly for all contacts
2. `run-daily-agent` - Morning digest generation
3. `send-notifications` - Email/webhook delivery
4. `cleanup-old-data` - Archive/delete old records

## GitHub API Integration

**Rate limits:** Authenticated: 5,000 req/hour, Unauthenticated: 60
req/hour

**Strategy:**

1. Use user OAuth tokens (each user = separate 5,000/hour limit)
2. Aggressive caching (Profile: 1h, Repos: 6h, Activity: 30min,
   Social: 24h)
3. Batch & throttle (sync 100 contacts/hour, spread across 24 hours)
4. Tiered sync (Free: 10/day, Pro: all daily, Premium: real-time
   webhooks)

## AI Integration

**Model options:**

- Start: Claude 3.5 Sonnet or GPT-4 ($0.01-0.05 per operation, best
  quality)
- Future: Self-hosted OSS (Llama 3.1, Mistral - infrastructure cost
  only, lower quality)
- Long-term: Hybrid (Free tier: OSS, Paid tier: Claude/GPT)

**Data minimization:** Only send name, company, interactions summary.
Never send email, phone, private notes.

## CLI Tool

**Tech stack:** Clack, Chalk, Ora

**Distribution:** NPM package `@devhub/cli`, global install

**Auth:** OAuth via browser popup or API token, store in
`~/.devhub/config.json`

**API client:** REST calls to main app, same endpoints as web UI, JWT
auth

## Public Profile System

**URL routing:** `/@username` → public profile,
`/api/profiles/@username` → JSON API, custom domains → CNAME

**QR code:** Use `qrcode` npm package, generate on profile
create/update, store as data URL or upload to R2/S3

**SEO:** Server-side render, Open Graph meta tags, Schema.org Person
markup, sitemap for all profiles

## Webhooks & API

**Outgoing webhooks:** User configures URLs, trigger events (follow-up
due, contact added), retry logic (3 attempts with backoff), HMAC
signature

**REST API:** `/api/contacts`, `/api/interactions`, `/api/follow-ups`,
`/api/sync`

**Auth:** JWT tokens, API keys for CLI, rate limiting (100 req/min
free, 1000 req/min paid)

## Deployment

**Current:**

```
Coolify → Node.js (SvelteKit) → SQLite (local file)
```

**Future scale:**

```
Load Balancer → App Servers (SvelteKit) → PostgreSQL + Redis + S3/R2
```

**When to migrate:**

- SQLite → PostgreSQL: >10,000 active users
- Monolith → Services: >50,000 users
- Self-host → Cloud: When revenue supports it

## Database Migrations

**Current:** `schema.sql` (manual)

**Needed:** Migration files `migrations/001_add_tags.sql`, version
tracking in `migrations` table, run on app startup

## Monitoring

**Application:** Sentry for errors, built-in performance tracking,
stdout logs

**Business metrics:** User signups, feature adoption, conversion,
churn, MRR/ARR (store in SQLite analytics tables, later
PostHog/Mixpanel)

## Security

**Auth:** Better Auth handles sessions, API keys for CLI, rate
limiting, CSRF protection (SvelteKit built-in)

**Data:** Passwords hashed, API tokens encrypted, GitHub tokens
encrypted, no PII in logs

**AI privacy:** Minimal data to AI APIs, no PII in prompts, option to
disable, self-hosted models for privacy mode

## Performance

**Database:** Indexes on frequent queries, pagination, batch queries,
SQLite WAL mode

**Caching:** GitHub API responses (aggressive), rendered profiles (SSR
cache), AI responses, Redis for session/cache (when scale)

**Frontend:** Code splitting (SvelteKit automatic), lazy load, image
optimization, bundle size monitoring

## Scalability Checkpoints

- **100 users:** Current architecture works, SQLite sufficient, cron
  jobs adequate
- **1,000 users:** Consider BullMQ, monitor SQLite, add Redis for
  caching
- **10,000 users:** Migrate to PostgreSQL, multiple app instances,
  dedicated job workers, CDN
- **100,000 users:** Microservices (if needed), database sharding,
  Kubernetes, full monitoring

## Key Decisions

**Why SQLite?** Simple, fast, reliable, perfect for <10k users, local
file = easy backups, migrate later if needed

**Why Monolith?** Simpler to develop & deploy, SvelteKit handles it
all, split later if performance demands

**Why Self-Hosted?** Lower cost initially, full control, good for MVP,
migrate to cloud when revenue justifies

**Why Better Auth?** Modern, well-maintained, built for SvelteKit,
OAuth support, less work than custom
