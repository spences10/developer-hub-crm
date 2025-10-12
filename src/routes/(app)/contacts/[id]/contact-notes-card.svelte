<script lang="ts">
	import { Lightbulb } from '$lib/icons';

	interface Props {
		notes: string | null;
	}

	let { notes }: Props = $props();
</script>

{#if notes}
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="mb-4 card-title flex items-center gap-2">
				<Lightbulb size="24px" />
				Notes
			</h2>
			<p class="text-sm whitespace-pre-wrap">
				{notes}
			</p>
		</div>
	</div>
{/if}
