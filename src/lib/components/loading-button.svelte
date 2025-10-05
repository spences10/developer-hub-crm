<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		loading: boolean;
		disabled?: boolean;
		type?: 'button' | 'submit';
		class_names?: string;
		loading_text?: string;
		onclick?: () => void;
		children: Snippet;
	}

	let {
		loading,
		disabled = false,
		type = 'button',
		class_names = 'btn',
		loading_text,
		onclick,
		children,
	}: Props = $props();
</script>

<button
	{type}
	disabled={disabled || loading}
	class={class_names}
	{onclick}
>
	{#if loading}
		<span class="loading loading-sm loading-spinner"></span>
		{loading_text || 'Loading...'}
	{:else}
		{@render children()}
	{/if}
</button>
