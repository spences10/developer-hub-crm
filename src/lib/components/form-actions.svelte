<script lang="ts">
	interface Props {
		submit_text: string;
		cancel_href: string;
		submitting?: boolean;
		submit_class?: string;
	}

	let {
		submit_text,
		cancel_href,
		submitting = false,
		submit_class = 'btn flex-1 btn-primary',
	}: Props = $props();
</script>

<div class="flex gap-4">
	<button class={submit_class} type="submit" disabled={submitting}>
		{submitting ? 'Saving...' : submit_text}
	</button>
	<a href={cancel_href} class="btn btn-ghost">Cancel</a>
</div>
