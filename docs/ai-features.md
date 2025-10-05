# AI Features

## Overview

AI features transform DevHub from a passive data storage system into
an **active relationship intelligence platform**. Instead of manually
analyzing contacts and drafting messages, AI agents work in the
background to provide insights and suggestions.

**Core Principle:** AI should **suggest, never decide**. It drafts
messages for you to review, suggests follow-ups for you to approve,
and surfaces insights for you to act on. You stay in control.

## AI Feature Tiers

### Tier 1: AI Analysis (Passive Intelligence)

**What:** AI reads and analyzes, surfaces insights **User Control:**
High (review insights, ignore if not useful) **Cost:** Lower (one-time
analysis) **Tier:** Pro ($15-20/mo)

### Tier 2: AI Automation (Active Assistance)

**What:** AI generates content, performs actions (with approval)
**User Control:** Medium (review before sending/saving) **Cost:**
Medium (real-time generation) **Tier:** Pro ($15-20/mo)

### Tier 3: AI Agents (Proactive Automation)

**What:** AI runs continuously, creates tasks, drafts messages
proactively **User Control:** Configurable (set preferences, AI acts
within bounds) **Cost:** Higher (continuous processing) **Tier:**
Premium ($30-40/mo)

---

## Tier 1: AI Analysis Features

### 19. AI Relationship Insights

**What it does:**

- Analyzes interaction history + GitHub activity
- Identifies relationship patterns
- Scores relationship health
- Suggests optimal engagement frequency

**User Experience:**

```
Contact Detail Page:

╭─────────────────────────────────────────╮
│  🤖 AI Insights                         │
├─────────────────────────────────────────┤
│  Relationship Strength: STRONG 💪       │
│  You've connected every 90 days on      │
│  average for the past year.             │
│                                          │
│  Pattern: You tend to reach out after   │
│  Sarah ships major releases.            │
│                                          │
│  Suggestion: It's been 87 days since    │
│  last contact. Based on past patterns,  │
│  consider reaching out this week.       │
│                                          │
│  [ Create Follow-up ] [ Dismiss ]      │
╰─────────────────────────────────────────╯
```

**Implementation:**

```typescript
// lib/server/ai/relationship-insights.ts
export async function analyzeRelationship(contactId: string) {
	const contact = await getContact(contactId);
	const interactions = await getInteractions(contactId);
	const githubActivity = await getGitHubInsights(contactId);

	const prompt = `
    Analyze this professional relationship and provide insights:

    Contact: ${contact.name} (${contact.company})

    Interaction History:
    ${interactions.map((i) => `- ${formatDate(i.created_at)}: ${i.type} - ${i.note}`).join('\n')}

    GitHub Activity:
    ${githubActivity.map((a) => `- ${a.title}`).join('\n')}

    Provide:
    1. Relationship strength score (1-100)
    2. Interaction pattern (e.g., "every 3 months")
    3. Key triggers for contact (e.g., "after releases")
    4. Suggested next action
  `;

	const insights = await ai.analyze(prompt);

	return {
		score: insights.score,
		strength: scoreToLabel(insights.score),
		pattern: insights.pattern,
		triggers: insights.triggers,
		suggestion: insights.suggestion,
	};
}
```

### 20. AI Contact Prioritization

**What it does:**

- Ranks contacts by priority each day
- Considers: GitHub activity, time since last contact, relationship
  strength, VIP status
- Suggests top 3-5 contacts to engage with

**User Experience:**

```
Dashboard:

╭─────────────────────────────────────────╮
│  🎯 AI Priority Contacts (Today)        │
├─────────────────────────────────────────┤
│  1. Sarah Chen ⭐ VIP                   │
│     Why: Released v2.0 yesterday        │
│     Action: Send congratulations        │
│     [ Draft Message ]                   │
│                                          │
│  2. Marcus Rodriguez                     │
│     Why: 90 days since last contact     │
│     Action: Check-in call               │
│     [ Schedule Follow-up ]              │
│                                          │
│  3. Alex Kumar                           │
│     Why: Mentioned you in GitHub issue  │
│     Action: Respond to mention          │
│     [ View Issue ]                      │
╰─────────────────────────────────────────╯
```

**Implementation:**

