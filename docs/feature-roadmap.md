# Feature Roadmap

## Master Feature List

All features numbered for easy reference and decision-making.

### GitHub Integration (Auto-Sync & Intelligence)

1. **GitHub activity tracking** - Scheduled job checks contacts'
   GitHub activity (releases, repos, stars) and surfaces insights
2. **Auto-create contacts from GitHub stars** - When someone stars
   your repo, auto-add them as a contact
3. **Auto-create interactions from GitHub activity** - PR
   collaborations, issue discussions → logged as interactions
4. **GitHub profile refresh** - Re-fetch contact's GitHub data to
   update skills, bio, recent activity
5. **Activity-based follow-up suggestions** - "Sarah released v2.0" →
   auto-suggest congratulations follow-up
6. **Relationship graph** - "Who can introduce me to X?" based on
   mutual GitHub connections
7. **Skill/tech auto-tagging** - Parse GitHub repos to tag contacts
   with languages/frameworks they use

### CLI Tool (Terminal Integration)

8. **Basic CLI** - `devhub log`, `devhub contacts`, `devhub due`
   commands
9. **Quick interaction logging** -
   `devhub log @username "met at conf"`
10. **Follow-up creation** -
    `devhub follow-up @username "next week" "send proposal"`
11. **Contact search** - `devhub find rust` or
    `devhub find @company:google`
12. **Dashboard in terminal** - `devhub` shows today's agenda, overdue
    items, recent activity

### Conference/Event Networking

13. **CSV/spreadsheet import** - Bulk import contacts from conference
    attendee lists
14. **Event tagging** - Tag contacts with events/conferences where you
    met
15. **Bulk follow-up workflows** - Create follow-ups for multiple
    contacts at once
16. **Priority scoring** - Rank conference contacts by GitHub
    activity/influence

### Smart Notifications & Insights

18. **Daily digest** - Morning email/notification: "3 contacts
    released projects, 2 follow-ups overdue"
19. **Relationship health tracking** - Flag contacts you haven't
    interacted with in X days
20. **Activity timeline** - Visual timeline of relationship history
    (interactions + GitHub activity)
21. **Best time to reach out** - Analyze when contacts are most
    active/responsive

### Data Ownership & Portability

22. **Full data export** - One-click export to CSV/JSON/vCard
23. **Import from other CRMs** - Import from Notion, Airtable, CSV
24. **Public API** - RESTful API for custom integrations
25. **Webhooks** - Push notifications to Slack, Discord, n8n, Zapier

### Quick Wins (Easy & High Impact)

29. **Dark mode** - Already planned, just finish it
30. **Keyboard shortcuts** - Power user navigation (Cmd+K command
    palette)
31. **Contact merge** - Dedupe/merge duplicate contacts
32. **Tags/labels for contacts** - Custom categorization beyond VIP

### Infrastructure (Foundation for Scale)

33. **Background job system** - Proper job queue for GitHub syncs,
    notifications
34. **Rate limiting & caching** - GitHub API rate limit handling,
    intelligent caching
35. **Multi-user support** - Share contacts within a team (future
    enterprise feature)
36. **Self-hosted Docker image** - One-command deploy for
    privacy-conscious devs
37. **Database migrations** - Proper migration system (instead of
    schema.sql)

### AI/Agent Features

See [ai-features.md](./ai-features.md) for complete AI feature set:

- AI Relationship Insights
- AI Contact Prioritization
- AI Message Composition
- AI Contact Enrichment
- Daily Agent Digest
- GitHub Activity Agent
- Relationship Health Agent

### Viral Growth Features

See [public-profiles.md](./public-profiles.md) for complete viral
growth strategy:

- Public developer profiles (@username)
- QR code system for conferences
- "Add to CRM" viral loop
- Profile analytics
- Network effects

## Phased Implementation

### Phase 1: Core Foundations (Month 1-2)

**Goal:** Solid base + one killer feature

**Must-Have:**

- [x] Core CRM (done)
- [ ] 29. Dark mode (quick win)
- [ ] 30. Keyboard shortcuts
- [ ] 31. Contact merge
- [ ] 32. Tags/labels
- [ ] 33. Background job system
- [ ] 34. Rate limiting & caching
- [ ] 37. Database migrations

**First Killer Feature - Choose ONE:**

- Option A: GitHub Activity Tracking (1, 4, 5, 7)
- Option B: CLI Tool (8, 9, 10, 11, 12)
- Option C: Public Profiles (viral growth)

**Recommendation:** Start with CLI Tool (8-12)

- Fastest to build (~1 week)
- Immediate utility
- Doesn't depend on other features
- Great for early adopters

### Phase 2: GitHub Intelligence (Month 3-4)

**Goal:** Differentiate with GitHub automation

**Core GitHub Features:**

- [ ] 1. GitHub activity tracking
- [ ] 4. GitHub profile refresh
- [ ] 5. Activity-based follow-up suggestions
- [ ] 7. Skill/tech auto-tagging
- [ ] 18. Daily digest (email/notification)
- [ ] 19. Relationship health tracking

**Premium Features:**

- [ ] 2. Auto-create contacts from stars
- [ ] 3. Auto-create interactions from PRs
- [ ] 6. Relationship graph

