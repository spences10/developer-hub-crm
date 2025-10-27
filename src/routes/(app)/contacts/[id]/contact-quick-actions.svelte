<script lang="ts">
	import type { Component } from 'svelte';

	interface ActionCard {
		href: string | null;
		icon: Component;
		icon_color: string;
		title: string;
		title_short: string;
		description: string;
		enabled: boolean;
	}

	interface Props {
		action_cards: ActionCard[];
	}

	let { action_cards }: Props = $props();
</script>

{#snippet action_card_content(action: ActionCard)}
	<div class="card-body items-center p-4 text-center md:p-6">
		<div class="mb-2 md:mb-3">
			<action.icon size="28px" class_names={action.icon_color} />
		</div>
		<h3
			class="card-title justify-center text-xs font-semibold opacity-70"
		>
			<span class="md:hidden">{action.title_short}</span>
			<span class="hidden md:inline">{action.title}</span>
		</h3>
		<p class="hidden text-xs opacity-70 md:block">
			{action.description}
		</p>
	</div>
{/snippet}

<div class="mb-6 flex gap-2 md:gap-4">
	{#each action_cards as action}
		{@const card_classes = `tooltip card flex-1 border border-base-300 bg-base-100 shadow ${
			action.enabled
				? 'transition-shadow duration-200 hover:shadow-lg'
				: 'cursor-not-allowed opacity-50'
		}`}

		{#if action.enabled}
			<a
				href={action.href}
				class={card_classes}
				data-tip={action.description}
			>
				{@render action_card_content(action)}
			</a>
		{:else}
			<div class={card_classes} data-tip={action.description}>
				{@render action_card_content(action)}
			</div>
		{/if}
	{/each}
</div>
