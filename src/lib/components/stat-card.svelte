<script lang="ts">
	import type { Component } from 'svelte';

	interface Props {
		icon: Component;
		icon_color?: string;
		icon_size?: string;
		value: number | string;
		value_color?: string;
		label: string;
		sublabel?: string | null;
		sublabel_color?: string;
	}

	let {
		icon: Icon,
		icon_color = '',
		icon_size = '28px',
		value,
		value_color = '',
		label,
		sublabel = null,
		sublabel_color = '',
	}: Props = $props();
</script>

<div class="card border border-base-300 bg-base-100 shadow">
	<div class="card-body p-4 text-center">
		<div class="mb-2 flex items-center justify-center">
			<Icon size={icon_size} class_names={icon_color} />
		</div>
		<div class="mb-1 text-2xl font-extrabold {value_color}">
			{value}
		</div>
		<div class="text-xs font-semibold opacity-70">
			{label}
		</div>
		{#if sublabel}
			<div class="text-xs {sublabel_color}">
				{sublabel}
			</div>
		{/if}
	</div>
</div>
