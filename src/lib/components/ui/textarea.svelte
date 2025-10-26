<script lang="ts">
	import type { AttachmentFn } from '$lib/utils/keyboard-attachments';

	interface Props {
		name?: string;
		value?: string;
		placeholder?: string;
		rows?: number;
		required?: boolean;
		disabled?: boolean;
		class_name?: string;
		maxlength?: number;
		onblur?: (
			e: FocusEvent & { currentTarget: HTMLTextAreaElement },
		) => void;
		oninput?: (
			e: Event & { currentTarget: HTMLTextAreaElement },
		) => void;
		onchange?: (
			e: Event & { currentTarget: HTMLTextAreaElement },
		) => void;
		attachment?: AttachmentFn;
	}

	let {
		name = undefined,
		value = $bindable(''),
		placeholder = '',
		rows = 4,
		required = false,
		disabled = false,
		class_name = '',
		maxlength = undefined,
		onblur = undefined,
		oninput = undefined,
		onchange = undefined,
		attachment = undefined,
	}: Props = $props();

	const base_classes = 'textarea w-full';
	const computed_classes = $derived(
		[base_classes, class_name].filter(Boolean).join(' '),
	);
</script>

<textarea
	{name}
	bind:value
	{placeholder}
	{rows}
	{required}
	{disabled}
	{maxlength}
	{onblur}
	{oninput}
	{onchange}
	class={computed_classes}
	{@attach attachment}
></textarea>
