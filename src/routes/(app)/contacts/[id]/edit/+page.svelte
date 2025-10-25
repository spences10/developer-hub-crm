<script lang="ts">
	import { page } from '$app/state';
	import PageNav from '$lib/components/page-nav.svelte';
	import SocialLinksManager from '$lib/components/social-links-manager.svelte';
	import TagManager from '$lib/components/tag-manager.svelte';
	import { Cancel } from '$lib/icons';
	import {
		add_tag_to_contact,
		create_tag,
		get_contact_tags,
		get_tags,
		remove_tag_from_contact,
	} from '../../../tags/tags.remote';
	import {
		add_social_link,
		delete_social_link,
		get_contact,
		get_social_links,
		update_contact,
	} from '../../contacts.remote';

	const contact_id = $derived(page.params.id);
	const contact_query = $derived(
		contact_id ? get_contact(contact_id) : null,
	);
	const contact_tags_query = $derived(
		contact_id ? get_contact_tags(contact_id) : null,
	);
	const social_links_query = $derived(
		contact_id ? get_social_links(contact_id) : null,
	);
	const all_tags_query = get_tags();

	let error = $state<string | null>(null);
	let saving = $state(false);

	// Track current field values to avoid stale data
	let contact_state = $state<Record<string, any>>({});

	async function save_with_indicator(fn: () => Promise<void>) {
		saving = true;
		try {
			await fn();
			error = null;
		} catch (err: any) {
			error = err.message || 'Failed to save';
		} finally {
			setTimeout(() => (saving = false), 500);
		}
	}

	async function save_field(
		field: string,
		value: string | boolean,
		current_contact: any,
	) {
		if (!contact_id) return;

		// Update the local state with the new value
		contact_state[field] = value === '' ? undefined : value;

		// Build the update object using the tracked state, falling back to current_contact
		const update_data = {
			id: contact_id,
			name: contact_state.name ?? current_contact.name,
			email:
				contact_state.email ?? current_contact.email ?? undefined,
			phone:
				contact_state.phone ?? current_contact.phone ?? undefined,
			company:
				contact_state.company ?? current_contact.company ?? undefined,
			title:
				contact_state.title ?? current_contact.title ?? undefined,
			github_username:
				contact_state.github_username ??
				current_contact.github_username ??
				undefined,
			avatar_url:
				contact_state.avatar_url ??
				current_contact.avatar_url ??
				undefined,
			is_vip: contact_state.is_vip ?? current_contact.is_vip === 1,
			birthday:
				contact_state.birthday ??
				current_contact.birthday ??
				undefined,
			in_network_since:
				contact_state.in_network_since ??
				current_contact.in_network_since ??
				undefined,
			notes:
				contact_state.notes ?? current_contact.notes ?? undefined,
		};

		// Use .updates() to refresh the get_contact query globally after mutation
		// This ensures the contact detail page shows fresh data when navigating back
		await save_with_indicator(() =>
			update_contact(update_data).updates(get_contact(contact_id)),
		);
	}
</script>

