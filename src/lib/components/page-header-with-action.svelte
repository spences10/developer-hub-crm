<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		children?: Snippet;
	}

	let { title, children }: Props = $props();
</script>

<div class="mb-8 flex items-center justify-between">
	<h1 class="text-3xl font-bold">{title}</h1>
	{#if children}
		{@render children()}
	{/if}
</div>
