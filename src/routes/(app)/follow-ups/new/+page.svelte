<script lang="ts">
	import { page } from '$app/state';
	import PageHeaderWithAction from '$lib/components/page-header-with-action.svelte';
	import PageNav from '$lib/components/page-nav.svelte';
	import { get_contacts } from '../../contacts/contacts.remote';
	import { get_user_preferences } from '../../settings/settings.remote';
	import { create_follow_up } from '../follow-ups.remote';

	const preselected_contact_id = $derived(
		page.url.searchParams.get('contact_id'),
	);

	function get_default_date(days_offset: number): {
		date_string: string;
		timestamp: number;
	} {
		const date = new Date();
		date.setDate(date.getDate() + days_offset);
		date.setHours(9, 0, 0, 0);
		return {
			date_string: date.toISOString().slice(0, 16),
			timestamp: date.getTime(),
		};
	}

	let date_input_value = $state('');
	let timestamp = $state(0);

	function handle_date_change(e: Event) {
		const target = e.target as HTMLInputElement;
		date_input_value = target.value;
		timestamp = new Date(target.value).getTime();
	}
</script>

<PageHeaderWithAction title="Create New Follow-up" />
<PageNav />

{#await get_user_preferences() then preferences}
	{@const default_values = get_default_date(
		preferences.default_follow_up_days,
	)}
	{#if !date_input_value}
		{((date_input_value = default_values.date_string),
		(timestamp = default_values.timestamp),
		'')}
	{/if}

	<form {...create_follow_up} class="card bg-base-100 shadow-xl">
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
				<legend class="fieldset-legend">Due Date</legend>
				<label class="input w-full">
					<input
						type="datetime-local"
						required
						value={date_input_value}
						oninput={handle_date_change}
					/>
				</label>
				<input type="hidden" name="due_date" value={timestamp} />
				<p class="mt-1 text-sm opacity-60">
					When do you want to follow up with this contact?
				</p>
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Notes (Optional)</legend>
				<textarea
					name="note"
					class="textarea w-full"
					rows="6"
					placeholder="What do you need to follow up about?"
				></textarea>
			</fieldset>

			<div class="card-actions justify-end">
				<a href="/follow-ups" class="btn btn-outline">Cancel</a>
				<button type="submit" class="btn btn-primary">
					Create Follow-up
				</button>
			</div>
		</div>
	</form>
{/await}
