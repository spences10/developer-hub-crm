<script lang="ts">
	import { GitHub } from '$lib/icons';

	interface Props {
		github_username: string | null;
	}

	let { github_username }: Props = $props();
</script>

{#if github_username}
	<div
		class="card overflow-hidden border border-base-300 bg-gradient-to-br from-base-100 to-base-200 shadow-xl"
	>
		<div class="card-body">
			<h2 class="mb-4 card-title flex items-center gap-2">
				<GitHub size="24px" />
				GitHub Profile
			</h2>
			<div class="space-y-3">
				<a
					href="https://github.com/{github_username}"
					target="_blank"
					rel="noopener noreferrer"
					class="btn btn-block gap-2 btn-outline"
				>
					<GitHub size="20px" />
					@{github_username}
				</a>
				<p class="text-xs opacity-70">
					View their repositories, contributions, and activity on
					GitHub
				</p>
			</div>
		</div>
	</div>
{/if}
