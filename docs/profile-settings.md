# Profile Settings

User profile management for personal information, public profiles, and
account settings.

## Overview

The profile settings page (`/profile`) allows users to manage their
personal information and public developer profile. This is separate
from app preferences (`/settings`) which control application behavior
like themes and date formats.

## What's Included

The profile page combines data from multiple database tables:

- **Basic Info** (`user` table) - Name, email, profile picture
- **Public Profile** (`user_profiles` table) - Username, bio, tagline,
  location, website, visibility
- **Social Links** (`user_social_links` table) - GitHub, Twitter,
  LinkedIn, Bluesky, Mastodon, personal websites
- **QR Code** - Generated QR code linking to public profile
- **GitHub Integration** (`account` table) - OAuth connection status

## Features

### Personal Information

Users can update their basic account details:

- **Name** - Display name shown throughout the app
- **Email** - Login email and contact address
- **Profile Picture** - Avatar image (currently managed via Better
  Auth)

### Public Profile

Information displayed on the user's public developer profile
(`devhub.party/@username`):

- **Username** - Unique handle (3-30 characters, alphanumeric,
  hyphens, underscores)
- **Tagline** - Professional title or one-line description
- **Bio** - Longer description or about section
- **Location** - City, country, or region
- **Website** - Personal website or portfolio URL

### Social Links

Users can add multiple social media profiles:

- **Supported Platforms:**
  - GitHub
  - Twitter/X
  - Bluesky
  - LinkedIn
  - Mastodon
  - Website (generic)

Links are displayed on the public profile and can be added/removed at
any time.

### Profile QR Code

Each user gets a unique QR code that links to their public profile:

- Auto-generates on page load if not already created
- Can be regenerated at any time
- Stored as data URL in database
- Links to `devhub.party/@username?qr=1` for tracking
- Intended for business cards, conference badges, email signatures

**Use cases:**

- Conference networking
- Digital business card
- GitHub README
- Email signature
- Social media profiles

### Privacy Controls

Users can control profile visibility:

- **Public** - Anyone can view the profile
- **Unlisted** - Only people with the direct link can view
- **Private** - Only logged-in Devhub users can view

### GitHub Integration

Shows GitHub OAuth connection status:

- **Connected:** Displays GitHub username, option to disconnect
- **Not Connected:** Link to connect via GitHub OAuth
- Disconnecting removes GitHub account link and clears
  `github_username`

### Account Deletion

Self-service account deletion with safety measures:

- **Confirmation Text** - User must type "DELETE" to confirm (no
  password required since user is already authenticated)
- **Permanent Action** - All data is deleted immediately and cannot be
  recovered
- **Data Removal** - Deletes all contacts, interactions, follow-ups,
  tags, preferences, profile, and social links via CASCADE DELETE
- **Demo Account Protection** - Demo account cannot be deleted
- **Auto Sign-out** - User is signed out before deletion
- **Client-side Navigation** - After deletion, user is navigated to
  home page via `goto()`

## Database Schema

### user_profiles Table

```sql
CREATE TABLE user_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  github_username TEXT,
  bio TEXT,
  tagline TEXT,
  location TEXT,
  website TEXT,
  visibility TEXT NOT NULL DEFAULT 'public',
  qr_code_url TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);
```

### user_social_links Table

```sql
CREATE TABLE user_social_links (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);
```

## Implementation

### Remote Functions

Located in `src/routes/(app)/profile/profile.remote.ts`:

**Queries:**

- `get_user_profile()` - Returns complete profile (user +
  user_profiles)
- `get_user_social_links()` - Returns all social links for user
- `get_github_connection_status()` - Checks if GitHub is connected
- `get_user_qr_code()` - Returns QR code data URL
- `get_profile_qr_url()` - Returns public profile URL for QR
  generation

**Forms:**

- `update_basic_info()` - Updates name and email
- `update_profile_details()` - Updates username, bio, tagline,
  location, website

**Commands:**

- `update_visibility()` - Changes profile visibility setting
- `add_user_social_link()` - Adds a new social link
- `delete_user_social_link()` - Removes a social link
- `disconnect_github()` - Disconnects GitHub OAuth
- `save_qr_code()` - Saves generated QR code data URL
- `delete_account()` - Permanently deletes user account and all
  related data

