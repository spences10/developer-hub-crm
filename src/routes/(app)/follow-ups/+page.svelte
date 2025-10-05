<script lang="ts">
	import ConfirmDialog from '$lib/components/confirm-dialog.svelte';
	import EmptyState from '$lib/components/empty-state.svelte';
	import FilterTabs from '$lib/components/filter-tabs.svelte';
	import ItemCount from '$lib/components/item-count.svelte';
	import PageHeaderWithAction from '$lib/components/page-header-with-action.svelte';
	import PageNav from '$lib/components/page-nav.svelte';
	import { Check, CircleBack, Edit, Trash } from '$lib/icons';
	import type { FollowUp } from '$lib/types/db';
	import {
		format_date,
		format_due_date,
		is_overdue,
	} from '$lib/utils/date-helpers';
	import { get_user_preferences } from '../settings/settings.remote';
	import {
		complete_follow_up,
		delete_follow_up,
		get_all_follow_ups,
		reopen_follow_up,
		update_follow_up,
	} from './follow-ups.remote';

	let filter = $state<'all' | 'pending' | 'completed' | 'overdue'>(
		'all',
	);

	let delete_confirmation_id = $state<string | null>(null);
	let edit_follow_up_id = $state<string | null>(null);
	let edit_due_date_str = $state(''); // datetime-local string format
	let edit_note = $state('');

	// Store queries in variables for reactivity
	const all_follow_ups = get_all_follow_ups();
	const preferences = get_user_preferences();

	const filter_options = [
		'all',
		'pending',
		'completed',
		'overdue',
	] as const;

	function filter_follow_ups(
		follow_ups: Array<FollowUp & { contact_name: string }>,
		filter_type: typeof filter,
	) {
		const now = Date.now();
		if (filter_type === 'pending') {
			return follow_ups.filter((f) => !f.completed);
		} else if (filter_type === 'completed') {
			return follow_ups.filter((f) => f.completed);
		} else if (filter_type === 'overdue') {
			return follow_ups.filter(
				(f) => !f.completed && f.due_date < now,
			);
		}
		return follow_ups;
	}

	function handle_edit_click(
		event: MouseEvent,
		follow_up: FollowUp & { contact_name: string },
	) {
		event.stopPropagation();
		edit_follow_up_id = follow_up.id;
		// Convert timestamp to datetime-local string format
		const date = new Date(follow_up.due_date);
		edit_due_date_str = date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
		edit_note = follow_up.note || '';
	}

	async function save_edit() {
		if (!edit_follow_up_id) return;
		// Convert datetime-local string to timestamp
		const due_date = new Date(edit_due_date_str).getTime();
		await update_follow_up({
			id: edit_follow_up_id,
			due_date,
			note: edit_note,
		});
		edit_follow_up_id = null;
		await all_follow_ups.refresh();
	}

	function cancel_edit() {
		edit_follow_up_id = null;
	}

	async function handle_complete(id: string) {
		await complete_follow_up(id);
		await all_follow_ups.refresh();
	}

	async function handle_reopen(id: string) {
		await reopen_follow_up(id);
		await all_follow_ups.refresh();
	}

	function handle_delete_click(
		event: MouseEvent,
		follow_up_id: string,
	) {
		event.stopPropagation();
		delete_confirmation_id = follow_up_id;
	}

	async function confirm_delete() {
		if (!delete_confirmation_id) return;
		await delete_follow_up(delete_confirmation_id);
		delete_confirmation_id = null;
		await all_follow_ups.refresh();
	}

	function cancel_delete() {
		delete_confirmation_id = null;
	}
</script>

