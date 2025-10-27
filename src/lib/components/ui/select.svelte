<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLSelectAttributes } from 'svelte/elements';

	interface Props extends HTMLSelectAttributes {
		value?: string;
		children: Snippet;
	}

	let {
		value = $bindable(''),
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const base_classes = 'select w-full';
	const computed_classes = $derived(
		[base_classes, className].filter(Boolean).join(' '),
	);
</script>

<select bind:value class={computed_classes} {...restProps}>
	{@render children()}
</select>
