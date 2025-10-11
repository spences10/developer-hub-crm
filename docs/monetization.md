# Monetization Strategy

## Business Model: Freemium SaaS

Make free tier genuinely useful. Charge for automation, scale, and
time savings.

## Payment Infrastructure

**Provider:** [Polar.sh](https://polar.sh) - Open-source Merchant of
Record

**Why Polar:**

- Handles all global tax compliance automatically (VAT, sales tax,
  etc.)
- 4% + 40¢ per transaction (~20% cheaper than alternatives)
- Native Better Auth integration (`@polar-sh/better-auth`)
- Developer-first APIs and excellent SvelteKit support
- No monthly fees or setup costs

**See [payments-polar.md](./payments-polar.md) for complete
integration details.**

## Pricing Tiers

### Free (Forever)

- Unlimited contacts, interactions, follow-ups
- Dashboard, search, filters, VIP tracking, tags, notes
- Manual GitHub import (Quick Connect, 10 contacts/day sync limit)
- Full CLI access
- Basic public profile + basic QR code
- "Powered by Devhub" footer
- Self-hosted option (Docker, SQLite)

### Pro - $15-20/month

- Auto-sync all contacts daily (no limits)
- Activity-based follow-up suggestions
- Daily digest (email)
- CSV/bulk import
- AI features (5 summaries/day, 10 message drafts/day)
- Custom QR code (colors, logo)
- Profile analytics
- Remove Devhub branding
- Full API access + webhooks

**Upgrade triggers:**

- Hit 10-contact GitHub sync limit
- Want CSV import for conference leads
- Need daily digest
- Want AI message drafting
- Need webhooks/API

### Premium - $30-40/month

- Everything in Pro, PLUS:
- Unlimited AI features
- AI agents (daily digest, GitHub monitoring, relationship health)
- Custom domain for profile
- Advanced analytics
- Multiple profiles
- White-label
- Priority support

**Upgrade triggers:**

- Want AI agents to work autonomously
- Need unlimited AI features
- Attend many conferences
- Custom domain for personal branding

### Team - $30-50/month per user (Future)

- Everything in Premium, PLUS:
- Shared contacts & workspaces
- Team activity feed
- Role-based permissions
- SSO/SAML
- Team analytics

## Pricing Comparison

| Feature             | Free      | Pro ($15-20) | Premium ($30-40) |
| ------------------- | --------- | ------------ | ---------------- |
| Contacts            | Unlimited | Unlimited    | Unlimited        |
| GitHub auto-sync    | 10/day    | Unlimited    | Unlimited        |
| Daily digest        | ❌        | Email        | Email + Smart    |
| CLI tool            | ✅ Full   | ✅ Full      | ✅ Full          |
| AI message drafting | ❌        | 10/day       | Unlimited        |
| AI summarization    | ❌        | 5/day        | Unlimited        |
| AI agents           | ❌        | ❌           | ✅ Full          |
| Bulk import (CSV)   | ❌        | ✅           | ✅               |
| Webhooks/API        | Read-only | Full         | Full             |
| Public profile      | Basic     | Custom QR    | Custom domain    |
| Branding            | Devhub    | Optional     | White-label      |

## Revenue Projections

**Conservative (Month 12):**

- 10,000 total users
- 1,600 Pro (16% @ $18/mo) = $28,800 gross MRR
- 400 Premium (4% @ $35/mo) = $14,000 gross MRR
- **Gross: $42,800 MRR (~$514k ARR)**
- Polar fees (~6%): -$2,512/mo
- **Net: $40,288 MRR (~$483k ARR)**

**Optimistic (Month 12):**

- 25,000 total users
- 4,000 Pro @ $18/mo = $72,000 gross MRR
- 1,000 Premium @ $35/mo = $35,000 gross MRR
- **Gross: $107,000 MRR (~$1.28M ARR)**
- Polar fees (~6%): -$6,288/mo
- **Net: $100,712 MRR (~$1.21M ARR)**

_Note: Polar fees include payment processing + global tax compliance.
DIY tax compliance would cost more in time and accounting fees._

## Pricing Psychology

**Pro pricing ($15-20):**

- Below Notion ($10), above basic tools ($5)
- Affordable for individual developers
- "Cost of 2 coffees/month"

**Premium pricing ($30-40):**

- 2x Pro price (anchoring)
- Below enterprise tools ($50-100)
- "Cost of 1 nice dinner/month"

**Annual discount:**

- Pro: $180/year ($15/mo, save 17%)
- Premium: $350/year ($29/mo, save 17%)

## Churn Prevention

**Target churn:**

- Free tier: 10-15%/month (acceptable)
- Pro tier: <5%/month
- Premium tier: <3%/month (AI agents are sticky)

**Retention strategies:**

- Onboarding: Quick wins in first session
- Weekly digest: Keep showing value
- Seasonal: Conference reminders
- Data lock-in: More data = harder to leave

## Recommendation

**Start with:** Freemium SaaS

- Generous free tier (build trust)
- Pro at $18/mo (GitHub automation)
- Premium at $35/mo (AI agents)
- Annual option (17% off)

**Path:**

1. Months 1-6: Freemium SaaS, integrate Polar, validate pricing
2. Months 7-12: Add annual plans, optimize conversion
3. Year 2: Open source core, keep cloud paid
4. Year 3: Add Team tier, enterprise features

**Payment Infrastructure:** Polar.sh handles all billing and tax
compliance (see [payments-polar.md](./payments-polar.md))

**Success metric:** $50k MRR by month 12
