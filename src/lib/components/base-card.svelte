<script lang="ts">
	import type { Component, Snippet } from 'svelte';

	interface Props {
		// Optional icon and title for header
		icon?: Component;
		icon_size?: string;
		title?: string;
		// Card styling variants
		shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
		background?: string;
		border?: boolean;
		gradient?: boolean;
		// Content
		children: Snippet;
		// Optional header actions
		header_actions?: Snippet;
		// Custom classes
		card_class?: string;
		body_class?: string;
	}

	let {
		icon: Icon,
		icon_size = '24px',
		title,
		shadow = 'xl',
		background = 'bg-base-100',
		border = false,
		gradient = false,
		children,
		header_actions,
		card_class = '',
		body_class = '',
	}: Props = $props();

	const card_classes = `card ${background} shadow-${shadow} ${
		border ? 'border border-base-300' : ''
	} ${
		gradient
			? 'overflow-hidden border border-base-300 bg-gradient-to-br from-base-100 to-base-200'
			: ''
	} ${card_class}`;
</script>

<div class={card_classes}>
	<div class="card-body {body_class}">
		{#if Icon && title}
			<div class="mb-4 flex items-center justify-between">
				<h2 class="card-title flex items-center gap-2">
					<Icon size={icon_size} />
					{title}
				</h2>
				{#if header_actions}
					{@render header_actions()}
				{/if}
			</div>
		{/if}
		{@render children()}
	</div>
</div>
