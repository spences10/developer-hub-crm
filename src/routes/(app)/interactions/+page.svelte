<script lang="ts">
	import ConfirmDialog from '$lib/components/confirm-dialog.svelte';
	import EmptyState from '$lib/components/empty-state.svelte';
	import FilterTabs from '$lib/components/filter-tabs.svelte';
	import ItemCount from '$lib/components/item-count.svelte';
	import PageHeaderWithAction from '$lib/components/page-header-with-action.svelte';
	import PageNav from '$lib/components/page-nav.svelte';
	import { Edit, Trash } from '$lib/icons';
	import type { Interaction } from '$lib/types/db';
	import { format_date } from '$lib/utils/date-helpers';
	import { get_user_preferences } from '../settings/settings.remote';
	import {
		delete_interaction,
		get_all_interactions,
		update_interaction,
	} from './interactions.remote';

	let filter = $state<
		'all' | 'meeting' | 'call' | 'email' | 'message'
	>('all');

	let delete_confirmation_id = $state<string | null>(null);
	let edit_interaction_id = $state<string | null>(null);
	let edit_type = $state<'meeting' | 'call' | 'email' | 'message'>(
		'meeting',
	);
	let edit_note = $state('');

	// Store queries in variables for reactivity
	const all_interactions = get_all_interactions();
	const preferences = get_user_preferences();

	const interaction_types = [
		'all',
		'meeting',
		'call',
		'email',
		'message',
	] as const;

	const type_badges: Record<string, string> = {
		meeting: 'badge-primary',
		call: 'badge-secondary',
		email: 'badge-accent',
		message: 'badge-info',
	};

	function handle_edit_click(
		event: MouseEvent,
		interaction: Interaction & { contact_name: string },
	) {
		event.stopPropagation();
		edit_interaction_id = interaction.id;
		edit_type = interaction.type;
		edit_note = interaction.note || '';
	}

	async function save_edit() {
		if (!edit_interaction_id) return;
		await update_interaction({
			id: edit_interaction_id,
			type: edit_type,
			note: edit_note,
		});
		edit_interaction_id = null;
		await all_interactions.refresh();
	}

	function cancel_edit() {
		edit_interaction_id = null;
	}

	function handle_delete_click(
		event: MouseEvent,
		interaction_id: string,
	) {
		event.stopPropagation();
		delete_confirmation_id = interaction_id;
	}

	async function confirm_delete() {
		if (!delete_confirmation_id) return;
		await delete_interaction(delete_confirmation_id);
		delete_confirmation_id = null;
		await all_interactions.refresh();
	}

	function cancel_delete() {
		delete_confirmation_id = null;
	}
</script>

<div class="mx-auto max-w-6xl">
	<PageHeaderWithAction title="Interactions">
		<a href="/interactions/new" class="btn btn-primary">
			New Interaction
		</a>
	</PageHeaderWithAction>
	<PageNav />

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
				message={filter === 'all'
					? 'No interactions yet.'
					: `No ${filter} interactions found.`}
				action_href={filter === 'all'
					? '/interactions/new'
					: undefined}
				action_text={filter === 'all'
					? 'Log Your First Interaction'
					: undefined}
			/>
		{:else}
			<div class="space-y-4">
				{#each interactions as interaction}
					<div class="card bg-base-100 shadow-md">
						<div class="card-body">
							{#if edit_interaction_id === interaction.id}
								<!-- Edit Mode -->
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
							{:else}
								<!-- View Mode -->
								<div class="flex items-start justify-between gap-4">
									<div class="flex-1">
										<div class="mb-2 flex items-center gap-3">
											<a
												href="/contacts/{interaction.contact_id}"
												class="link text-lg font-semibold link-hover"
											>
												{interaction.contact_name}
											</a>
											<span
												class="badge {type_badges[interaction.type]}"
											>
												{interaction.type}
											</span>
										</div>
										{#if interaction.note}
											<p class="whitespace-pre-wrap opacity-80">
												{interaction.note}
											</p>
										{/if}
										<p class="mt-2 text-sm opacity-60">
											{format_date(
												new Date(interaction.created_at),
												preferences_data.date_format,
											)}
										</p>
									</div>
									<div class="flex flex-col gap-2">
										{#if delete_confirmation_id === interaction.id}
											<ConfirmDialog
												is_inline={true}
												message="Delete?"
												on_confirm={confirm_delete}
												on_cancel={cancel_delete}
											/>
										{:else}
											<button
												class="btn text-info btn-ghost btn-sm"
												aria-label="Edit interaction"
												onclick={(e) =>
													handle_edit_click(e, interaction)}
											>
												<Edit size="20px" />
											</button>
											<button
												class="btn text-error btn-ghost btn-sm"
												aria-label="Delete interaction"
												onclick={(e) =>
													handle_delete_click(e, interaction.id)}
											>
												<Trash size="20px" />
											</button>
										{/if}
									</div>
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>

			<ItemCount
				count={interactions.length}
				item_name="interaction"
			/>
		{/if}
	{/await}
</div>