```typescript
// lib/server/ai/prioritization.ts
export async function prioritizeContacts(userId: string) {
	const contacts = await getContacts(userId);
	const priorities = [];

	for (const contact of contacts) {
		const score = await calculatePriorityScore(contact);
		if (score > 50) {
			priorities.push({
				contact,
				score,
				reasons: await explainPriority(contact, score),
			});
		}
	}

	return priorities.sort((a, b) => b.score - a.score).slice(0, 5);
}

async function calculatePriorityScore(contact: Contact) {
	let score = 0;

	// VIP bonus
	if (contact.is_vip) score += 30;

	// Time decay (haven't contacted recently)
	const daysSinceContact = getDaysSinceLastContact(contact);
	if (daysSinceContact > 90) score += 25;
	else if (daysSinceContact > 60) score += 15;
	else if (daysSinceContact > 30) score += 5;

	// GitHub activity (new release, repo, etc.)
	const recentActivity = await getRecentGitHubActivity(contact.id);
	score += recentActivity.length * 10;

	// Upcoming birthday
	if (isBirthdayThisWeek(contact.birthday)) score += 20;

	// Pending follow-up overdue
	const overdueFollowUps = await getOverdueFollowUps(contact.id);
	score += overdueFollowUps.length * 15;

	return Math.min(score, 100);
}
```

### 21. AI Follow-up Suggestions

**What it does:**

- Reads interaction context
- Suggests relevant follow-up tasks
- Auto-drafts follow-up note based on last interaction

**User Experience:**

```
After logging interaction:

╭─────────────────────────────────────────╮
│  ✅ Interaction Logged                  │
│                                          │
│  🤖 AI Suggestion:                      │
│  Based on your conversation about       │
│  hiring, you might want to follow up:   │
│                                          │
│  Task: "Send engineering job posting"   │
│  Due: Next week                          │
│                                          │
│  [ Create Follow-up ] [ Ignore ]        │
╰─────────────────────────────────────────╯
```

### 22. AI Meeting/Note Summarization

**What it does:**

- Takes long interaction notes
- Extracts key points, action items, topics
- Suggests follow-ups based on content

**User Experience:**

```
Interaction Form:

┌─────────────────────────────────────────┐
│  Interaction Note:                      │
│  ┌───────────────────────────────────┐ │
│  │ Had a great 60min call with Sarah│ │
│  │ - Discussed their scaling issues  │ │
│  │ - They're hiring 5 engineers      │ │
│  │ - Interested in our enterprise    │ │
│  │   plan                            │ │
│  │ - Need proposal by end of month   │ │
│  │ - Also mentioned wanting intro to │ │
│  │   Marcus for DevOps advice        │ │
│  └───────────────────────────────────┘ │
│                                          │
│  [ 🤖 Summarize with AI ]               │
│                                          │
│  → Summary:                              │
│     60min call about scaling & hiring    │
│                                          │
│  → Extracted Topics:                     │
│     #scaling #hiring #enterprise-plan    │
│                                          │
│  → Suggested Follow-ups:                 │
│     - Send enterprise proposal (by EOM)  │
│     - Intro Sarah to Marcus              │
│     - Share hiring resources             │
│                                          │
│  [ Apply ] [ Edit ] [ Cancel ]          │
└─────────────────────────────────────────┘
```

---

## Tier 2: AI Automation Features

### 23. AI Message Composition

**What it does:**

- Drafts personalized messages based on relationship context
- You specify intent, AI writes the message
- Review/edit before sending

**User Experience:**

```
Contact Detail Page:

╭─────────────────────────────────────────╮
│  📧 Draft Message with AI               │
├─────────────────────────────────────────┤
│  What do you want to say?               │
│  ┌───────────────────────────────────┐ │
│  │ Congratulate on v2.0 release      │ │
│  └───────────────────────────────────┘ │
│                                          │
│  [ Generate Draft ]                     │
│                                          │
│  → AI Draft:                             │
│  ┌───────────────────────────────────┐ │
│  │ Hey Sarah,                        │ │
│  │                                    │ │
│  │ Just saw you shipped v2.0 of      │ │
│  │ awesome-framework—congrats! 🎉    │ │
│  │                                    │ │
│  │ I remember you mentioned working  │ │
│  │ on the new rendering engine back  │ │
│  │ in July. Great to see it ship!    │ │
│  │                                    │ │
│  │ Would love to hear how it's been  │ │
│  │ received. Grab coffee next week?  │ │
│  │                                    │ │
│  │ - Scott                            │ │
│  └───────────────────────────────────┘ │
│                                          │
│  [ ✏️ Edit ] [ 📋 Copy ] [ ↻ Regenerate ]│
╰─────────────────────────────────────────╯
```

