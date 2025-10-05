<script lang="ts">
	interface Props {
		message: string;
		action_href?: string;
		action_text?: string;
	}

	let { message, action_href, action_text }: Props = $props();
</script>

<div class="py-12 text-center">
	<p class="text-lg opacity-70">{message}</p>
	{#if action_href && action_text}
		<a href={action_href} class="btn mt-4 btn-primary">
			{action_text}
		</a>
	{/if}
</div>
