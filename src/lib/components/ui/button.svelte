<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		variant?: 'primary' | 'outline' | 'ghost' | 'error' | 'success';
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'block';
		loading?: boolean;
		ref?: HTMLButtonElement | null;
		children: Snippet;
	}

	let {
		class: className = '',
		type = 'button',
		variant = 'primary',
		size = 'md',
		loading = false,
		disabled = false,
		ref = $bindable(null),
		children,
		...restProps
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
		[base_classes, variant_classes, size_classes, className]
			.filter(Boolean)
			.join(' '),
	);
</script>

<button
	bind:this={ref}
	{type}
	disabled={disabled || loading}
	class={computed_classes}
	{...restProps}
>
	{#if loading}
		<span class="loading loading-sm loading-spinner"></span>
		Loading...
	{:else}
		{@render children()}
	{/if}
</button>
