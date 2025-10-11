# GitHub Integration - Realistic Scope

## What We Have

**Manual GitHub import** (one-time):

- Fetch public profile data
- Import name, bio, company, avatar
- Import social links
- Works, no rate limit issues

Code: `src/lib/server/github.ts`

## What's Realistic

### Free Tier: Manual Only

**Profile import:**

- User enters GitHub username
- We fetch public data once
- Store in contacts

**Profile refresh:**

- Button: "Refresh GitHub Data"
- Re-fetches latest profile
- Updates changed fields

**Cost:** Zero (no automated syncing)

### Pro Tier: Limited Tracking

**Opt-in tracking:**

- User selects 10-25 contacts to track
- Nightly job checks their GitHub activity
- Shows: releases, new repos, significant contributions

**Implementation:**

- Add `track_github` boolean to contacts table
- Count tracked contacts per user (enforce limit)
- Background job runs once per night
- Uses user's OAuth token when available (better rate limits)

**Rate limits:**

- Authenticated: 5,000 req/hour
- 25 contacts × 3 API calls each = 75 requests
- Easily within limits

### Premium Tier: AI Analysis

**Same as Pro, but:**

- Track up to 10 VIP contacts (smaller, more focused)
- AI analyzes activity for significance
- Auto-drafts follow-up suggestions
- Included in daily AI digest

## What We're NOT Building

❌ **Auto-create from stars**

- Requires webhooks or constant polling
- Complex setup per user
- Low value (most stars are drive-by)

❌ **Auto-create from PRs**

- Same problems as stars
- Rate limit nightmare at scale

❌ **Unlimited syncing**

- Would hit rate limits instantly
- Expensive infrastructure (job queues, workers)
- Not necessary - users care about ~10 key people

❌ **Real-time webhooks**

- Maintenance burden
- Requires user setup
- Overkill for relationship management

## Database Schema

**Contacts table:**

- Add `track_github` flag (boolean)

**New table: `github_insights`**

- Stores activity: releases, new repos, contributions
- Links to contact_id
- Tracks if user acknowledged the insight
- Indexed on contact_id and acknowledged status

## API Usage Strategy

**For manual imports (free tier):**

- No auth required (60 req/hour shared)
- Fine for occasional imports

**For tracking (Pro/Premium):**

- Use user's OAuth token when available
- Falls back to app token if not
- Cache aggressively (check once per day)
- Batch requests

**Rate limit handling:**

- Check response status for rate limit errors
- Use retry with backoff
- Respect GitHub's rate limit reset time

## User Experience

### Free Users

**Contact detail page:**

```
GitHub: @username
  [Refresh GitHub Data] button

Last refreshed: 2 days ago
```

### Pro Users

**Contact detail page:**

```
GitHub: @username
  [✓] Track GitHub activity
  [Refresh Now]

Recent activity:
  🚀 Released v2.0 of sveltekit-superforms (2 days ago)
  📦 Created new repo: devtools-extension (1 week ago)
```

### Premium Users

**Daily digest email includes:**

```
GitHub Activity:
  Sarah Chen released v2.0 of sveltekit-superforms
  → Suggested: Congratulate her on the release

  Marcus Lee started new project: rust-performance-tools
  → Suggested: Ask about the use case
```

## Implementation Phases

**Phase 1 (Current):**

- ✅ Manual GitHub import
- ✅ Profile data fetch
- ✅ Social links import

**Phase 2 (Pro tier):**

- Add `track_github` flag to contacts
- Build background job for nightly sync
- UI: checkbox "Track GitHub activity"
- Enforce limits (25 contacts for Pro)

**Phase 3 (Premium tier):**

- Reduce limit to 10 VIP contacts
- Add AI analysis of activity
- Include in daily digest
- Auto-draft follow-up suggestions

## Cost Analysis

**Pro tier (25 tracked contacts):**

- 25 contacts × 3 API calls × 30 days = 2,250 requests/month
- Well within 5,000/hour limit
- Cost: $0 (using GitHub API)

**Premium tier (10 contacts + AI):**

- 10 contacts × 3 API calls × 30 days = 900 requests/month
- AI analysis: ~$0.05 per insight
- Monthly cost: ~$3-5/user (included in $40/mo)

## Future Considerations

**If we grow large:**

- Dedicated GitHub App (higher rate limits)
- Redis caching layer
- Stagger sync times across users
- Priority queue (Premium users first)

**Local alternative:**

- Let users run their own sync worker
- Provide Docker image
- Use their own GitHub token
- Zero rate limit concerns

## Resources

- Existing code: `src/lib/server/github.ts`
- GitHub API docs: https://docs.github.com/en/rest
- Rate limits: https://docs.github.com/en/rest/rate-limit
