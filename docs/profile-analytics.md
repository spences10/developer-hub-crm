# Profile Analytics - LinkedIn-Style Upsell

## The Hook

**Free tier:** "23 people viewed your profile this week"

**Pro tier:** See who viewed, when, and from where

Same playbook as LinkedIn. Works.

## Current State

Infrastructure already exists:

- `profile_views` table (schema.sql:150-160)
- `user_profiles` table with username, bio, social links
- QR code system for conferences

**Missing:** UI to show analytics + upsell conversion flow

## Free vs Pro Tiers

### Free Users See:

**Profile Views Widget:**

- Total views count (number only)
- View trend graph (last 30 days)
- QR scan count
- **CTA:** "Upgrade to Pro to see who's checking you out →"

### Pro Users See:

**Who Viewed:**

- Name (if logged in Devhub user)
- Company
- When (timestamp)
- How (QR scan, direct link, search)
- Location (if from QR scan at conference)

**Analytics Dashboard:**

- Views over time (graph)
- QR scans vs web views breakdown
- Referrer sources (Twitter, conference, direct)
- Geographic heatmap (conferences/cities)
- Most engaged viewers

## Data Tracking

**What's tracked:**

- Every profile page view
- QR scan parameter (`?qr=1`)
- Referrer (Twitter, conference site, etc.)
- Viewer ID (if logged in to Devhub)

**What's NOT tracked:**

- IP addresses (privacy)
- Device fingerprinting
- Detailed user behavior beyond view

**Note:** Already implemented in `profile_views` table
(schema.sql:150-160)

## Conversion Triggers

**When to show upsell:**

1. After user gets >10 views in a week
2. After QR scan at conference (high intent moment)
3. When viewing profile stats page
4. In email: "5 new people viewed your profile"

**Messaging:**

- "See who's interested in connecting"
- "Know when your network checks you out"
- "Track conference connections"

## Privacy Controls

**Free users:**

- Can disable profile entirely
- Can make profile unlisted (need direct link)
- Views still tracked (for when they upgrade)

**Pro users:**

- Same controls as free
- Option: "Don't show my views to others" (browse anonymously)

## Revenue Impact

**Conversion rate estimate:** 10-15% of users with >10 views/week
upgrade

**Example math:**

- 1,000 total users
- 30% create public profiles = 300
- 20% get >10 views = 60
- 15% conversion = 9 upgrades
- 9 × $15/mo = **$135/mo** from this feature alone

**Conference spikes:** QR scans at events → spike in profile views →
spike in upgrades

## Implementation Phases

### Phase 1: Basic Analytics (Week 1)

- Query functions for view counts
- Free tier widget on profile page
- Upsell CTA

### Phase 2: Pro Dashboard (Week 2)

- Detailed viewer list for Pro users
- Analytics charts (views over time)
- Referrer breakdown

### Phase 3: Conversion Optimization (Week 3)

- Email notifications for new views
- A/B test upsell messaging
- Track conversion funnel

## Future Enhancements

**Notifications:**

- Email: "5 new people viewed your profile"
- In-app notification badge

**Social proof:**

- "You're in the top 10% of viewed profiles"
- "Most viewers work in AI/ML"

**Export:**

- Export viewer list (for outreach)
- CSV download for Pro users

## Resources

- Existing infrastructure: schema.sql:150-160 (`profile_views` table)
- Public profile route: src/routes/@[username]/+page.svelte
- QR code system: See public-profiles.md
