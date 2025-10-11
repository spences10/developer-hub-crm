<script lang="ts">
	import ActivityCard from '$lib/components/activity-card.svelte';
	import EmptyState from '$lib/components/empty-state.svelte';
	import FilterTabs from '$lib/components/filter-tabs.svelte';
	import ItemCount from '$lib/components/item-count.svelte';
	import PageHeaderWithAction from '$lib/components/page-header-with-action.svelte';
	import PageNav from '$lib/components/page-nav.svelte';
	import SearchBar from '$lib/components/search-bar.svelte';
	import {
		Calendar,
		Call,
		Edit,
		Email,
		Message,
		Trash,
	} from '$lib/icons';
	import { seo_configs } from '$lib/seo';
	import type { Interaction } from '$lib/types/db';
	import { format_date } from '$lib/utils/date-helpers';
	import { Head } from 'svead';
	import { get_user_preferences } from '../settings/settings.remote';
	import {
		delete_interaction,
		get_all_interactions,
		get_interactions,
		update_interaction,
	} from './interactions.remote';

	let search = $state('');
	let filter = $state<
		'all' | 'meeting' | 'call' | 'email' | 'message'
	>('all');

	let delete_confirmation_id = $state<string | null>(null);
	let delete_contact_id = $state<string | null>(null);
	let edit_interaction_id = $state<string | null>(null);
	let edit_contact_id = $state<string | null>(null);
	let edit_type = $state<'meeting' | 'call' | 'email' | 'message'>(
		'meeting',
	);
	let edit_note = $state('');

	// Store queries - use $derived for search reactivity
	const all_interactions = $derived(get_all_interactions(search));
	const preferences = get_user_preferences();

	const interaction_types = [
		'all',
		'meeting',
		'call',
		'email',
		'message',
	] as const;

	const type_icons: Record<
		string,
		typeof Calendar | typeof Call | typeof Email | typeof Message
	> = {
		meeting: Calendar,
		call: Call,
		email: Email,
		message: Message,
	};

	const type_colors: Record<string, string> = {
		meeting: 'bg-primary text-primary-content',
		call: 'bg-secondary text-secondary-content',
		email: 'bg-accent text-accent-content',
		message: 'bg-info text-info-content',
	};

	function handle_edit_click(
		event: MouseEvent,
		interaction: Interaction & { contact_name: string },
	) {
		event.stopPropagation();
		edit_interaction_id = interaction.id;
		edit_contact_id = interaction.contact_id;
		edit_type = interaction.type;
		edit_note = interaction.note || '';
	}

	async function save_edit() {
		if (!edit_interaction_id || !edit_contact_id) return;

		// Use .updates() to refresh both the list query and contact-specific query
		// This ensures the contact detail page shows fresh data
		await update_interaction({
			id: edit_interaction_id,
			type: edit_type,
			note: edit_note,
		}).updates(
			get_all_interactions(search),
			get_interactions(edit_contact_id),
		);

		edit_interaction_id = null;
		edit_contact_id = null;
	}

	function cancel_edit() {
		edit_interaction_id = null;
	}

	function handle_delete_click(
		event: MouseEvent,
		interaction: Interaction & { contact_name: string },
	) {
		event.stopPropagation();
		delete_confirmation_id = interaction.id;
		delete_contact_id = interaction.contact_id;
	}

	async function confirm_delete() {
		if (!delete_confirmation_id || !delete_contact_id) return;

		// Use .updates() to refresh both the list query and contact-specific query
		await delete_interaction(delete_confirmation_id).updates(
			get_all_interactions(search),
			get_interactions(delete_contact_id),
		);

		delete_confirmation_id = null;
		delete_contact_id = null;
	}

	function cancel_delete() {
		delete_confirmation_id = null;
	}
</script>

<Head seo_config={seo_configs.interactions} />

