# AI Features

## Overview

AI transforms Devhub from passive storage into active relationship
intelligence. The foundation is vector search (essentially free), with
LLM calls for premium features (expensive, so paid tier only).

**Philosophy:** AI suggests, never decides. All outputs are reviewed
by user before action.

## Foundation: Vector Search (Free Tier)

See [vector-search.md](./vector-search.md) for technical details.

**What it enables:**

- Semantic contact search ("find rust developers" matches "systems
  programming")
- Smart context for AI features (only send relevant data to LLM)
- Similar contact discovery
- Topic clustering

**Cost:** ~$0.0001/user/month (Voyage AI embeddings)

## AI Feature Tiers

### Free Tier - Vector Search Only

No LLM calls, just semantic search powered by embeddings:

- Semantic contact search
- Relationship health score (rule-based algorithm)
- Basic suggestions (time-based reminders)

**Cost:** $0.001/user/month | **Revenue:** $0 (acquisition/retention
tool)

### Pro Tier ($15/mo) - AI Analysis

Limited LLM calls for one-off tasks:

- AI interaction summarization (100/month)
- AI suggested topics for follow-ups
- AI contact enrichment (on-demand)
- Enhanced relationship health (pattern analysis)

**Cost:** ~$8/user/month | **Revenue:** $15/mo | **Margin:**
$7/user/month

### Premium Tier ($40/mo) - AI Agents

Continuous AI processing with daily reports:

- Daily AI digest (automated)
- Relationship insights agent
- GitHub activity agent (if tracking enabled)
- Unlimited AI operations

**Cost:** ~$25/user/month | **Revenue:** $40/mo | **Margin:**
$15/user/month

## Free Tier Features

### 1. Semantic Contact Search

Find contacts by meaning, not keywords.

**Example queries:**

- "machine learning" → finds "neural networks", "AI research", "LLM
  development"
- "rust developers" → finds "systems programming", "performance
  optimization"
- "conference speakers" → finds mentions of "talk", "presentation",
  "keynote"

**How:** Pure vector similarity search, no LLM needed.

**UX:** Toggle between "Keyword" and "Semantic" search modes on
contacts page.

### 2. Relationship Health Score

**Current:** Basic rule-based algorithm (time since contact,
interaction count, VIP status)

**Enhanced (Pro tier):** Pattern analysis detects typical cadence
("You contact Sarah every 6 weeks")

### 3. Time-Based Suggestions

Simple rule-based suggestions:

- "Haven't contacted in 90+ days"
- "Overdue follow-up"
- "VIP not contacted in 30 days"

## Pro Tier Features ($15/mo)

### 1. AI Interaction Summarization

**Use case:** Paste long email thread or meeting notes → get
structured summary.

**Input:** Raw text (up to 4k tokens)

**Output:**

- Key points (3-5 bullets)
- Action items extracted
- Suggested follow-up tasks
- Topics discussed

**Limit:** 100/month

**UX:** Button on "Log Interaction" form: "✨ Summarize with AI"

### 2. AI Suggested Topics

**Use case:** Opening follow-up reminder → see suggested talking
points.

**How it works:**

1. Vector search finds most relevant past interactions
2. LLM analyzes context + time since last contact
3. Generates 3-5 suggested topics

**Example:**

_"You last spoke with Sarah 3 months ago about:"_

- Svelte 5 migration project
- Her new role at Vercel
- Conference speaking

_"Suggested topics:"_

- Ask how the Svelte 5 launch went
- Congratulate on her recent blog post
- Check if she's speaking at upcoming conferences

**UX:** Auto-shown on follow-up reminder when >30 days since last
contact

### 3. AI Contact Enrichment

**Use case:** You have partial contact info, AI finds missing data.

**Input:** Name, company (optional), GitHub username (optional)

**Output:**

- Suggested company (if missing)
- Potential social links
- Bio/background summary
- Tech stack/interests

**How it works:**

1. Vector search similar contacts in your network
2. LLM analyzes patterns + public data hints
3. Returns suggestions with confidence scores

**UX:** Button on contact detail page: "✨ Enrich with AI"

### 4. Enhanced Relationship Health

**Analysis:**

- "You typically contact Sarah every 6 weeks"
- "Relationship strength: STRONG (consistent engagement)"
- "Suggested frequency: Every 4-6 weeks"

**How:** LLM analyzes interaction gaps to detect patterns.

## Premium Tier Features ($40/mo)

### 1. Daily AI Digest

**What it is:** Overnight AI agent analyzes entire network, generates
morning report.

**Delivered:** Email at 7:00 AM

**Content:**

- Top 3 people to reach out to (with reasons)
- Overdue follow-ups (prioritized by importance)
- Recent GitHub activity (if tracking enabled)
- Relationships needing attention
- Drafted talking points for each

**Example:**

```
Good morning! Here's your daily relationship digest:

🎯 TOP PRIORITIES

1. Sarah Chen (Vercel)
   - Last contact: 47 days ago (typical: 42 days)
   - Recent activity: Released Svelte 5 project
   - Suggested: Congratulate on launch, ask about adoption

2. Marcus Johnson (Independent)
   - Last contact: 89 days ago (relationship cooling)
   - VIP contact
   - Suggested: Quick check-in, ask about consulting work

3. Alex Kumar (Google)
   - Follow-up overdue by 5 days
   - Action: Send proposal for collaboration

⚠️ RELATIONSHIPS NEEDING ATTENTION (3)
- Jessica Lee: 120 days since contact
- David Park: 95 days since contact
- Rachel Green: 180 days since contact

📊 NETWORK HEALTH
- Total contacts: 127
- Active relationships: 45
- Pending follow-ups: 12 (3 overdue)
```

**Cost:** ~$0.50-1.00/day = ~$15-30/user/month

### 2. Relationship Insights Agent

**What it does:** Weekly analysis of conversation patterns, sentiment,
topics.

**Insights provided:**

**Pattern Analysis:**

- "You discuss technical topics 80% of the time with Sarah"
- "Conversations with Marcus are 50% career advice, 30% projects, 20%
  personal"

**Sentiment Tracking:**

- Analyze tone of interaction notes
- Flag relationships that feel "cold" or "distant"
- Celebrate strong, positive relationships

**Reciprocity:**

- "You initiated last 5 interactions with David - consider if this is
  one-sided"

**How:** Weekly report using vector clustering + LLM analysis.

**Cost:** ~$8-12/month per user

### 3. GitHub Activity Agent (Optional)

**Prerequisite:** User enables GitHub tracking for specific contacts
(max 10).

**What it does:**

- Checks tracked contacts' GitHub daily
- Identifies significant events (releases, new projects, major
  contributions)
- Auto-drafts congratulations/follow-up suggestions

**Example alert:**

```
🚀 Sarah Chen released v2.0 of sveltekit-superforms

Suggested action:
- Congratulate her on the release
- Ask about new features
- Share if you've used it

Draft message:
"Hey Sarah! Saw you launched v2.0 of superforms - congrats!
The new features look great. Have you seen much adoption so far?"
```

**Cost:** ~$3-6/month per user

## AI Model Strategy

**Embedding model (all tiers):**

- **Voyage AI `voyage-3`** for embeddings
- 1024 dimensions
- $0.10 per 1M tokens
- Superior quality for semantic search

**LLM models:**

**Pro tier (cheap operations):**

- Summarization, topic suggestions, enrichment
- Model: `gpt-4o-mini` or similar
- ~$0.01-0.05 per operation

**Premium tier (complex analysis):**

- Daily digest, relationship insights, pattern detection
- Model: `gpt-4o` or similar
- ~$0.50-1.00 per digest

### Cost Control

**Pro tier limits:**

- 100 summarizations/month
- Unlimited topic suggestions (cheap operation)
- On-demand enrichment

**Premium tier:**

- Unlimited operations
- Daily digest (most expensive feature)
- Weekly insights report

## Privacy & Data Handling

**What gets sent to LLM:**

- Contact names, companies, titles
- Interaction notes (context only)
- Aggregated stats

**What doesn't:**

- Email addresses, phone numbers
- Full contact database
- Sensitive personal data

**User controls:**

- Opt-out of AI features entirely
- Per-contact AI disable
- Data sharing preferences: none / anonymized / full

## Success Metrics

**Adoption:**

- % of Pro users who use AI features weekly
- % who upgrade to Premium for digest
- Feature usage breakdown

**Quality:**

- Suggested topics acceptance rate (target: 70%+)
- Digest action rate (target: 50%+ act on top 3)
- User satisfaction (target: 4.5/5 stars)

**Retention:**

- AI users churn 60% less than non-AI users
- Premium users (with digest) churn 80% less

## Implementation Phases

### Phase 1: Foundation (Week 1-2)

- Vector search infrastructure (Voyage AI embeddings + sqlite-vec)
- Semantic search UI
- LLM integration setup

### Phase 2: Pro Tier (Week 3-4)

- AI interaction summarization
- AI suggested topics
- Payment integration (Stripe/Polar)

### Phase 3: Premium Tier (Week 5-8)

- Daily digest agent
- Relationship insights
- Email delivery system

### Phase 4: Advanced (Month 3+)

- GitHub activity agent
- Connection graph visualization
- Network analytics dashboard

## Future Enhancements

**Local AI Models:**

- Replace cloud LLMs with Ollama + Llama for privacy
- Keep Voyage AI for embeddings (better quality)
- Zero API costs for LLM calls
- Trade-off: Slightly lower quality

**Multi-Language Support:**

- Detect interaction language
- Generate suggestions in user's language
- Support non-English contacts

**Integration with Communication Tools:**

- Gmail plugin: Auto-log emails as interactions
- Slack integration: Track DM conversations
- Calendar integration: Auto-log meetings

## Resources

- [OpenAI API pricing](https://openai.com/api/pricing/)
- [Voyage AI embeddings](https://docs.voyageai.com/docs/embeddings)
- [Vector search implementation](./vector-search.md)
