import { GITHUB_ID, GITHUB_SECRET } from '$env/static/private';
import { redis } from '$lib/redis';
import GitHub, {
	type GitHubProfile,
} from '@auth/core/providers/github';
import { SvelteKitAuth } from '@auth/sveltekit';
import { UpstashRedisAdapter } from '@auth/upstash-redis-adapter';

export const handle = SvelteKitAuth({
	adapter: UpstashRedisAdapter(redis),
	providers: [
		GitHub({
			clientId: GITHUB_ID,
			clientSecret: GITHUB_SECRET,
			profile(profile: GitHubProfile) {
				return {
					id: profile.id.toString(),
					name: profile.name ?? null,
					email: profile.email ?? null,
					avatar: profile.avatar_url,
				};
			},
		}),
	],
});
