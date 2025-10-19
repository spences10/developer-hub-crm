<script lang="ts">
	interface Props {
		current_theme: string;
	}

	const { current_theme }: Props = $props();

	const theme_colors = [
		{ class: 'bg-primary', label: 'Primary' },
		{ class: 'bg-secondary', label: 'Secondary' },
		{ class: 'bg-accent', label: 'Accent' },
		{ class: 'bg-neutral', label: 'Neutral' },
		{ class: 'bg-base-100', label: 'Background' },
	];
</script>

{#if current_theme}
	<div class="mt-6">
		<p class="mb-3 text-sm font-medium">Theme Colors</p>
		<div class="flex flex-wrap gap-4">
			{#each theme_colors as color}
				<div class="flex flex-col items-center gap-2">
					<div
						class="h-12 w-12 rounded-full border-2 border-base-300 {color.class}"
					></div>
					<span class="text-xs">{color.label}</span>
				</div>
			{/each}
		</div>
	</div>
{/if}
