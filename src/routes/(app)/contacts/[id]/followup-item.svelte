<script lang="ts">
	import ActivityCard from '$lib/components/activity-card.svelte';
	import { Calendar, Check, Edit, Trash } from '$lib/icons';
	import {
		edit_state,
		handle_complete_follow_up,
		handle_delete_follow_up_click,
		handle_edit_follow_up_click,
		save_edit_follow_up,
		cancel_edit_follow_up,
		confirm_delete_follow_up,
		cancel_delete_follow_up,
	} from '$lib/state/contact-edit-state.svelte';
	import {
		format_due_date,
		is_overdue,
	} from '$lib/utils/date-helpers';
	import type { FollowUp, UserPreferences } from '$lib/types/db';

	interface Props {
		follow_up: FollowUp;
		contact_id: string;
		contact_name: string;
		date_format: UserPreferences['date_format'];
	}

	let { follow_up, contact_id, contact_name, date_format }: Props =
		$props();

	const overdue = $derived(
		!follow_up.completed && is_overdue(follow_up.due_date),
	);
	const icon_color = $derived(
		overdue
			? 'bg-error text-error-content'
			: 'bg-warning text-warning-content',
	);
	const metadata_classes = $derived(
		overdue ? 'opacity-60 text-error' : 'opacity-60',
	);
</script>

{#if edit_state.edit_follow_up_id === follow_up.id}
	<!-- Edit Mode -->
	<div class="rounded-box border border-base-300 bg-base-200/50 p-4">
		<div class="space-y-3">
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Due Date</legend>
				<label class="input w-full">
					<input
						type="datetime-local"
						bind:value={edit_state.edit_follow_up_due_date_str}
						class="grow"
					/>
				</label>
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Note</legend>
				<textarea
					bind:value={edit_state.edit_follow_up_note}
					class="textarea h-24 w-full"
					placeholder="Add a note..."
				></textarea>
			</fieldset>

			<div class="flex justify-end gap-2">
				<button
					class="btn btn-ghost btn-sm"
					onclick={cancel_edit_follow_up}
				>
					Cancel
				</button>
				<button
					class="btn btn-sm btn-primary"
					onclick={save_edit_follow_up}
				>
					Save
				</button>
			</div>
		</div>
	</div>
{:else}
	<!-- View Mode -->
	<ActivityCard
		icon={Calendar}
		icon_color_classes={icon_color}
		{contact_id}
		{contact_name}
		metadata="Due: {format_due_date(
			follow_up.due_date,
			date_format,
		)}{overdue
			? " <span class='badge badge-sm badge-error'>Overdue</span>"
			: ''}"
		{metadata_classes}
		note={follow_up.note}
		show_delete_confirmation={edit_state.delete_follow_up_id ===
			follow_up.id}
		on_confirm_delete={confirm_delete_follow_up}
		on_cancel_delete={cancel_delete_follow_up}
	>
		{#snippet action_buttons()}
			<button
				onclick={() => handle_complete_follow_up(follow_up.id)}
				class="btn gap-0 text-success btn-ghost btn-xs lg:gap-1"
				aria-label="Complete follow-up"
			>
				<Check size="16px" />
				<span class="hidden lg:inline">Complete</span>
			</button>
			<button
				class="btn gap-0 btn-ghost btn-xs lg:gap-1"
				aria-label="Edit follow-up"
				onclick={(e) =>
					handle_edit_follow_up_click(e as MouseEvent, follow_up)}
			>
				<Edit size="16px" />
				<span class="hidden lg:inline">Edit</span>
			</button>
			<button
				class="btn gap-0 text-error btn-ghost btn-xs lg:gap-1"
				aria-label="Delete follow-up"
				onclick={(e) =>
					handle_delete_follow_up_click(
						e as MouseEvent,
						follow_up.id,
					)}
			>
				<Trash size="16px" />
				<span class="hidden lg:inline">Delete</span>
			</button>
		{/snippet}
	</ActivityCard>
{/if}
