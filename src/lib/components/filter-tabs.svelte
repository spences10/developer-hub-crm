<script lang="ts" generics="T extends string">
	import { Button } from './ui';

	interface Props {
		options: readonly T[];
		active_filter: T;
		on_filter_change: (filter: T) => void;
	}

	let { options, active_filter, on_filter_change }: Props = $props();
</script>

<div class="tabs-box mb-6 tabs">
	{#each options as option}
		<Button
			variant="ghost"
			class_name="tab {active_filter === option ? 'tab-active' : ''}"
			onclick={() => on_filter_change(option)}
		>
			{option.charAt(0).toUpperCase() + option.slice(1)}
		</Button>
	{/each}
</div>
