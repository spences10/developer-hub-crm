<script lang="ts">
	import type { Component } from 'svelte';

	let {
		icon: Icon,
		title,
		description,
		stagger = '3',
	}: {
		icon?: Component;
		title: string;
		description: string;
		stagger?: string;
	} = $props();
</script>

<div
	class="animate-fade-in-up stagger-{stagger} flex items-start gap-4 rounded-xl border border-primary-content/20 bg-primary-content/10 p-4 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl"
>
	{#if Icon}
		<Icon
			size="24px"
			class_names="mt-0.5 flex-shrink-0 text-primary-content drop-shadow"
		/>
	{/if}
	<div>
		<h3 class="mb-1 text-lg font-bold text-primary-content">
			{title}
		</h3>
		<p class="leading-relaxed text-primary-content/90">
			{description}
		</p>
	</div>
</div>
