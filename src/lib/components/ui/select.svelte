<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		name?: string;
		value?: string;
		required?: boolean;
		disabled?: boolean;
		class_name?: string;
		aria_label?: string;
		onchange?: (e: Event) => void;
		children: Snippet;
	}

	let {
		name = undefined,
		value = $bindable(''),
		required = false,
		disabled = false,
		class_name = '',
		aria_label = undefined,
		onchange = undefined,
		children,
	}: Props = $props();

	const base_classes = 'select w-full';
	const computed_classes = $derived(
		[base_classes, class_name].filter(Boolean).join(' '),
	);
</script>

<select
	{name}
	bind:value
	{required}
	{disabled}
	aria-label={aria_label}
	{onchange}
	class={computed_classes}
>
	{@render children()}
</select>
