# Public Profiles & Viral Growth

## Viral Loop

Every user becomes a growth channel through their public developer
profile.

**Mechanic:**

1. User signs up → gets public profile (`devhub.app/@username`)
2. Profile includes QR code for easy sharing
3. At conferences/meetups → shows QR code instead of business card
4. Someone scans → sees profile + "Add to Your Devhub CRM" button
5. They sign up → get their own profile → repeat

**Result:** Exponential growth through network effects

## Public Profile Features

**URL Structure:**

- Primary: `devhub.app/@username`
- Alt: `devhub.app/scott` (vanity, Pro feature)
- Custom domain: `scott.dev` (Premium feature)

**Profile Contents:**

- Hero: Name, photo (from GitHub), tagline/title, location, website,
  GitHub username
- Bio: Auto-pulled from GitHub, custom override (Pro)
- Social links: GitHub, Twitter, LinkedIn, website, Bluesky, Mastodon
- Public projects: Featured repos from GitHub, pin specific projects
  (Pro), auto-shows top 3 by stars
- CTA: "📇 Add [Name] to Your Devhub CRM" with sign-up button

**QR Code System:**

- **URL Format:** `devhub.app/@username?qr=1` (param enables scan
  tracking + enhanced CTAs)
- **Free tier:** Basic QR (black/white), links to profile,
  downloadable PNG
- **Pro tier:** Custom colors/branding, logo in center, high-res,
  multiple formats (PNG, SVG, PDF)

**Use cases:** Conference badge, laptop sticker, GitHub README, email
signature, business cards

**QR Scan Flow:**

1. QR code contains `?qr=1` parameter
2. Profile page detects param → shows enhanced UI
3. **If logged in:** Big "Add to My Contacts" button
4. **If not logged in:** "Sign up to save this contact" CTA
5. Scan tracked in `profile_views` table with `qr_scan = 1`

## User Flows

**New user scans QR (not logged in):**

1. Scan QR → land on profile
2. See profile (GitHub, projects, links)
3. Click "Add to Your Devhub CRM"
4. OAuth flow → account created
5. Contact auto-added, profile created, QR code generated
6. Onboarding: "Share your profile at your next meetup!"

**Existing user scans QR (logged in):**

1. Scan QR → land on profile
2. Click "Add to CRM" → one-click add
3. Redirect to contact page

## Profile Features by Tier

**Free:**

- Basic profile (`@username`)
- GitHub auto-sync (bio, repos, socials)
- Basic QR code (black/white)
- Social links
- "Powered by Devhub" footer

**Pro ($15-20/mo):**

- Custom QR design (colors, logo)
- Profile analytics (views, scans)
- Custom bio (override GitHub)
- Featured projects (pin specific repos)
- Remove Devhub branding
- Vanity slug (`/scott` instead of `/@spences10`)

**Premium ($30-40/mo):**

- Custom domain (`scott.dev`)
- Advanced analytics (referrer tracking, conversion)
- Multiple profiles (work vs personal)
- White-label
- Connection requests/messaging (if we add social features)

## Profile Analytics (Premium Feature)

**LinkedIn-Style Upsell:**

- **Free users:** "12 people viewed your profile this week. Upgrade to
  Pro to see who's looking at your profile"
- **Pro users:** Full analytics dashboard with viewer details, QR scan
  breakdown, conversion tracking

**Tracked metrics (Free tier - aggregated only):**

- Total views (number only)
- QR scans (number only)
- View trend graph (last 30 days)

**Tracked metrics (Pro tier - detailed breakdown):**

- Who viewed your profile (name, company, when)
- QR scan details (location, timestamp, device)
- Referrer sources (Twitter, conference, direct link, etc.)
- Conversion to signup tracking
- Geographic heatmap (conferences, cities)
- Most engaged viewers

**Database schema:** All data stored in `profile_views` table from
day 1. Free users just can't see details until they upgrade (no data
loss).

## Growth Projections

- **Month 1:** 100 users → 150 (via friend shares)
- **Month 2:** 150 → 300 (2x from profiles)
- **Month 3:** 300 → 750 (2.5x from conference season)
- **Month 6:** 750 → 3,000+ (viral coefficient >1.5)

**Key assumption:** Each active user shares profile → 2-3 signups over
6 months

## Conference Strategy

**Before:** Download printable QR cards, add QR to badge/laptop, share
profile link on conference Slack/Discord

**During:** Show QR on phone/laptop, share link in chat, add to badge

**After:** See who scanned, auto-create follow-ups, track conference
connections

## Privacy Controls

**Profile visibility:**

- Fully public (default)
- Public but unlisted (need direct link)
- Private (Devhub users only)
- Disabled (don't want public profile)

**What's shown:**

- User controls what appears
- Can hide email, phone, location
- Can disable QR code
- Can turn off analytics

## TODO: Improvements Needed

### Social Links UX

**Current state:** Clunky social links implementation on profile page

**Issues:**

- Manual platform detection with if/else blocks
- Not scalable for adding new platforms
- Hard-coded icons and labels
- No consistent styling pattern

**Proposed solution:**

- Create `SocialLinkButton.svelte` component
- Icon mapping object (platform → icon component)
- Automatic icon selection based on platform
- Consistent styling with DaisyUI classes
- Support for unknown platforms (show generic link icon)

**Priority:** Medium (works but needs refactoring)

## Success Metrics

**Adoption:**

- 70% of users create public profile
- 50% share QR code at events
- 40% add profile link to Twitter/GitHub

**Conversion:**

- 60% scan-to-signup conversion
- Average 5 scans per profile per conference
- 2x signup rate during conference season

**Viral coefficient:**

- Target: >1.5 (each user brings 1.5 new users)
- Goal: Self-sustaining growth by month 6
