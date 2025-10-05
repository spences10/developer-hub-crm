<script lang="ts">
	interface Props {
		title: string;
		children: import('svelte').Snippet;
	}

	let { title, children }: Props = $props();
</script>

<div class="mb-8 flex items-center justify-between">
	<h1 class="text-3xl font-bold">{title}</h1>
	{@render children()}
</div>