### Component Usage

```svelte
<script lang="ts">
	import {
		get_user_profile,
		get_user_social_links,
		update_basic_info,
		update_profile_details,
	} from './profile.remote';

	const profile = get_user_profile();
	const social_links = get_user_social_links();
</script>

{#await profile then profile_data}
	<form {...update_basic_info}>
		<input
			type="text"
			name="name"
			value={profile_data.name}
			required
		/>
		<input
			type="email"
			name="email"
			value={profile_data.email}
			required
		/>
		<button type="submit">Update</button>
	</form>
{/await}
```

## Validation Rules

### Username

- **Length:** 3-30 characters
- **Allowed:** Letters, numbers, hyphens, underscores
- **Uniqueness:** Must be unique across all users
- **Pattern:** `/^[a-zA-Z0-9_-]+$/`

### Website

- Must be a valid URL format
- Validated with Valibot's `v.url()` schema

### Social Links

- **Platform:** Required, non-empty string
- **URL:** Required, must be valid URL format

## User Experience

### Profile Updates

All profile updates use an auto-save pattern:

1. User modifies form field
2. Form submission updates database
3. Success indicator shown briefly
4. Form refreshes with new data

### Social Links

Social links use a refresh key pattern for reactivity:

```svelte
let refresh_key = $state(0);

async function handle_add_link() {
	await add_user_social_link({ platform, url });
	refresh_key++; // Triggers re-fetch
}
```

### QR Code Generation

QR codes are generated on the client side:

1. Server provides profile URL (`/@username?qr=1`)
2. Client generates QR code data URL using `qrcode` library
3. Client uploads data URL to server
4. Server stores in `user_profiles.qr_code_url`

## Navigation

Profile settings are accessible via:

- Navigation menu (Profile link with User icon)
- Direct URL: `/profile`
- Listed between "Follow-ups" and "Settings" in PageNav

## Future Enhancements

### Planned Features

- **Profile Picture Upload** - Direct image upload vs Better Auth
  default
- **Password Change** - In-app password reset
- **Email Verification** - Re-send verification, change email workflow
- **Social Link Icons** - Reuse/adapt `social-links-manager.svelte`
  component
- **Profile Preview** - Live preview of public profile
- **Custom Domains** - Premium feature for `user.com` instead of
  `devhub.party/@user`
- **Account Deletion Grace Period** - Optional soft delete with 30-day
  recovery window
- **Data Export** - Export user data before deletion

### Potential Improvements

- Validate GitHub username format
- Preview public profile before saving
- Bulk social link import
- Profile completion percentage
- Profile analytics (views, QR scans) - see
  [public-profiles.md](./public-profiles.md)

## Related Documentation

- [public-profiles.md](./public-profiles.md) - Public profile features
  and viral growth strategy
- [auth-usage.md](./auth-usage.md) - Authentication patterns and
  protected routes
- [database-pattern.md](./database-pattern.md) - Database operations
  and query patterns
- [github-integration.md](./github-integration.md) - GitHub OAuth and
  API integration

## Differences: Profile vs Settings

**Profile Settings (`/profile`):**

- Personal/public information
- Who you are (identity)
- What others see
- Stored in: `user`, `user_profiles`, `user_social_links`

**App Settings (`/settings`):**

- Application preferences
- How the app behaves
- What you prefer
- Stored in: `user_preferences`, localStorage (theme)

## Key Points

1. **Separate Concerns** - Profile for identity, Settings for
   preferences
2. **Username Uniqueness** - Enforced at database and application
   level
3. **QR Code Management** - Client-side generation, server-side
   storage
4. **Social Links** - Separate table for flexibility and scalability
5. **Privacy First** - Visibility controls built in from day one
6. **GitHub Integration** - OAuth via Better Auth, managed at profile
   level
7. **Account Deletion** - Self-service with password verification and
   CASCADE DELETE for data cleanup
8. **Future-Proof** - Schema supports planned features (custom
   domains, analytics)