**Implementation:**

```typescript
// lib/server/ai/message-composer.ts
export async function composeMessage(
	contactId: string,
	intent: string,
) {
	const contact = await getContact(contactId);
	const interactions = await getRecentInteractions(contactId, 5);
	const githubActivity = await getRecentGitHubActivity(contactId);
	const user = await getCurrentUser();

	const prompt = `
    You are helping ${user.name} draft a message to ${contact.name}.

    Context:
    - Relationship: ${contact.is_vip ? 'VIP contact' : 'Professional contact'}
    - Company: ${contact.company}
    - Recent interactions:
      ${interactions.map((i) => `${formatDate(i.created_at)}: ${i.note}`).join('\n')}
    - Recent GitHub activity:
      ${githubActivity.map((a) => `${a.type}: ${a.title}`).join('\n')}

    User wants to: ${intent}

    Draft a warm, professional, concise message (3-5 sentences).
    - Reference specific shared context if relevant
    - Be authentic, not overly formal
    - Include a small call-to-action if appropriate
    - Sign with ${user.name}'s first name only

    Draft:
  `;

	const draft = await ai.generate(prompt);

	return {
		message: draft,
		context_used: {
			interactions: interactions.length,
			github_activity: githubActivity.length,
		},
	};
}
```

### 24. AI Contact Enrichment

**What it does:**

- Automatically fills missing contact data
- Searches public sources (GitHub, LinkedIn, personal sites)
- Suggests updates when data changes

**User Experience:**

```
Contact Edit Page:

╭─────────────────────────────────────────╮
│  🤖 AI found updates for this contact:  │
├─────────────────────────────────────────┤
│  ✓ Company changed:                     │
│    Old: TechCorp                         │
│    New: Meta (from GitHub profile)       │
│                                          │
│  ✓ Found missing email:                 │
│    sarah.chen@meta.com                   │
│                                          │
│  ✓ New social links:                    │
│    Bluesky: @sarahchen.dev               │
│                                          │
│  [ Apply All ] [ Review Each ] [ Ignore ]│
╰─────────────────────────────────────────╯
```

### 25. AI Smart Deduplication

**What it does:**

- Finds potential duplicate contacts intelligently
- Shows confidence score
- Suggests merge with field-level resolution

**User Experience:**

```
Settings > Duplicates:

╭─────────────────────────────────────────╮
│  🔍 Potential Duplicates Found (2)      │
├─────────────────────────────────────────┤
│  Sarah Chen                              │
│  sarah.chen@techcorp.io                 │
│  Added: 6 months ago                     │
│                                          │
│  ≈ 95% match                            │
│                                          │
│  Sarah C.                                │
│  sarah@meta.com                          │
│  Added: 2 days ago                       │
│                                          │
│  AI: Very likely the same person        │
│  - Same GitHub username (@sarahchen)     │
│  - Similar companies (TechCorp → Meta)   │
│  - Email domains match pattern           │
│                                          │
│  [ Merge Contacts ] [ Not a Duplicate ] │
╰─────────────────────────────────────────╯
```

### 26. AI Interaction Parsing

**What it does:**

- Paste email/message, AI extracts structured data
- Creates interaction automatically
- Identifies action items → creates follow-ups

**User Experience:**

```
Quick Log:

╭─────────────────────────────────────────╮
│  📧 Paste Email/Message:                │
│  ┌───────────────────────────────────┐ │
│  │ From: Sarah <sarah@meta.com>     │ │
│  │ Date: Oct 5, 2024                │ │
│  │                                   │ │
│  │ Hey Scott,                        │ │
│  │                                   │ │
│  │ Great chatting yesterday! Send me │ │
│  │ that proposal by Friday and let's │ │
│  │ schedule a follow-up for next    │ │
│  │ Tuesday to review.                │ │
│  │                                   │ │
│  │ - Sarah                           │ │
│  └───────────────────────────────────┘ │
│                                          │
│  [ 🤖 Parse with AI ]                   │
│                                          │
│  → Detected:                             │
│     Contact: Sarah Chen                  │
│     Type: Email                          │
│     Date: Oct 5, 2024                    │
│     Summary: Follow-up to yesterday's    │
│              conversation                 │
│                                          │
│  → Action Items:                         │
│     - Send proposal (due: Friday)        │
│     - Schedule follow-up (due: Tuesday)  │
│                                          │
│  [ Log Interaction + Create Tasks ]     │
╰─────────────────────────────────────────╯
```

