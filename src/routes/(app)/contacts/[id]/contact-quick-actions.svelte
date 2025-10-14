<script lang="ts">
	import type { Component } from 'svelte';

	interface ActionCard {
		href: string | null;
		border_color: string;
		bg_gradient: string;
		hover_border: string;
		icon_bg: string;
		icon: Component;
		icon_color: string;
		title: string;
		title_color: string;
		description: string;
		enabled: boolean;
	}

	interface Props {
		action_cards: ActionCard[];
	}

	let { action_cards }: Props = $props();
</script>

<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
	{#each action_cards as action}
		{#if action.enabled}
			<a
				href={action.href}
				class="card border {action.border_color} bg-gradient-to-br {action.bg_gradient} transition-all duration-200 {action.hover_border} hover:shadow-md"
			>
				<div class="card-body items-center p-6 text-center">
					<div class="mb-3 rounded-full {action.icon_bg} p-3">
						<action.icon
							size="28px"
							class_names={action.icon_color}
						/>
					</div>
					<h3
						class="card-title justify-center text-base {action.title_color}"
					>
						{action.title}
					</h3>
					<p class="text-xs opacity-70">
						{action.description}
					</p>
				</div>
			</a>
		{:else}
			<div
				class="card border {action.border_color} bg-base-200/50 opacity-50"
			>
				<div class="card-body items-center p-6 text-center">
					<div class="mb-3 rounded-full {action.icon_bg} p-3">
						<action.icon
							size="28px"
							class_names={action.icon_color}
						/>
					</div>
					<h3 class="card-title justify-center text-base">
						{action.title}
					</h3>
					<p class="text-xs opacity-70">
						{action.description}
					</p>
				</div>
			</div>
		{/if}
	{/each}
</div>
