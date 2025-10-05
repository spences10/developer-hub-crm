<script lang="ts">
	import {
		add_social_link,
		delete_social_link,
	} from '../../routes/(app)/contacts/contacts.remote';
	import SocialLinkIcon from './social-link.svelte';

	interface SocialLink {
		id: string;
		platform: string;
		url: string;
	}

	interface Props {
		contact_id: string;
		social_links: SocialLink[];
		on_change: () => void;
	}

	let { contact_id, social_links, on_change }: Props = $props();

	// New social link state
	let new_platform = $state('');
	let new_url = $state('');
	let adding_link = $state(false);

	async function handle_add_social_link() {
		if (!contact_id || !new_platform || !new_url) return;

		adding_link = true;
		try {
			await add_social_link({
				contact_id,
				platform: new_platform,
				url: new_url,
			});
			new_platform = '';
			new_url = '';
			on_change();
		} catch (err) {
			console.error('Failed to add social link:', err);
		} finally {
			adding_link = false;
		}
	}

	async function handle_delete_social_link(link_id: string) {
		if (!confirm('Remove this social link?')) return;

		try {
			await delete_social_link(link_id);
			on_change();
		} catch (err) {
			console.error('Failed to delete social link:', err);
		}
	}
</script>

<div class="rounded-box bg-base-200 p-4">
	<p class="mb-3 text-sm font-medium">Social Links</p>

	<!-- Existing Social Links -->
	{#if social_links && social_links.length > 0}
		<div class="mb-4 space-y-2">
			{#each social_links as link}
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
					<button
						type="button"
						onclick={() => handle_delete_social_link(link.id)}
						class="btn btn-ghost btn-xs"
					>
						Remove
					</button>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Add New Social Link -->
	<div class="space-y-2">
		<p class="text-xs opacity-70">Add new social link</p>
		<div class="flex gap-2">
			<select
				bind:value={new_platform}
				class="select-bordered select select-sm"
			>
				<option value="">Select platform</option>
				<option value="twitter">Twitter/X</option>
				<option value="bluesky">Bluesky</option>
				<option value="linkedin">LinkedIn</option>
				<option value="website">Website</option>
			</select>
			<input
				type="url"
				placeholder="URL"
				bind:value={new_url}
				class="input-bordered input input-sm flex-1"
			/>
			<button
				type="button"
				onclick={handle_add_social_link}
				disabled={adding_link || !new_platform || !new_url}
				class="btn btn-sm btn-primary"
			>
				{#if adding_link}
					<span class="loading loading-sm loading-spinner"></span>
				{:else}
					Add
				{/if}
			</button>
		</div>
	</div>
</div>
