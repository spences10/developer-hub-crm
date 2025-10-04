# External Integrations

## GitHub Contact Import

The GitHub contact import feature allows you to quickly add developers
from GitHub as contacts by fetching their public profile data.

### Implementation

Located in `src/lib/server/github.ts`:

```typescript
import { fetch_github_contact } from '$lib/server/github';

// In contacts.remote.ts
export const fetch_github_data = guarded_command(
	v.pipe(v.string(), v.minLength(1, 'GitHub username is required')),
	async (username: string) => {
		const contact_data = await fetch_github_contact(username);

		if (!contact_data) {
			return { error: 'GitHub user not found' };
		}

		return { success: true, data: contact_data };
	},
);
```

### Data Mapping

GitHub profile data maps to contact fields as follows:

- **name**: `profile.name` or `profile.login` (fallback)
- **email**: `profile.email` (if public)
- **company**: `profile.company`
- **github_username**: `profile.login`
- **notes**: Combines bio, location, blog, and GitHub stats

### Usage in Components

```svelte
<script lang="ts">
	import { fetch_github_data } from '../contacts.remote';

	let github_username = $state('');
	let loading = $state(false);

	async function import_from_github() {
		if (!github_username) return;

		loading = true;
		const result = await fetch_github_data(github_username);
		loading = false;

		if (result.error) {
			// Handle error
			return;
		}

		// Pre-fill form with GitHub data
		name = result.data.name;
		email = result.data.email || '';
		company = result.data.company || '';
		github_username_field = result.data.github_username;
		notes = result.data.notes;
	}
</script>
```

### API Details

The GitHub API endpoint used:

- **URL**: `https://api.github.com/users/{username}`
- **Method**: GET
- **Headers**:
  - `Accept: application/vnd.github.v3+json`
  - `User-Agent: Developer-Hub-CRM`
- **Rate Limit**: 60 requests/hour (unauthenticated)

### Error Handling

The integration handles:

- 404 errors (user not found) - returns `null`
- API errors - logs and returns `null`
- Empty username - returns `null`
- Network errors - logs and returns `null`

### Extending the Integration

To add GitHub authentication for higher rate limits:

1. Add GitHub OAuth app credentials to `.env`:

   ```env
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   ```

2. Update fetch call with auth header:
   ```typescript
   headers: {
     Authorization: `token ${GITHUB_TOKEN}`,
     Accept: 'application/vnd.github.v3+json',
   }
   ```

This increases rate limit to 5,000 requests/hour.

### Future Enhancements

Potential improvements:

- Fetch recent activity/repositories
- Import organizations as companies
- Sync profile updates automatically
- Add avatar/photo support
- Fetch social links (Twitter, LinkedIn, etc.)
