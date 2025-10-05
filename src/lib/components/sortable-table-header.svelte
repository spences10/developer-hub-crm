<script lang="ts" generics="T extends string">
	interface Props {
		label: string;
		column: T;
		current_sort: T;
		sort_direction: 'asc' | 'desc';
		on_toggle: (column: T) => void;
	}

	let {
		label,
		column,
		current_sort,
		sort_direction,
		on_toggle,
	}: Props = $props();
</script>

<th>
	<button
		onclick={() => on_toggle(column)}
		class="flex items-center gap-1 hover:underline"
	>
		{label}
		{#if current_sort === column}
			{#if sort_direction === 'asc'}
				↑
			{:else}
				↓
			{/if}
		{/if}
	</button>
</th>
