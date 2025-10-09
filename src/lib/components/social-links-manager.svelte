<script lang="ts">
	import { Trash } from '$lib/icons';
	import ConfirmDialog from './confirm-dialog.svelte';
	import SocialLinkIcon from './social-link.svelte';

	interface SocialLink {
		id: string;
		platform: string;
		url: string;
	}

	interface Props {
		social_links: SocialLink[];
		on_add: (platform: string, url: string) => Promise<void>;
		on_delete: (link_id: string) => Promise<void>;
		on_change: () => void;
	}

	let { social_links, on_add, on_delete, on_change }: Props =
		$props();

	// New social link state
	let new_platform = $state('');
	let new_url = $state('');
	let adding_link = $state(false);
	let delete_confirmation_id = $state<string | null>(null);

	async function handle_add_social_link() {
		if (!new_platform || !new_url) return;

		// Auto-add https:// if no protocol specified
		let url_to_add = new_url.trim();
		if (!/^https?:\/\//i.test(url_to_add)) {
			url_to_add = `https://${url_to_add}`;
		}

		adding_link = true;
		try {
			await on_add(new_platform, url_to_add);
			new_platform = '';
			new_url = '';
			on_change();
		} catch (err) {
			console.error('Failed to add social link:', err);
		} finally {
			adding_link = false;
		}
	}

	function handle_delete_click(link_id: string) {
		delete_confirmation_id = link_id;
	}

	async function confirm_delete() {
		if (!delete_confirmation_id) return;

		try {
			await on_delete(delete_confirmation_id);
			delete_confirmation_id = null;
			on_change();
		} catch (err) {
			console.error('Failed to delete social link:', err);
		}
	}

	function cancel_delete() {
		delete_confirmation_id = null;
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
						<span class="text-sm font-medium capitalize">
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
					{#if delete_confirmation_id === link.id}
						<ConfirmDialog
							is_inline={true}
							message="Remove?"
							on_confirm={confirm_delete}
							on_cancel={cancel_delete}
						/>
					{:else}
						<button
							type="button"
							onclick={() => handle_delete_click(link.id)}
							class="btn btn-ghost btn-xs"
						>
							<Trash size="16px" class_names="text-error" />
						</button>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	<!-- Add New Social Link -->
	<div class="space-y-3">
		<p class="text-xs font-medium opacity-70">Add new social link</p>
		<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Platform</legend>
				<select bind:value={new_platform} class="select w-full">
					<option value="">Select platform</option>
					<option value="github">GitHub</option>
					<option value="twitter">Twitter/X</option>
					<option value="bluesky">Bluesky</option>
					<option value="linkedin">LinkedIn</option>
					<option value="mastodon">Mastodon</option>
					<option value="website">Website</option>
				</select>
			</fieldset>
			<fieldset class="fieldset">
				<legend class="fieldset-legend">URL</legend>
				<label class="input w-full">
					<input
						type="url"
						placeholder="https://example.com"
						bind:value={new_url}
						class="grow"
					/>
				</label>
			</fieldset>
		</div>
		<button
			type="button"
			onclick={handle_add_social_link}
			disabled={adding_link || !new_platform || !new_url}
			class="btn btn-block btn-primary"
		>
			{#if adding_link}
				<span class="loading loading-sm loading-spinner"></span>
			{:else}
				Add
			{/if}
		</button>
	</div>
</div>
