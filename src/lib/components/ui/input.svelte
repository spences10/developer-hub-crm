<script lang="ts">
	import type { AttachmentFn } from '$lib/utils/keyboard-attachments';

	interface Props {
		type?: string;
		name?: string;
		value?: string | number;
		placeholder?: string;
		required?: boolean;
		disabled?: boolean;
		validator?: boolean;
		class_name?: string;
		minlength?: number;
		maxlength?: number;
		min?: number;
		max?: number;
		onblur?: (
			e: FocusEvent & { currentTarget: HTMLInputElement },
		) => void;
		oninput?: (
			e: Event & { currentTarget: HTMLInputElement },
		) => void;
		onchange?: (
			e: Event & { currentTarget: HTMLInputElement },
		) => void;
		attachment?: AttachmentFn;
	}

	let {
		type = 'text',
		name = undefined,
		value = $bindable(),
		placeholder = '',
		required = false,
		disabled = false,
		validator = false,
		class_name = '',
		minlength = undefined,
		maxlength = undefined,
		min = undefined,
		max = undefined,
		onblur = undefined,
		oninput = undefined,
		onchange = undefined,
		attachment = undefined,
	}: Props = $props();

	const base_wrapper_classes = 'input w-full';
	const wrapper_classes = $derived(
		validator
			? `validator ${base_wrapper_classes}`
			: base_wrapper_classes,
	);

	const input_classes = $derived(
		['grow', class_name].filter(Boolean).join(' '),
	);
</script>

<label class={wrapper_classes}>
	<input
		{type}
		{name}
		bind:value
		{placeholder}
		{required}
		{disabled}
		{minlength}
		{maxlength}
		{min}
		{max}
		{onblur}
		{oninput}
		{onchange}
		class={input_classes}
		{@attach attachment}
	/>
</label>
