<script lang="ts">
	interface Props {
		name?: string;
		checked?: boolean;
		disabled?: boolean;
		class_name?: string;
		label?: string;
		aria_label?: string;
		onchange?: (
			e: Event & { currentTarget: HTMLInputElement },
		) => void;
	}

	let {
		name = undefined,
		checked = $bindable(false),
		disabled = false,
		class_name = '',
		label = '',
		aria_label = undefined,
		onchange = undefined,
	}: Props = $props();

	const base_classes = 'checkbox';
	const computed_classes = $derived(
		[base_classes, class_name].filter(Boolean).join(' '),
	);
</script>

{#if label}
	<label class="flex cursor-pointer items-center gap-2">
		<input
			type="checkbox"
			{name}
			bind:checked
			{disabled}
			aria-label={aria_label}
			{onchange}
			class={computed_classes}
		/>
		<span>{label}</span>
	</label>
{:else}
	<input
		type="checkbox"
		{name}
		bind:checked
		{disabled}
		aria-label={aria_label}
		{onchange}
		class={computed_classes}
	/>
{/if}
