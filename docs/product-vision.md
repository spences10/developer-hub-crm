# Product Vision

## Current State (v0.1)

Works but generic. Has GitHub import (nice), but everything else is
manual.

**Rating:** 6/10

## The Problem

Developers suck at relationship management because:

- They hate manual data entry
- They live in specific tools (not CRMs)
- Their networks are unique (conferences, open source, GitHub)
- They value privacy and data ownership

## Our Solution

**"The CRM that works like a developer"**

Not another CRM with a GitHub button. A relationship intelligence
platform that:

- Uses vector search for semantic understanding
- Automates data entry with AI
- Provides LinkedIn-style profile analytics
- Respects privacy (SQLite, self-hosted, full export)

## What Makes Us Different

**Free Tier:**

- Semantic search (find "rust developers" matches "systems
  programming")
- SQLite + self-hosted = you own your data
- Manual GitHub import (one-time)
- Profile views (number only)

**Pro Tier ($15/mo):**

- AI summarization (paste email → get key points)
- AI suggested topics (conversation starters)
- Profile analytics (see who viewed)
- Enhanced relationship health

**Premium Tier ($40/mo):**

- Daily AI digest (email at 7am: "these 3 people need your attention")
- Relationship insights agent
- GitHub activity tracking (10 VIP contacts)

## Target Users

**Primary:**

- Conference networkers (5-10 events/year, meet 100+ devs)
- Open source maintainers (manage contributor relationships)
- Developer advocates (track community relationships)
- Freelancers (manage client + dev network)

**Not for:**

- Sales teams (they have Salesforce)
- Enterprises (not yet - maybe later)

## Success = Time Saved

**North Star:** Developers spend <5 min/week managing relationships
but maintain stronger networks.

Every feature should either:

1. Reduce manual work (AI summarization, semantic search)
2. Increase insight (relationship health, AI digest)
3. Drive growth (profile analytics, QR codes)

If it doesn't do one of these, cut it.

## What We're NOT Building

❌ CLI tool (nice-to-have, app first) ❌ Unlimited GitHub syncing
(rate limits) ❌ Auto-create from stars (complex, low value) ❌
Webhooks (maintenance nightmare) ❌ Generic CRM features (we're not
Salesforce)

## Competitive Position

**vs Traditional CRMs:** They're for sales teams. We're for
developers. **vs Notion/Airtable:** They're manual. We automate with
AI. **vs LinkedIn:** They're passive. We're active relationship
management. **vs Spreadsheets:** They're dumb. We have semantic
search + AI.

## Strategic Moats

1. **Vector Search** - Semantic understanding of your network
2. **AI Agents** - Proactive relationship management
3. **Profile Analytics** - LinkedIn-style viral growth
4. **Data Ownership** - SQLite, self-hosted, full export
5. **Developer-First** - Built by devs, for devs

## Roadmap Philosophy

**Phase 1 (Months 1-2):** Foundation

- Tags, vector search, profile analytics UI
- Make free tier compelling

**Phase 2 (Months 3-4):** AI Features

- Summarization, suggested topics, contact enrichment
- Launch Pro tier ($15/mo)

**Phase 3 (Months 5-6):** Premium Tier

- Daily digest, relationship insights, GitHub tracking
- Launch Premium ($40/mo)

**Phase 4 (Months 7+):** Growth

- Viral mechanics (profile analytics upsell)
- Conference season marketing
- Network effects

## Success Metrics

**Month 3:** 100 users (friends, Twitter) **Month 6:** 1,000 users
(profile viral growth) **Month 12:** 10,000 users (conference season,
word of mouth)

**Conversion:**

- 10% upgrade to Pro within 30 days
- 2% upgrade to Premium
- <5% monthly churn

**Viral:**

- Each user shares profile → 2-3 signups over 6 months
- QR codes at conferences → 60% scan-to-signup conversion

## Revenue Model

**Target (Month 6):**

- 1,000 total users
- 200 Pro ($15/mo) = $3,000/mo
- 50 Premium ($40/mo) = $2,000/mo
- **Total: $5,000/mo revenue**
- **Costs: ~$2,850/mo (AI + infrastructure)**
- **Profit: ~$2,150/mo**

**Target (Month 12):**

- 10,000 total users
- 2,000 Pro = $30,000/mo
- 500 Premium = $20,000/mo
- **Total: $50,000/mo revenue**
- **Profit: ~$25,000/mo**

## Resources

- [feature-roadmap.md](./feature-roadmap.md) - What we're building
- [ai-features.md](./ai-features.md) - AI implementation
- [monetization.md](./monetization.md) - Pricing strategy
- [vector-search.md](./vector-search.md) - Technical foundation