**Deliverable:** Free users get basic GitHub sync. Paid users get
automation.

### Phase 3: Viral Growth (Month 5-6)

**Goal:** User acquisition through network effects

**Public Profile Features:**

- [ ] Public profiles (`@username` pages)
- [ ] QR code generation
- [ ] "Add to CRM" button/flow
- [ ] Profile analytics (view tracking)
- [ ] Custom profile themes (paid)

**Conference Features:**

- [ ] 13. CSV/bulk import
- [ ] 14. Event tagging
- [ ] 15. Bulk follow-up workflows
- [ ] 16. Priority scoring

**Deliverable:** Every user becomes a marketing channel.

### Phase 4: AI & Automation (Month 7-9)

**Goal:** Premium tier with AI agents

**AI Analysis (Pro Tier):**

- [ ] AI relationship insights
- [ ] AI contact prioritization
- [ ] AI message composition
- [ ] AI contact enrichment
- [ ] AI smart deduplication

**AI Agents (Premium Tier):**

- [ ] Daily agent digest
- [ ] GitHub activity agent
- [ ] Relationship health agent
- [ ] Event/conference agent

**Deliverable:** Premium tier at $30-40/mo with AI agents.

### Phase 5: Scale & Teams (Month 10-12)

**Goal:** Enterprise-ready, team features

**Data & Integration:**

- [ ] 22. Full data export (enhanced)
- [ ] 23. Import from other CRMs
- [ ] 24. Public API (full REST)
- [ ] 25. Webhooks (Slack, Discord, etc.)

**Team Features:**

- [ ] 35. Multi-user support
- [ ] Shared contacts & workspaces
- [ ] Role-based permissions
- [ ] Team activity feed

**Deliverable:** Team tier at $30-50/mo per user.

## Priority Matrix

### Must-Have (P0) - Foundational

- [x] Core CRM (done)
- [ ] 33. Background jobs
- [ ] 34. Rate limiting
- [ ] 37. Database migrations
- [ ] 8-12. CLI tool (all)
- [ ] 1. GitHub activity tracking
- [ ] Public profiles (viral growth)

### Should-Have (P1) - Differentiators

- [ ] 4. GitHub profile refresh
- [ ] 5. Activity-based suggestions
- [ ] 7. Skill auto-tagging
- [ ] 18. Daily digest
- [ ] 13. CSV/bulk import
- [ ] AI message composition
- [ ] AI contact enrichment

### Nice-to-Have (P2) - Enhancements

- [ ] 6. Relationship graph
- [ ] 19. Relationship health
- [ ] 20. Activity timeline
- [ ] 30. Keyboard shortcuts
- [ ] 31. Contact merge
- [ ] 32. Tags/labels
- [ ] Profile analytics

### Future (P3) - Long-term

- [ ] 2. Auto-create from stars
- [ ] 3. Auto-create from PRs
- [ ] 21. Best time to reach out
- [ ] 23. Import from other CRMs
- [ ] 35. Multi-user/teams
- [ ] AI agents (advanced)

## Decision Framework

When picking features to build next, ask:

1. **Does it save time?** (Automation > manual work)
2. **Is it uniquely "developer"?** (GitHub, CLI > generic CRM)
3. **Does it drive growth?** (Viral mechanics > isolated features)
4. **Can we charge for it?** (Premium features > free features)
5. **How complex?** (Ship fast > perfect polish)

**Example:**

- CLI Tool: ✅ Saves time, ✅ Developer-first, ❌ No viral growth, ✅
  Can charge, ✅ Easy to build → **BUILD NOW**
- Relationship Graph: ❌ Doesn't save time, ✅ Developer-first, ❌ No
  viral growth, ✅ Can charge, ❌ Complex → **BUILD LATER**
- Public Profiles: ❌ Doesn't save time, ✅ Developer-first, ✅ HUGE
  viral growth, ✅ Can charge, ✅ Medium complexity → **BUILD EARLY**

## Current Recommendations

### Next 30 Days

1. Finish infrastructure (jobs, caching, migrations)
2. Ship CLI tool (features 8-12)
3. Launch dark mode (feature 29)
4. Start public profiles foundation

### Next 60 Days

5. GitHub activity tracking (feature 1)
6. Daily digest (feature 18)
7. Public profiles + QR codes (viral growth)
8. Basic AI features (enrichment, summarization)

### Next 90 Days

9. Conference import/workflows (features 13-16)
10. AI agents (premium tier)
11. Advanced GitHub automation (features 2-3)
12. Team features (if demand exists)

## Measuring Success

### Feature Adoption Metrics

**CLI Tool:**

- 60% of active users run CLI weekly
- Average 10+ CLI commands per week

**GitHub Sync:**

- 80% of users connect GitHub
- 50% enable auto-sync (paid)

**Public Profiles:**

- 70% create public profile
- Average 5 QR scans per profile
- 60% scan-to-signup conversion

**AI Features:**

- 20% use AI message drafting weekly
- 15% upgrade for AI agents
- 90% satisfaction with AI suggestions

### Feature Value Score

For each feature, track:

1. **Usage:** % of users who use it weekly
2. **Conversion:** % who upgrade for it
3. **Retention:** Impact on churn
4. **Virality:** Does it drive signups?

Kill features with low scores. Double down on high scores.