---

## Tier 3: AI Agents (Proactive)

### 27. Daily Agent Digest

**What it does:**

- AI agent runs overnight
- Analyzes entire network
- Generates personalized morning report

**User Experience:**

```
Email (7:00 AM daily):

Subject: Your DevHub Digest - 3 priorities today

Hey Scott,

Here's what your AI agent found overnight:

🎯 TOP PRIORITIES (3)

1. Sarah Chen ⭐
   Released v2.0 yesterday
   → Suggested action: Send congratulations
   [ Draft Message ]

2. Marcus Rodriguez
   90 days since last contact (going cold)
   → Suggested action: Quick check-in call
   [ Schedule Follow-up ]

3. Alex Kumar
   Mentioned you in GitHub issue #234
   → Suggested action: Respond to mention
   [ View Issue ]

⚠️ OVERDUE (2)
- David Thompson: 2 days overdue
- Lisa Zhang: 7 days overdue
  [ View All ]

🚀 GITHUB ACTIVITY (last 24h)
- 4 contacts shipped new projects
- 2 contacts released updates
- 7 new stars on your repos
  [ View Details ]

---
Manage preferences: devhub.app/settings
```

**Implementation:**

```typescript
// lib/server/ai/daily-agent.ts
export async function runDailyAgent(userId: string) {
	const contacts = await getContacts(userId);
	const insights = [];

	// Analyze each contact
	for (const contact of contacts) {
		const priority = await calculatePriority(contact);
		if (priority.score > 60) {
			insights.push({
				contact,
				priority: priority.score,
				reasons: priority.reasons,
				suggested_action: await generateAction(contact, priority),
			});
		}
	}

	// GitHub activity scan
	const githubActivity = await scanAllGitHubActivity(contacts);

	// Overdue follow-ups
	const overdue = await getOverdueFollowUps(userId);

	// Generate digest
	const digest = {
		priorities: insights.slice(0, 3),
		overdue,
		github_activity: githubActivity,
		generated_at: Date.now(),
	};

	// Save to database
	await saveAgentDigest(userId, digest);

	// Send email if user preference
	const prefs = await getUserPreferences(userId);
	if (prefs.daily_digest_email) {
		await sendDigestEmail(userId, digest);
	}

	return digest;
}
```

### 28. GitHub Activity Agent

**What it does:**

- Monitors all contact GitHub activity 24/7
- Generates immediate action items
- Drafts context-aware responses

**User Experience:**

```
Notification (real-time):

╭─────────────────────────────────────────╮
│  🤖 GitHub Activity Agent               │
├─────────────────────────────────────────┤
│  Sarah Chen just released v2.0!         │
│                                          │
│  This is significant because:            │
│  - It's her first major release this    │
│    year                                  │
│  - You discussed this feature in July   │
│  - 234 stars already                    │
│                                          │
│  Suggested action:                       │
│  Send congratulations message            │
│                                          │
│  AI Draft:                               │
│  "Hey Sarah! Just saw v2.0 shipped—     │
│   congrats on finally getting that      │
│   rendering engine live! 🎉"            │
│                                          │
│  [ Send Message ] [ Create Follow-up ]  │
│  [ Snooze ] [ Dismiss ]                 │
╰─────────────────────────────────────────╯
```

### 29. Relationship Health Agent

**What it does:**

- Tracks relationship decay (time since contact)
- Proactively flags contacts going cold
- Generates re-engagement messages

**User Experience:**

