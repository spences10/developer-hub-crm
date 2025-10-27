<script lang="ts">
	import StatCard from '$lib/components/stat-card.svelte';
	import type { Component } from 'svelte';

	interface StatCardData {
		icon: Component;
		icon_color: string;
		value: number | string;
		value_color: string;
		label: string;
		sublabel: string | null;
		sublabel_color: string;
	}

	interface Props {
		stats_cards: StatCardData[];
	}

	let { stats_cards }: Props = $props();
</script>

<div class="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
	{#each stats_cards as stat}
		<StatCard
			icon={stat.icon}
			icon_color={stat.icon_color}
			value={stat.value}
			value_color={stat.value_color}
			label={stat.label}
			sublabel={stat.sublabel}
			sublabel_color={stat.sublabel_color}
		/>
	{/each}
</div>
