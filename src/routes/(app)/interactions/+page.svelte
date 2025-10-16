<script lang="ts">
	import ActivityCard from '$lib/components/activity-card.svelte';
	import EmptyState from '$lib/components/empty-state.svelte';
	import FilterTabs from '$lib/components/filter-tabs.svelte';
	import ItemCount from '$lib/components/item-count.svelte';
	import PageHeaderWithAction from '$lib/components/page-header-with-action.svelte';
	import PageNav from '$lib/components/page-nav.svelte';
	import SearchBar from '$lib/components/search-bar.svelte';
	import type { InteractionType } from '$lib/constants/interaction';
	import {
		INTERACTION_TYPE_COLORS,
		INTERACTION_TYPE_ICONS,
		INTERACTION_TYPES,
	} from '$lib/constants/interaction';
	import { Edit, Trash } from '$lib/icons';
	import { seo_configs } from '$lib/seo';
	import type { Interaction } from '$lib/types/db';
	import { format_date } from '$lib/utils/date-helpers';
	import { Head } from 'svead';
	import { get_user_preferences } from '../settings/settings.remote';
	import {
		delete_interaction,
		get_all_interactions,
		update_interaction,
	} from './interactions.remote';

	let search = $state('');
	let filter = $state<'all' | InteractionType>('all');

	let delete_confirmation_id = $state<string | null>(null);
	let delete_contact_id = $state<string | null>(null);
	let edit_interaction_id = $state<string | null>(null);
	let edit_contact_id = $state<string | null>(null);
	let edit_type = $state<InteractionType>('meeting');
	let edit_note = $state('');

	const interaction_types = [
		'all',
		...INTERACTION_TYPES.map((t) => t.value),
	] as const;

	const interactions_query = $derived(get_all_interactions(search));
	const preferences_query = get_user_preferences();

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

	async function save_edit(event?: Event) {
		event?.preventDefault();
		event?.stopPropagation();

		if (!edit_interaction_id || !edit_contact_id) return;

		const interaction_id = edit_interaction_id;

		// Call the command
		await update_interaction({
			id: interaction_id,
			type: edit_type,
			note: edit_note,
		});

		// Close edit mode FIRST
		edit_interaction_id = null;
		edit_contact_id = null;

		// THEN refresh the query (data will update in place)
		await interactions_query.refresh();
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

		// Call the command
		await delete_interaction(delete_confirmation_id);

		// Then refresh the query
		await interactions_query.refresh();

		delete_confirmation_id = null;
		delete_contact_id = null;
	}

	function cancel_delete() {
		delete_confirmation_id = null;
	}
</script>

<Head seo_config={seo_configs.interactions} />

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
{#if interactions_query.error || preferences_query.error}
	<div class="alert alert-error">
		<p>Error loading interactions. Please try again.</p>
	</div>
{:else if (interactions_query.loading || preferences_query.loading) && (interactions_query.current === undefined || preferences_query.current === undefined)}
	<!-- Only show loading spinner on initial load -->
	<div class="flex justify-center p-8">
		<span class="loading loading-lg loading-spinner"></span>
	</div>
{:else}
	{@const interactions_data = interactions_query.current ?? []}
	{@const preferences_data = preferences_query.current}
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
		<div
			class="grid grid-cols-1 gap-4 md:grid-cols-2"
			class:opacity-60={interactions_query.loading}
		>
			{#each interactions as interaction}
				{@const TypeIcon = INTERACTION_TYPE_ICONS[interaction.type]}
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
									<fieldset class="fieldset">
										<legend class="fieldset-legend">Type</legend>
										<select
											bind:value={edit_type}
											class="select w-full"
										>
											{#each INTERACTION_TYPES as type}
												<option value={type.value}
													>{type.label}</option
												>
											{/each}
										</select>
									</fieldset>

									<fieldset class="fieldset">
										<legend class="fieldset-legend">Note</legend>
										<textarea
											bind:value={edit_note}
											class="textarea h-24 w-full"
											placeholder="Add a note..."
										></textarea>
									</fieldset>
								</div>

								<div class="flex justify-end gap-2">
									<button
										type="button"
										class="btn btn-ghost btn-sm"
										onclick={cancel_edit}
									>
										Cancel
									</button>
									<button
										type="button"
										class="btn btn-sm btn-primary"
										onclick={(e) => save_edit(e)}
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
						icon_color_classes={INTERACTION_TYPE_COLORS[
							interaction.type
						]}
						contact_id={interaction.contact_id}
						contact_name={interaction.contact_name}
						metadata="<span class='capitalize'>{interaction.type}</span> • {format_date(
							new Date(interaction.created_at),
							preferences_data?.date_format ?? 'YYYY-MM-DD',
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

		<ItemCount count={interactions.length} item_name="interaction" />
	{/if}
{/if}
