<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		legend: string | Snippet;
		helper_text?: string;
		class_name?: string;
		children: Snippet;
	}

	let {
		legend,
		helper_text = '',
		class_name = '',
		children,
	}: Props = $props();

	const base_classes = 'fieldset';
	const computed_classes = $derived(
		[base_classes, class_name].filter(Boolean).join(' '),
	);
</script>

<fieldset class={computed_classes}>
	<legend class="fieldset-legend">
		{#if typeof legend === 'string'}
			{legend}
		{:else}
			{@render legend()}
		{/if}
	</legend>
	{@render children()}
	{#if helper_text}
		<p class="label">{helper_text}</p>
	{/if}
</fieldset>
