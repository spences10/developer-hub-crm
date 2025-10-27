<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Variant = 'subtle' | 'default' | 'bordered';
	type Padding = 'none' | 'sm' | 'md' | 'lg';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		variant?: Variant;
		padding?: Padding;
		children: Snippet;
	}

	let {
		variant = 'subtle' as Variant,
		padding = 'md' as Padding,
		children,
		class: className = '',
		...restProps
	}: Props = $props();

	const variant_classes = $derived(
		{
			subtle: 'rounded-box bg-base-200',
			default: 'rounded-box bg-base-100 shadow-sm',
			bordered: 'rounded-box border border-base-300 bg-base-100',
		}[variant],
	);

	const padding_classes = $derived(
		{
			none: '',
			sm: 'p-3',
			md: 'p-4',
			lg: 'p-6',
		}[padding],
	);

	const surface_classes = $derived(
		[variant_classes, padding_classes, className]
			.filter(Boolean)
			.join(' '),
	);
</script>

<div class={surface_classes} {...restProps}>
	{@render children()}
</div>
