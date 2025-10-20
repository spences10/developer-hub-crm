<script lang="ts">
	import ActivityCard from '$lib/components/activity-card.svelte';
	import { Edit, Trash } from '$lib/icons';
	import {
		cancel_delete_interaction,
		cancel_edit_interaction,
		confirm_delete_interaction,
		edit_state,
		handle_delete_interaction_click,
		handle_edit_interaction_click,
		save_edit_interaction,
	} from '$lib/state/contact-edit-state.svelte';
	import type { Interaction, UserPreferences } from '$lib/types/db';
	import type { InteractionType } from '$lib/types/interaction-type';
	import { format_date } from '$lib/utils/date-helpers';
	import { get_icon_component } from '$lib/utils/interaction-type-helpers';
	import { get_interaction_types } from '../../settings/interaction-types.remote';

	interface Props {
		interaction: Interaction;
		contact_id: string;
		contact_name: string;
		date_format: UserPreferences['date_format'];
	}

	let { interaction, contact_id, contact_name, date_format }: Props =
		$props();

	const interaction_types_query = get_interaction_types();

	// Derive the icon and color - handle both Promise and cached array
	const TypeIcon = $derived.by(() => {
		const types = Array.isArray(interaction_types_query)
			? interaction_types_query
			: interaction_types_query.current;

		if (!types) return get_icon_component('Calendar');

		const type_data = types.find((t: InteractionType) => t.value === interaction.type);
		return type_data
			? get_icon_component(type_data.icon)
			: get_icon_component('Calendar');
	});

	const type_color = $derived.by(() => {
		const types = Array.isArray(interaction_types_query)
			? interaction_types_query
			: interaction_types_query.current;

		if (!types) return 'bg-base-300';

		const type_data = types.find((t: InteractionType) => t.value === interaction.type);
		return type_data ? type_data.color : 'bg-base-300';
	});
</script>

{#if edit_state.edit_interaction_id === interaction.id}
	<!-- Edit Mode -->
	<div class="rounded-box border border-base-300 bg-base-200/50 p-4">
		<div class="space-y-3">
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Type</legend>
				{#await interaction_types_query}
					<select disabled class="select w-full">
						<option>Loading...</option>
					</select>
				{:then types}
					<select
						bind:value={edit_state.edit_interaction_type}
						class="select w-full"
					>
						{#each types as type}
							<option value={type.value}>{type.label}</option>
						{/each}
					</select>
				{/await}
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Note</legend>
				<textarea
					bind:value={edit_state.edit_interaction_note}
					class="textarea h-24 w-full"
					placeholder="Add a note..."
				></textarea>
			</fieldset>

			<div class="flex justify-end gap-2">
				<button
					class="btn btn-ghost btn-sm"
					onclick={cancel_edit_interaction}
				>
					Cancel
				</button>
				<button
					class="btn btn-sm btn-primary"
					onclick={save_edit_interaction}
				>
					Save
				</button>
			</div>
		</div>
	</div>
{:else}
	<!-- View Mode -->
	<ActivityCard
		icon={TypeIcon}
		icon_color_classes={type_color}
		{contact_id}
		{contact_name}
		metadata="<span class='capitalize'>{interaction.type}</span> • {format_date(
			new Date(interaction.created_at),
			date_format,
		)}"
		note={interaction.note}
		show_delete_confirmation={edit_state.delete_interaction_id ===
			interaction.id}
		on_confirm_delete={confirm_delete_interaction}
		on_cancel_delete={cancel_delete_interaction}
	>
		{#snippet action_buttons()}
			<button
				class="btn gap-0 btn-ghost btn-xs lg:gap-1"
				aria-label="Edit interaction"
				onclick={(e) =>
					handle_edit_interaction_click(
						e as MouseEvent,
						interaction,
					)}
			>
				<Edit size="16px" />
				<span class="hidden lg:inline">Edit</span>
			</button>
			<button
				class="btn gap-0 text-error btn-ghost btn-xs lg:gap-1"
				aria-label="Delete interaction"
				onclick={(e) =>
					handle_delete_interaction_click(
						e as MouseEvent,
						interaction.id,
					)}
			>
				<Trash size="16px" />
				<span class="hidden lg:inline">Delete</span>
			</button>
		{/snippet}
	</ActivityCard>
{/if}
