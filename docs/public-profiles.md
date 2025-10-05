# Public Profiles & Viral Growth

## The Viral Loop

**Core Mechanic:** Every user becomes a growth channel through their
public developer profile.

**How It Works:**

1. User signs up → gets public profile (`devhub.app/@username`)
2. Profile includes QR code for easy sharing
3. At conferences/meetups → shows QR code instead of business card
4. Someone scans → sees profile + "Add to Your DevHub CRM" button
5. They sign up → get their own profile → repeat

**Result:** Exponential growth through network effects.

## Public Profile Features

### Profile URL Structure

- Primary: `devhub.app/@username`
- Alt: `devhub.app/scott` (vanity, Pro feature)
- Custom domain: `scott.dev` (Premium feature)

### What's On The Profile

**Hero Section:**

- Name, photo (from GitHub)
- Tagline/title
- Location, website
- GitHub username

**Bio:**

- Auto-pulled from GitHub
- Custom override (Pro feature)

**Social Links:**

- GitHub, Twitter, LinkedIn, website
- Bluesky, Mastodon, etc.

**Public Projects:**

- Featured repos from GitHub
- Pin specific projects (Pro feature)
- Auto-shows top 3 by stars

**CTA (The Viral Hook):**

```
📇 Add [Name] to Your DevHub CRM

[ Sign up with GitHub ]

✓ Track developer connections
✓ Follow-ups & reminders
✓ GitHub integration
```

### QR Code System

**Free Tier:**

- Basic QR code (black/white)
- Links to profile
- Downloadable PNG

**Pro Tier:**

- Custom colors/branding
- Logo in center
- High-res print quality
- Multiple formats (PNG, SVG, PDF)

**Use Cases:**

- Conference badge
- Laptop sticker
- GitHub README
- Email signature
- Business cards (if you still use those)

## User Flows

### Flow 1: New User Scans QR (Not Logged In)

1. Scan QR → land on `@spences10`
2. See profile (GitHub, projects, links)
3. Click "Add Scott to Your DevHub CRM"
4. Redirected to signup: "Sign in with GitHub"
5. OAuth flow → account created
6. **Automatic:**
   - Scott is added to their contacts (auto-imported from GitHub)
   - Their profile is created
   - They get their own QR code
7. Onboarding: "Share your profile at your next meetup!"

### Flow 2: Existing User Scans QR (Logged In)

1. Scan QR → land on `@spences10`
2. See profile + "You're logged in as @alice"
3. Click "Add Scott to Your CRM"
4. One-click → Scott added to contacts
5. Redirect to Scott's contact page in their CRM

### Flow 3: Public Discovery (SEO)

1. Google search: "Scott Spence developer"
2. DevHub profile ranks (public, indexed)
3. See profile, projects, links
4. Bottom CTA: "Scott manages contacts with DevHub. Get yours →"
5. Sign up flow...

## Viral Growth Mechanics

### Network Effects

**Every user is a billboard:**

- QR codes at conferences, meetups
- Profile links in Twitter bio, GitHub README
- "Powered by DevHub" footer (free tier)

**Frictionless signup:**

- One-click GitHub OAuth
- No forms, no friction
- Instant value: contact added + profile created

**Immediate utility:**

- Scan someone → they're in your CRM
- Get a profile → share it immediately
- More users = more value

### Conversion Triggers

**Why people sign up after seeing a profile:**

1. "This is cool, I want my own GitHub profile QR"
2. "Easy way to share all my links at conferences"
3. "I just met 20 devs, need to track them"
4. "My current CRM sucks, this is for devs"

### Conference Strategy

**Before Conference:**

- Download printable QR cards (PDF)
- Add QR to badge, laptop sticker
- Share profile link on conference slack/discord

**During Conference:**

- Show QR on phone/laptop
- Share link in chat
- Add to badge

**After Conference:**

- See who scanned your profile
- Auto-create follow-ups
- Track conference connections

## Profile Features by Tier

### Free

- Basic profile (`@username`)
- GitHub auto-sync (bio, repos, socials)
- Basic QR code (black/white)
- Social links
- "Powered by DevHub" footer

### Pro ($15-20/mo)

- Custom QR design (colors, logo)
- Profile analytics (views, scans)
- Custom bio (override GitHub)
- Featured projects (pin specific repos)
- Remove DevHub branding
- Vanity slug (`/scott` instead of `/@spences10`)

### Premium ($30-40/mo)

- Custom domain (`scott.dev`)
- Advanced analytics (referrer tracking, conversion)
- Multiple profiles (work vs personal)
- White-label (no DevHub branding)
- Connection requests/messaging (if we add social features)

## Profile Analytics

**What We Track:**

- Total views
- QR scans
- Referrer sources (Twitter, conference, etc.)
- Conversion to signup
- Geographic data (conferences)

**User Dashboard:**

```
Your Profile Performance:
- 234 views this month (+45%)
- 89 QR scans
- 23 people added you to their CRM
- Top referrer: Twitter (45%)
- Peak activity: Conference days
```

## Growth Projections

**Month 1:** 100 users → 150 (via friend shares) **Month 2:** 150 →
300 (2x from profiles) **Month 3:** 300 → 750 (2.5x from conference
season) **Month 6:** 750 → 3,000+ (viral coefficient >1.5)

**Key Assumption:** Each active user shares profile → 2-3 signups over
6 months

## Additional Profile Features (Future)

**Profile Widgets:**

- Embed on personal website
- Show mini profile + QR
- Drives traffic to DevHub

**Conference Mode:**

- Special badge: "At [Conference Name]"
- Auto-tag people who scan during event
- Post-event report

**Mutual Add:**

- You scan me → added to your CRM
- I scan you → added to my CRM
- Both get notification
- Mutual connection = higher priority

**Profile Customization (Premium):**

- Custom themes/colors
- Video intro (Loom embed)
- Featured blog posts
- Testimonials/recommendations
- Calendar link (Calendly)

## Privacy Controls

**Profile Visibility:**

- Fully public (default)
- Public but unlisted (need direct link)
- Private (DevHub users only)
- Disabled (don't want public profile)

**What's Shown:**

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

**Viral Coefficient:**

- Target: >1.5 (each user brings 1.5 new users)
- Measure: signups attributed to profile scans
- Goal: Self-sustaining growth by month 6
