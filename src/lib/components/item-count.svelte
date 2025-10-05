<script lang="ts">
	interface Props {
		count: number;
		item_name: string;
	}

	let { count, item_name }: Props = $props();
</script>

<div class="mt-6 text-sm opacity-70">
	Showing {count}
	{item_name}{count !== 1 ? 's' : ''}
</div>
