<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import {
		PUBLIC_FATHOM_ID,
		PUBLIC_FATHOM_URL,
	} from '$env/static/public';
	import favicon from '$lib/assets/favicon.svg';
	import { seo_configs } from '$lib/seo';
	import * as Fathom from 'fathom-client';
	import { Head } from 'svead';
	import { onMount } from 'svelte';
	import '../app.css';

	let { children } = $props();

	onMount(() => {
		Fathom.load(PUBLIC_FATHOM_ID, {
			url: PUBLIC_FATHOM_URL,
		});
	});

	// Track pageview on route change
	$effect(() => {
		(page.url.pathname, browser && Fathom.trackPageview());
	});
</script>

<Head seo_config={seo_configs.home} />

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
