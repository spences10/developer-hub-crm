<script lang="ts">
	import { page } from '$app/state';
	import PageHeaderWithAction from '$lib/components/page-header-with-action.svelte';
	import PageNav from '$lib/components/page-nav.svelte';
	import { ctrl_enter_submit } from '$lib/utils/keyboard-attachments';
	import { get_contacts } from '../../contacts/contacts.remote';
	import { get_interaction_types } from '../../settings/interaction-types.remote';
	import { get_user_preferences } from '../../settings/settings.remote';
	import { create_interaction } from '../interactions.remote';

	const preselected_contact_id = $derived(
		page.url.searchParams.get('contact_id'),
	);

	const interaction_types = get_interaction_types();
</script>

<PageHeaderWithAction title="Log New Interaction" />
<PageNav />

{#await get_user_preferences() then preferences}
	<form {...create_interaction} class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Contact</legend>
				{#await get_contacts() then contacts}
					<select
						name="contact_id"
						class="select w-full"
						required
						value={preselected_contact_id || ''}
					>
						<option value="" disabled>Select a contact</option>
						{#each contacts as contact}
							<option value={contact.id}>
								{contact.name}
								{#if contact.company}
									- {contact.company}
								{/if}
							</option>
						{/each}
					</select>
				{/await}
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Interaction Type</legend>
				{#await interaction_types}
					<select disabled class="select w-full">
						<option>Loading...</option>
					</select>
				{:then types}
					<select
						name="type"
						class="select w-full"
						required
						value={preferences.default_interaction_type || ''}
					>
						<option value="" disabled>Select type</option>
						{#each types as type}
							<option value={type.value}>{type.label}</option>
						{/each}
					</select>
				{:catch}
					<select disabled class="select w-full">
						<option>Failed to load types</option>
					</select>
				{/await}
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Notes (Optional)</legend>
				<textarea
					name="note"
					class="textarea w-full"
					rows="6"
					placeholder="Add any notes about this interaction..."
					{@attach ctrl_enter_submit()}
				></textarea>
			</fieldset>

			<div class="card-actions justify-end">
				<a href="/interactions" class="btn btn-outline">Cancel</a>
				<button type="submit" class="btn btn-primary">
					Log Interaction
				</button>
			</div>
		</div>
	</form>
{/await}
