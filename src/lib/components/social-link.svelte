<script lang="ts">
	import {
		Bluesky,
		Globe,
		Link,
		LinkedIn,
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
{:else if platform === 'website'}
	<Globe />
{:else}
	<Link />
{/if}