```
Weekly Report (email):

Subject: ⚠️ 5 relationships need attention

Hey Scott,

Your Relationship Health Agent flagged these contacts:

🔥 CRITICAL (going cold)

Marcus Rodriguez
Last contact: 92 days ago
Pattern: You usually reconnect every 90 days

AI Draft:
"Hey Marcus, realized it's been 3 months since we last caught up.
 How's the startup going? Would love to hear how things are scaling."

[ Send Draft ] [ Schedule Call ] [ Snooze 30d ]

---

Sarah Chen
Last contact: 87 days ago
She just released v2.0 (perfect timing!)

AI Draft:
"Hey Sarah! Saw you shipped v2.0—congrats! Been meaning to check in.
 How's it being received so far?"

[ Send Draft ] [ Create Follow-up ]

---
[ View All (5) ]
```

### 30. Event/Conference Agent

**What it does:**

- Post-conference analysis
- Prioritizes who to follow up with
- Auto-drafts personalized follow-ups

**User Experience:**

```
After uploading conference CSV:

╭─────────────────────────────────────────╮
│  🎪 Conference Agent Analysis           │
│     SvelteConf 2024 (40 contacts)       │
├─────────────────────────────────────────┤
│  🤖 Processing...                       │
│  ✓ Enriched with GitHub data            │
│  ✓ Analyzed priorities                  │
│  ✓ Drafted follow-up messages           │
│                                          │
│  TOP 10 TO FOLLOW UP WITH:              │
│                                          │
│  1. Sarah Chen ⭐                       │
│     Why: Active Svelte maintainer,      │
│          500+ GitHub followers           │
│     Draft: "Great meeting you at the    │
│            Svelte booth! Loved your     │
│            talk on reactivity..."       │
│     [ Review ] [ Send ]                 │
│                                          │
│  2. Marcus Rodriguez                     │
│     Why: CTO at funded startup,         │
│          already using SvelteKit        │
│     Draft: "Thanks for stopping by our  │
│            booth! Would love to..."     │
│     [ Review ] [ Send ]                 │
│                                          │
│  [ View All 40 ] [ Bulk Schedule ]      │
╰─────────────────────────────────────────╯
```

---

## Technical Implementation

### AI Stack Options

**Option A: OpenAI/Claude API** (Recommended for MVP)

- Use Claude 3.5 Sonnet or GPT-4
- Cost: ~$0.01-0.05 per operation
- Pros: Best quality, fast, reliable
- Cons: Recurring API costs, data sent to third-party

**Option B: Open Source Models** (Long-term)

- Self-hosted Llama 3.1, Mistral, etc.
- Cost: Infrastructure only
- Pros: Privacy, no per-use cost
- Cons: Complex setup, lower quality

**Option C: Hybrid** (Best of Both)

- Cheap tasks → OSS models (summarization)
- Premium tasks → Claude/GPT (agents, drafting)
- Free tier → OSS only
- Paid tier → Claude/GPT

### Privacy & Data Handling

**Data Minimization:**

```typescript
// Only send necessary context to AI
function prepareAIContext(contact: Contact) {
	return {
		name: contact.name,
		company: contact.company,
		// Exclude sensitive data
		// ❌ email, phone, address
		recent_interactions: sanitizeInteractions(contact.interactions),
		github_activity: contact.github_activity,
	};
}
```

**User Control:**

```typescript
// User preferences for AI
interface AIPreferences {
	enabled: boolean;
	daily_digest: boolean;
	message_drafting: boolean;
	auto_suggestions: boolean;
	data_sharing: 'none' | 'anonymized' | 'full';
}
```

## Pricing Strategy

| Feature                   | Free | Pro    | Premium   |
| ------------------------- | ---- | ------ | --------- |
| AI summarization          | ❌   | 5/day  | Unlimited |
| AI message drafting       | ❌   | 10/day | Unlimited |
| AI contact enrichment     | ❌   | ✅     | ✅        |
| Daily agent digest        | ❌   | ❌     | ✅        |
| GitHub activity agent     | ❌   | ❌     | ✅        |
| Relationship health agent | ❌   | ❌     | ✅        |

**Why Premium for Agents?**

- Continuous processing = higher cost
- Premium features need premium price to justify
- Creates clear upgrade path

## Success Metrics

**Adoption:**

- 30% of Pro users try AI features
- 15% of users upgrade to Premium for agents
- 80% satisfaction with AI suggestions

**Accuracy:**

- 90%+ of AI drafts used with minimal edits
- 70%+ of AI suggestions acted upon
- <5% "this is wrong" feedback

**Retention:**

- AI users churn 60% less
- Agent users (Premium) churn 80% less
