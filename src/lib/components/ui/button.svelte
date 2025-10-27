<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		type?: 'button' | 'submit';
		variant?: 'primary' | 'outline' | 'ghost' | 'error' | 'success';
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'block';
		loading?: boolean;
		disabled?: boolean;
		class_name?: string;
		aria_label?: string;
		onclick?: () => void;
		children: Snippet;
	}

	let {
		type = 'button',
		variant = 'primary',
		size = 'md',
		loading = false,
		disabled = false,
		class_name = '',
		aria_label = undefined,
		onclick,
		children,
	}: Props = $props();

	const base_classes = 'btn';

	const variant_classes = $derived(
		{
			primary: 'btn-primary',
			outline: 'btn-outline',
			ghost: 'btn-ghost',
			error: 'btn-error',
			success: 'btn-success',
		}[variant],
	);

	const size_classes = $derived(
		{
			xs: 'btn-xs',
			sm: 'btn-sm',
			md: '',
			lg: 'btn-lg',
			block: 'btn-block',
		}[size],
	);

	const computed_classes = $derived(
		[base_classes, variant_classes, size_classes, class_name]
			.filter(Boolean)
			.join(' '),
	);
</script>

<button
	{type}
	disabled={disabled || loading}
	class={computed_classes}
	aria-label={aria_label}
	{onclick}
>
	{#if loading}
		<span class="loading loading-sm loading-spinner"></span>
		Loading...
	{:else}
		{@render children()}
	{/if}
</button>