<div class="mx-auto max-w-6xl">
	<PageHeaderWithAction title="Follow-ups">
		<a href="/follow-ups/new" class="btn btn-primary">
			New Follow-up
		</a>
	</PageHeaderWithAction>
	<PageNav />

	<!-- Filter Tabs -->
	<FilterTabs
		options={filter_options}
		active_filter={filter}
		on_filter_change={(f) => (filter = f)}
	/>

	<!-- Follow-ups List -->
	{#await Promise.all( [all_follow_ups, preferences], ) then [all_follow_ups_data, preferences_data]}
		{@const follow_ups = filter_follow_ups(
			all_follow_ups_data,
			filter,
		)}
		{#if follow_ups.length === 0}
			<EmptyState
				message={filter === 'all'
					? 'No follow-ups yet.'
					: `No ${filter} follow-ups found.`}
				action_href={filter === 'all' ? '/follow-ups/new' : undefined}
				action_text={filter === 'all'
					? 'Create Your First Follow-up'
					: undefined}
			/>
		{:else}
			<div class="space-y-4">
				{#each follow_ups as follow_up}
					{@const overdue =
						!follow_up.completed && is_overdue(follow_up.due_date)}
					<div class="card bg-base-100 shadow-md">
						<div class="card-body">
							{#if edit_follow_up_id === follow_up.id}
								<!-- Edit Mode -->
								<div class="space-y-4">
									<div class="flex items-center justify-between">
										<a
											href="/contacts/{follow_up.contact_id}"
											class="link text-lg font-semibold link-hover"
										>
											{follow_up.contact_name}
										</a>
									</div>

									<div class="space-y-3">
										<label class="form-control w-full">
											<div class="label">
												<span class="label-text">Due Date</span>
											</div>
											<input
												type="datetime-local"
												bind:value={edit_due_date_str}
												class="input-bordered input w-full"
											/>
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
												href="/contacts/{follow_up.contact_id}"
												class="link text-lg font-semibold link-hover"
											>
												{follow_up.contact_name}
											</a>
											{#if follow_up.completed}
												<span class="badge badge-success">
													Completed
												</span>
											{:else if overdue}
												<span class="badge badge-error">Overdue</span>
											{:else}
												<span class="badge badge-warning">
													Pending
												</span>
											{/if}
										</div>

										<div class="mb-2">
											<span
												class="text-sm font-medium"
												class:text-error={overdue &&
													!follow_up.completed}
											>
												Due: {format_due_date(
													follow_up.due_date,
													preferences_data.date_format,
												)}
											</span>
										</div>

										{#if follow_up.note}
											<p class="whitespace-pre-wrap opacity-80">
												{follow_up.note}
											</p>
										{/if}

										{#if follow_up.completed && follow_up.completed_at}
											<p class="mt-2 text-sm opacity-60">
												Completed: {format_date(
													new Date(follow_up.completed_at),
													preferences_data.date_format,
												)}
											</p>
										{/if}
									</div>

									<div class="flex flex-col gap-2">
										{#if delete_confirmation_id === follow_up.id}
											<ConfirmDialog
												is_inline={true}
												message="Delete?"
												on_confirm={confirm_delete}
												on_cancel={cancel_delete}
											/>
										{:else}
											{#if follow_up.completed}
												<button
													onclick={() => handle_reopen(follow_up.id)}
													class="tooltip btn btn-ghost btn-sm"
													data-tip="Reopen"
													aria-label="Reopen follow-up"
												>
													<CircleBack size="20px" />
												</button>
											{:else}
												<button
													onclick={() =>
														handle_complete(follow_up.id)}
													class="tooltip btn text-success btn-ghost btn-sm"
													data-tip="Complete"
													aria-label="Complete follow-up"
												>
													<Check size="20px" />
												</button>
											{/if}
											<button
												class="tooltip btn text-info btn-ghost btn-sm"
												data-tip="Edit"
												aria-label="Edit follow-up"
												onclick={(e) =>
													handle_edit_click(e, follow_up)}
											>
												<Edit size="20px" />
											</button>
											<button
												class="tooltip btn text-error btn-ghost btn-sm"
												data-tip="Delete"
												aria-label="Delete follow-up"
												onclick={(e) =>
													handle_delete_click(e, follow_up.id)}
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

			<ItemCount count={follow_ups.length} item_name="follow-up" />
		{/if}
	{/await}
</div>
