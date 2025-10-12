<script lang="ts">
	import { page } from '$app/state';
	import PageHeaderWithAction from '$lib/components/page-header-with-action.svelte';
	import PageNav from '$lib/components/page-nav.svelte';
	import { get_contacts } from '../../contacts/contacts.remote';
	import { get_user_preferences } from '../../settings/settings.remote';
	import { create_interaction } from '../interactions.remote';

	const preselected_contact_id = $derived(
		page.url.searchParams.get('contact_id'),
	);
</script>

<PageHeaderWithAction title="Log New Interaction" />
<PageNav />

{#await get_user_preferences() then preferences}
	<form {...create_interaction} class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Contact</legend>
				{#await get_contacts('') then contacts}
					<label class="select w-full">
						<select
							name="contact_id"
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
					</label>
				{/await}
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Interaction Type</legend>
				<label class="select w-full">
					<select
						name="type"
						required
						value={preferences.default_interaction_type || ''}
					>
						<option value="" disabled>Select type</option>
						<option value="meeting">Meeting</option>
						<option value="call">Call</option>
						<option value="email">Email</option>
						<option value="message">Message</option>
					</select>
				</label>
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Notes (Optional)</legend>
				<textarea
					name="note"
					class="textarea w-full"
					rows="6"
					placeholder="Add any notes about this interaction..."
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
