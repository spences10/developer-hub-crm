<script lang="ts">
	interface Props {
		name: string;
		value: string;
		checked?: boolean;
		disabled?: boolean;
		class_name?: string;
		label?: string;
		aria_label?: string;
		onchange?: (e: Event) => void;
	}

	let {
		name,
		value,
		checked = false,
		disabled = false,
		class_name = '',
		label = '',
		aria_label = undefined,
		onchange = undefined,
	}: Props = $props();

	const base_classes = 'radio radio-primary';
	const computed_classes = $derived(
		[base_classes, class_name].filter(Boolean).join(' '),
	);
</script>

{#if label}
	<label class="flex cursor-pointer items-center gap-2">
		<input
			type="radio"
			{name}
			{value}
			{checked}
			{disabled}
			aria-label={aria_label}
			{onchange}
			class={computed_classes}
		/>
		<span>{label}</span>
	</label>
{:else}
	<input
		type="radio"
		{name}
		{value}
		{checked}
		{disabled}
		aria-label={aria_label}
		{onchange}
		class={computed_classes}
	/>
{/if}
