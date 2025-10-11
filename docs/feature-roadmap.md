# Feature Roadmap - Realistic Edition

## What We Have (v0.1)

- Core CRM (contacts, interactions, follow-ups)
- GitHub Quick Connect (manual import)
- User profiles + QR codes (infrastructure exists)
- Basic relationship health score
- Auth, themes, preferences

**Rating:** 6/10 - Works, but nothing special

## What Makes This a Developer CRM

### Tier 1: Foundation (Weeks 1-4)

**Tags System**

- Add tags to contacts ("rust", "conference-2024", "potential-hire")
- Filter/search by tags
- Simple, essential, no excuse not to have this

**Vector Search** (see [vector-search.md](./vector-search.md))

- Semantic contact search (free tier)
- Foundation for all AI features
- Cost: ~$1/100 users/month (Voyage AI embeddings)
- Status: NEW - not built yet

**Contact Merge/Dedupe**

- Find duplicates
- Merge contacts with field-level resolution
- Inevitable with GitHub imports

**Profile Analytics** (see
[profile-analytics.md](./profile-analytics.md))

- "X people viewed your profile" (LinkedIn model)
- Free: show number only
- Pro: show who viewed, when, from where
- Infrastructure exists (profile_views table), just needs UI

### Tier 2: AI Features (Weeks 5-8)

See [ai-features.md](./ai-features.md) for full details.

**Pro Tier ($15/mo):**

- AI interaction summarization (paste long email → get summary)
- AI suggested topics (show conversation starters on follow-ups)
- AI contact enrichment (fill missing data)
- Enhanced relationship health (pattern detection)

**Premium Tier ($40/mo):**

- Daily AI digest (email at 7am with top 3 people to contact)
- Relationship insights agent (weekly analysis)
- GitHub activity agent (optional, for VIP contacts only)

### Tier 3: GitHub Intelligence (Weeks 9-12)

**Manual (Free):**

- Refresh GitHub profile data (on-demand button)
- Import from GitHub (one-time)

**Limited Sync (Pro):**

- Track 10-25 contacts' GitHub activity
- User selects which contacts to track
- Daily sync (not continuous)
- Show: releases, new projects, major contributions

**No Auto-Create Features:**

- ❌ Auto-create from stars (too complex)
- ❌ Auto-create from PRs (rate limit nightmare)
- ❌ Webhook infrastructure (maintenance hell)

### Future Ideas (No Timeline)

**CLI Tool:**

- `devhub log @sarah "met at conf"`
- Good feature, but app first
- Deprioritized per user feedback

**Connection Graph:**

- Visual network map (D3.js)
- Based on vector similarity
- "Find people similar to Sarah"

**Conference Workflows:**

- CSV bulk import
- Event tagging
- Bulk follow-up creation

## What's Realistic vs Pie in the Sky

### ✅ Realistic (Can Build)

- Tags (1 day)
- Vector search (1 week)
- Profile analytics UI (2-3 days)
- AI summarization/suggestions (1 week)
- Contact merge (2-3 days)
- Manual GitHub refresh (exists, just improve UX)

### ⚠️ Expensive but Doable

- Daily AI digest ($15-30/user/month in AI costs)
- Limited GitHub activity tracking (10 contacts max)
- Relationship insights agent

### ❌ Unrealistic (Don't Build)

- Unlimited GitHub syncing for free users (rate limits)
- Auto-create from GitHub stars (complex, low value)
- Auto-create from PRs (expensive)
- Real-time GitHub webhooks (maintenance nightmare)
- CLI tool as priority (deprioritized)

## Next 30 Days - Actual Plan

1. **Tags system** (must-have)
2. **Vector search foundation** (embeddings for existing data)
3. **Semantic search UI** (toggle on contacts page)
4. **Profile analytics UI** ("X people viewed your profile")
5. **Payment system** (Stripe/Polar integration)

## Next 60 Days

6. **AI summarization** (Pro tier)
7. **AI suggested topics** (Pro tier)
8. **Daily digest** (Premium tier)
9. **Contact merge/dedupe**

## Next 90 Days

10. **Limited GitHub activity tracking** (Premium tier, 10 contacts
    max)
11. **Relationship insights agent** (Premium tier)
12. **Connection graph visualization**

## Pricing Tiers

**Free:**

- Core CRM
- Semantic search (vector-powered)
- Basic relationship health
- Manual GitHub import
- Profile views (number only)

**Pro ($15/mo):**

- AI summarization (100/month)
- AI suggested topics (unlimited)
- AI contact enrichment
- Profile analytics (see who viewed)
- Enhanced relationship health

**Premium ($40/mo):**

- Everything in Pro
- Daily AI digest
- Relationship insights agent
- GitHub activity tracking (10 VIP contacts)
- Unlimited AI operations

## Cost Model

**100 users:**

Free tier:

- Cost: $1/month (embeddings)
- Revenue: $0

Pro tier (200 users):

- Cost: $1,600/month (AI calls)
- Revenue: $3,000/month
- **Profit: $1,400/month**

Premium tier (50 users):

- Cost: $1,250/month (daily digest)
- Revenue: $2,000/month
- **Profit: $750/month**

**Total: $2,150/month profit** (200 Pro + 50 Premium users)

## Decision Framework

Build if:

1. Saves user time (automation)
2. Uniquely "developer" (not generic CRM)
3. Can charge for it (revenue)
4. Shippable in <2 weeks (velocity)

Don't build if:

1. Resource-intensive (GitHub rate limits, webhooks)
2. Complex infrastructure (background jobs before MVP)
3. Low value (relationship graph looks cool, doesn't save time)
4. Maintenance burden (webhooks, auto-create features)

## Resources

- [vector-search.md](./vector-search.md) - Technical implementation
- [ai-features.md](./ai-features.md) - AI feature details
- [profile-analytics.md](./profile-analytics.md) - LinkedIn-style
  upsell
- [github-integration.md](./github-integration.md) - Realistic scope
