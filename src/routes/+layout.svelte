<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import ThemeSelect from '$lib/components/theme-select.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ThemeSelect />

{@render children?.()}
