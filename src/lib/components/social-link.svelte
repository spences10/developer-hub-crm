<script lang="ts">
	import {
		Bluesky,
		GitHub,
		Globe,
		Link,
		LinkedIn,
		Mastodon,
		Twitter,
	} from '$lib/icons';

	interface Props {
		platform: string;
	}

	let { platform }: Props = $props();
</script>

{#if platform === 'twitter'}
	<Twitter />
{:else if platform === 'bluesky'}
	<Bluesky />
{:else if platform === 'linkedin'}
	<LinkedIn />
{:else if platform === 'github'}
	<GitHub />
{:else if platform === 'mastodon'}
	<Mastodon />
{:else if platform === 'website'}
	<Globe />
{:else}
	<Link />
{/if}
