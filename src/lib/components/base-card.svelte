<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		// Card variants
		variant?:
			| 'default'
			| 'stat'
			| 'elevated'
			| 'bordered'
			| 'gradient';
		// Optional convenience props for quick header creation
		icon?: Component;
		icon_size?: string;
		title?: string;
		// Styling props (can be overridden via class)
		shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none';
		background?: string;
		// Flexible snippets for complete control
		header?: Snippet;
		body?: Snippet;
		footer?: Snippet;
		actions?: Snippet;
		// Fallback snippet (for backward compat)
		children?: Snippet;
		// Custom classes
		card_class?: string;
		body_class?: string;
	}

	let {
		variant = 'default',
		icon: Icon,
		icon_size = '24px',
		title,
		shadow = 'xl',
		background = 'bg-base-100',
		header,
		body,
		footer,
		actions,
		children,
		card_class = '',
		body_class = '',
		class: className = '',
		...restProps
	}: Props = $props();

	const variant_classes = $derived(
		{
			default: '',
			stat: 'text-center',
			elevated: 'shadow-2xl',
			bordered: 'border border-base-300',
			gradient:
				'overflow-hidden border border-base-300 bg-gradient-to-br from-base-100 to-base-200',
		}[variant],
	);

	const applied_shadow = $derived(
		variant === 'elevated' && shadow === 'xl' ? 'none' : shadow,
	);

	const shadow_class = $derived(
		applied_shadow === 'none' ? '' : `shadow-${applied_shadow}`,
	);

	const card_classes = $derived(
		[
			'card',
			background,
			shadow_class,
			variant_classes,
			card_class,
			className,
		]
			.filter(Boolean)
			.join(' '),
	);

	// Determine if we're using the legacy children pattern or new snippet pattern
	const has_snippets = $derived(
		!!(header || body || footer || actions),
	);
</script>

<div class={card_classes} {...restProps}>
	{#if has_snippets}
		<!-- New snippet-based API -->
		{#if header}
			<div class="card-body {body_class}">
				{@render header()}
			</div>
		{/if}
		{#if body}
			<div class="card-body {body_class}">
				{@render body()}
			</div>
		{/if}
		{#if footer}
			<div class="card-body {body_class}">
				{@render footer()}
			</div>
		{/if}
		{#if actions}
			<div class="card-actions">
				{@render actions()}
			</div>
		{/if}
	{:else}
		<!-- Legacy API for backward compat: single card-body with optional header -->
		<div class="card-body {body_class}">
			{#if Icon && title}
				<div class="mb-4 flex items-center justify-between">
					<h2 class="card-title flex items-center gap-2">
						<Icon size={icon_size} />
						{title}
					</h2>
				</div>
			{/if}
			{#if children}
				{@render children()}
			{/if}
		</div>
	{/if}
</div>