<div class="mb-8 flex items-center justify-between">
	<h1 class="text-3xl font-bold">Edit Contact</h1>
	<div class="flex items-center gap-2">
		{#if saving}
			<span class="badge badge-lg badge-success">Saving...</span>
		{/if}
		<a
			href="/contacts/{contact_id}"
			class="tooltip btn gap-2 text-error btn-ghost btn-sm"
			data-tip="Cancel"
			aria-label="Cancel editing"
		>
			<Cancel size="20px" />
		</a>
	</div>
</div>
<PageNav />

{#if !contact_query}
	<div class="alert alert-error">
		<p>Invalid contact ID</p>
	</div>
{:else if contact_query.error}
	<div class="alert alert-error">
		<p>Error loading contact. Please try again.</p>
	</div>
{:else if contact_query.loading && contact_query.current === undefined}
	<!-- Only show loading spinner on initial load -->
	<div class="flex justify-center p-8">
		<span class="loading loading-lg loading-spinner"></span>
	</div>
{:else if contact_query.current}
	{@const contact = contact_query.current}
	{#key contact_id}
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<div class="space-y-4">
					<!-- Name & VIP - Two Column Grid -->
					<div class="grid items-end gap-4 md:grid-cols-2">
						<fieldset class="fieldset">
							<legend class="fieldset-legend">Name *</legend>
							<label class="validator input w-full">
								<input
									type="text"
									value={contact.name}
									placeholder="John Doe"
									class="grow"
									required
									onblur={(e) =>
										save_field(
											'name',
											e.currentTarget.value,
											contact,
										)}
								/>
							</label>
						</fieldset>

						<div class="pb-2">
							<label class="flex cursor-pointer items-center gap-2">
								<input
									type="checkbox"
									checked={contact.is_vip === 1}
									class="checkbox"
									onchange={(e) =>
										save_field(
											'is_vip',
											e.currentTarget.checked,
											contact,
										)}
								/>
								<span>Mark as VIP</span>
							</label>
						</div>
					</div>

					<!-- Email & Phone - Two Column Grid -->
					<div class="grid gap-4 md:grid-cols-2">
						<fieldset class="fieldset">
							<legend class="fieldset-legend">Email</legend>
							<label class="validator input w-full">
								<input
									type="email"
									value={contact.email || ''}
									placeholder="Email"
									class="grow"
									onblur={(e) =>
										save_field(
											'email',
											e.currentTarget.value,
											contact,
										)}
								/>
							</label>
						</fieldset>

						<fieldset class="fieldset">
							<legend class="fieldset-legend">Phone</legend>
							<label class="input w-full">
								<input
									type="tel"
									value={contact.phone || ''}
									placeholder="+1 (555) 123-4567"
									class="grow"
									onblur={(e) =>
										save_field(
											'phone',
											e.currentTarget.value,
											contact,
										)}
								/>
							</label>
						</fieldset>
					</div>

					<!-- Company & Title - Two Column Grid -->
					<div class="grid gap-4 md:grid-cols-2">
						<fieldset class="fieldset">
							<legend class="fieldset-legend">Company</legend>
							<label class="input w-full">
								<input
									type="text"
									value={contact.company || ''}
									placeholder="Acme Inc."
									class="grow"
									onblur={(e) =>
										save_field(
											'company',
											e.currentTarget.value,
											contact,
										)}
								/>
							</label>
						</fieldset>

						<fieldset class="fieldset">
							<legend class="fieldset-legend">Title</legend>
							<label class="input w-full">
								<input
									type="text"
									value={contact.title || ''}
									placeholder="Senior Developer"
									class="grow"
									onblur={(e) =>
										save_field(
											'title',
											e.currentTarget.value,
											contact,
										)}
								/>
							</label>
						</fieldset>
					</div>

					<!-- GitHub Username & Birthday - Two Column Grid -->
					<div class="grid gap-4 md:grid-cols-2">
						<fieldset class="fieldset">
							<legend class="fieldset-legend">GitHub Username</legend>
							<label class="input w-full">
								<input
									type="text"
									value={contact.github_username || ''}
									placeholder="octocat"
									class="grow"
									onblur={(e) =>
										save_field(
											'github_username',
											e.currentTarget.value,
											contact,
										)}
								/>
							</label>
							<p class="label">Enter username without @</p>
						</fieldset>

						<fieldset class="fieldset">
							<legend class="fieldset-legend">Birthday</legend>
							<label class="input w-full">
								<input
									type="date"
									value={contact.birthday || ''}
									class="grow"
									onblur={(e) =>
										save_field(
											'birthday',
											e.currentTarget.value,
											contact,
										)}
								/>
							</label>
						</fieldset>
					</div>

					<!-- In Network Since - Full Width -->
					<fieldset class="fieldset">
						<legend class="fieldset-legend">In Network Since</legend>
						<label class="input w-full">
							<input
								type="date"
								value={contact.in_network_since
									? new Date(contact.in_network_since)
											.toISOString()
											.split('T')[0]
									: new Date(contact.created_at)
											.toISOString()
											.split('T')[0]}
								class="grow"
								onblur={(e) =>
									save_field(
										'in_network_since',
										e.currentTarget.value,
										contact,
									)}
							/>
						</label>
						<p class="label">
							When you first met or added this contact to your network
						</p>
					</fieldset>

					<!-- Notes - Full Width -->
					<fieldset class="fieldset">
						<legend class="fieldset-legend">Notes</legend>
						<textarea
							class="textarea w-full"
							rows="4"
							placeholder="Additional notes about this contact..."
							value={contact.notes || ''}
							onblur={(e) =>
								save_field('notes', e.currentTarget.value, contact)}
							onkeydown={(e) => {
								if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
									e.preventDefault();
									save_field('notes', e.currentTarget.value, contact);
								}
							}}
						></textarea>
					</fieldset>

					<!-- Social Links Management - Separate Query for Instant Updates -->
					{#if social_links_query}
						{#await social_links_query then links}
							<SocialLinksManager
								social_links={links || []}
								on_add={async (platform, url) => {
									await add_social_link({
										contact_id: contact.id,
										platform,
										url,
									});
									social_links_query.refresh();
								}}
								on_delete={async (link_id) => {
									await delete_social_link(link_id);
									social_links_query.refresh();
								}}
							/>
						{/await}
					{/if}

					<!-- Tags Management -->
					{#if contact_tags_query?.loading || all_tags_query.loading}
						<div class="flex justify-center p-4">
							<span class="loading loading-md loading-spinner"></span>
						</div>
					{:else if contact_tags_query?.error || all_tags_query.error}
						<div class="alert alert-warning">
							<p>Error loading tags</p>
						</div>
					{:else if contact_tags_query?.current && all_tags_query.current}
						{@const contact_tags = contact_tags_query.current}
						{@const all_tags = all_tags_query.current}
						<TagManager
							{contact_tags}
							available_tags={all_tags}
							on_add_tag={(tag_id) =>
								add_tag_to_contact({
									contact_id: contact.id,
									tag_id,
								})}
							on_remove_tag={(tag_id) =>
								remove_tag_from_contact({
									contact_id: contact.id,
									tag_id,
								})}
							on_create_tag={(name, color) =>
								create_tag({ name, color })}
						/>
					{/if}

					<!-- Error Display -->
					{#if error}
						<div class="alert alert-error">
							<span>{error}</span>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/key}
{/if}
