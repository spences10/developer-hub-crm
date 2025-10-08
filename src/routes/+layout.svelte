<script lang="ts">
	import { Head } from 'svead';
	import favicon from '$lib/assets/favicon.svg';
	import { seo_configs } from '$lib/seo';
	import '../app.css';

	let { children } = $props();
</script>

<Head seo_config={seo_configs.home} />

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
