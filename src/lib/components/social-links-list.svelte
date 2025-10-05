<script lang="ts">
	import SocialLinkIcon from './social-link.svelte';

	interface SocialLink {
		id?: string;
		platform: string;
		url: string;
	}

	interface Props {
		links: SocialLink[];
		editable?: boolean;
		on_remove?: (id_or_index: string | number) => void;
	}

	let { links, editable = false, on_remove }: Props = $props();
</script>

{#if links.length > 0}
	<div class="rounded-box bg-base-200 p-4">
		<p class="mb-3 text-sm font-medium">
			Social Links{editable ? '' : ''}
		</p>
		<div class="space-y-2">
			{#each links as link, i}
				<div class="flex items-center justify-between gap-2">
					<div class="flex items-center gap-2">
						<SocialLinkIcon platform={link.platform} />
						<span class="text-sm font-medium">
							{link.platform}:
						</span>
						<a
							href={link.url}
							target="_blank"
							rel="noopener noreferrer"
							class="link text-sm link-primary"
						>
							{link.url}
						</a>
					</div>
					{#if editable && on_remove}
						<button
							type="button"
							onclick={() => on_remove?.(link.id || i)}
							class="btn btn-ghost btn-xs"
						>
							Remove
						</button>
					{/if}
				</div>
			{/each}
		</div>
	</div>
{/if}
