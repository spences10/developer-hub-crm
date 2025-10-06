# Public Profiles & Viral Growth

## Viral Loop

Every user becomes a growth channel through their public developer
profile.

**Mechanic:**

1. User signs up → gets public profile (`devhub.app/@username`)
2. Profile includes QR code for easy sharing
3. At conferences/meetups → shows QR code instead of business card
4. Someone scans → sees profile + "Add to Your DevHub CRM" button
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
- CTA: "📇 Add [Name] to Your DevHub CRM" with sign-up button

**QR Code System:**

- Free: Basic QR (black/white), links to profile, downloadable PNG
- Pro: Custom colors/branding, logo in center, high-res, multiple
  formats (PNG, SVG, PDF)

**Use cases:** Conference badge, laptop sticker, GitHub README, email
signature, business cards

## User Flows

**New user scans QR (not logged in):**

1. Scan QR → land on profile
2. See profile (GitHub, projects, links)
3. Click "Add to Your DevHub CRM"
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
- "Powered by DevHub" footer

**Pro ($15-20/mo):**

- Custom QR design (colors, logo)
- Profile analytics (views, scans)
- Custom bio (override GitHub)
- Featured projects (pin specific repos)
- Remove DevHub branding
- Vanity slug (`/scott` instead of `/@spences10`)

**Premium ($30-40/mo):**

- Custom domain (`scott.dev`)
- Advanced analytics (referrer tracking, conversion)
- Multiple profiles (work vs personal)
- White-label
- Connection requests/messaging (if we add social features)

## Profile Analytics

**Tracked metrics:**

- Total views
- QR scans
- Referrer sources (Twitter, conference, etc.)
- Conversion to signup
- Geographic data (conferences)

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
- Private (DevHub users only)
- Disabled (don't want public profile)

**What's shown:**

- User controls what appears
- Can hide email, phone, location
- Can disable QR code
- Can turn off analytics

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