<div class="mx-auto max-w-6xl">
	<PageHeaderWithAction title="Interactions">
		<a href="/interactions/new" class="btn btn-primary">
			New Interaction
		</a>
	</PageHeaderWithAction>
	<PageNav />

	<!-- Search Bar -->
	<SearchBar
		bind:value={search}
		placeholder="Search by contact name or note"
		on_change={() => {}}
	/>

	<!-- Filter Tabs -->
	<FilterTabs
		options={interaction_types}
		active_filter={filter}
		on_filter_change={(f) => (filter = f)}
	/>

	<!-- Interactions List -->
	{#await Promise.all( [all_interactions, preferences], ) then [interactions_data, preferences_data]}
		{@const interactions =
			filter === 'all'
				? interactions_data
				: interactions_data.filter((i) => i.type === filter)}

		{#if interactions.length === 0}
			<EmptyState
				message={search
					? 'No interactions found matching your search.'
					: filter === 'all'
						? 'No interactions yet.'
						: `No ${filter} interactions found.`}
				action_href={!search && filter === 'all'
					? '/interactions/new'
					: undefined}
				action_text={!search && filter === 'all'
					? 'Log Your First Interaction'
					: undefined}
			/>
		{:else}
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				{#each interactions as interaction}
					{@const TypeIcon = type_icons[interaction.type]}
					{#if edit_interaction_id === interaction.id}
						<!-- Edit Mode -->
						<div
							class="card bg-base-100 shadow-md transition-shadow hover:shadow-lg"
						>
							<div class="card-body p-4">
								<div class="space-y-4">
									<div class="flex items-center justify-between">
										<a
											href="/contacts/{interaction.contact_id}"
											class="link text-lg font-semibold link-hover"
										>
											{interaction.contact_name}
										</a>
									</div>

									<div class="space-y-3">
										<label class="form-control w-full">
											<div class="label">
												<span class="label-text">Type</span>
											</div>
											<select
												bind:value={edit_type}
												class="select-bordered select w-full"
											>
												<option value="meeting">Meeting</option>
												<option value="call">Call</option>
												<option value="email">Email</option>
												<option value="message">Message</option>
											</select>
										</label>

										<label class="form-control w-full">
											<div class="label">
												<span class="label-text">Note</span>
											</div>
											<textarea
												bind:value={edit_note}
												class="textarea-bordered textarea h-24 w-full"
												placeholder="Add a note..."
											></textarea>
										</label>
									</div>

									<div class="flex justify-end gap-2">
										<button
											class="btn btn-ghost btn-sm"
											onclick={cancel_edit}
										>
											Cancel
										</button>
										<button
											class="btn btn-sm btn-primary"
											onclick={save_edit}
										>
											Save
										</button>
									</div>
								</div>
							</div>
						</div>
					{:else}
						<!-- View Mode -->
						<ActivityCard
							icon={TypeIcon}
							icon_color_classes={type_colors[interaction.type]}
							contact_id={interaction.contact_id}
							contact_name={interaction.contact_name}
							metadata="<span class='capitalize'>{interaction.type}</span> • {format_date(
								new Date(interaction.created_at),
								preferences_data.date_format,
							)}"
							note={interaction.note}
							show_delete_confirmation={delete_confirmation_id ===
								interaction.id}
							on_confirm_delete={confirm_delete}
							on_cancel_delete={cancel_delete}
						>
							{#snippet action_buttons()}
								<button
									class="btn gap-1 btn-ghost btn-xs"
									aria-label="Edit interaction"
									onclick={(e) => handle_edit_click(e, interaction)}
								>
									<Edit size="16px" />
									Edit
								</button>
								<button
									class="btn gap-1 text-error btn-ghost btn-xs"
									aria-label="Delete interaction"
									onclick={(e) => handle_delete_click(e, interaction)}
								>
									<Trash size="16px" />
									Delete
								</button>
							{/snippet}
						</ActivityCard>
					{/if}
				{/each}
			</div>

			<ItemCount
				count={interactions.length}
				item_name="interaction"
			/>
		{/if}
	{/await}
</div>
