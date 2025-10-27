<script lang="ts">
	import type { AttachmentFn } from '$lib/utils/keyboard-attachments';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		value?: string | number;
		attachment?: AttachmentFn;
	}

	let {
		type = 'text',
		value = $bindable(),
		class: className = '',
		attachment = undefined,
		...restProps
	}: Props = $props();

	const base_classes = 'input w-full';
	const computed_classes = $derived(
		[base_classes, className].filter(Boolean).join(' '),
	);
</script>

<input
	{type}
	bind:value
	class={computed_classes}
	{@attach attachment}
	{...restProps}
/>
