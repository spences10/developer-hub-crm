<script lang="ts">
	import type { Contact } from '$lib/types/db';
	import { get_user_preferences } from '../settings/settings.remote';
	import { get_contacts } from './contacts.remote';

	let search = $state('');

	function sort_contacts(
		contacts: Contact[],
		sort_by: 'name' | 'last_contacted' | 'recently_added' | 'company',
	): Contact[] {
		const sorted = [...contacts];
		switch (sort_by) {
			case 'name':
				return sorted.sort((a, b) => a.name.localeCompare(b.name));
			case 'last_contacted':
				return sorted.sort((a, b) => {
					const a_time = a.last_contacted_at || 0;
					const b_time = b.last_contacted_at || 0;
					return b_time - a_time; // Most recent first
				});
			case 'recently_added':
				return sorted.sort((a, b) => b.created_at - a.created_at);
			case 'company':
				return sorted.sort((a, b) => {
					const a_company = a.company || '';
					const b_company = b.company || '';
					return a_company.localeCompare(b_company);
				});
			default:
				return sorted;
		}
	}
</script>

<div class="mx-auto max-w-6xl">
	<div class="mb-8 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Contacts</h1>
		<a href="/contacts/new" class="btn btn-primary">New Contact</a>
	</div>

	<!-- Search Bar -->
	<div class="mb-6">
		<fieldset class="fieldset">
			<legend class="fieldset-legend">Search</legend>
			<label class="input w-full">
				<input
					type="text"
					bind:value={search}
					placeholder="Search by name, email, company, or GitHub username"
					class="grow"
				/>
			</label>
		</fieldset>
	</div>

	<!-- Contacts List -->
	{#await Promise.all( [get_contacts(search), get_user_preferences()], ) then [contacts, preferences]}
		{@const sorted_contacts = sort_contacts(
			contacts,
			preferences.default_contact_sort,
		)}
		{#if contacts.length === 0}
			<div class="py-12 text-center">
				<p class="text-lg opacity-70">
					{search
						? 'No contacts found matching your search.'
						: 'No contacts yet.'}
				</p>
				{#if !search}
					<a href="/contacts/new" class="btn mt-4 btn-primary">
						Add Your First Contact
					</a>
				{/if}
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="table">
					<thead>
						<tr>
							<th>Name</th>
							<th>Email</th>
							<th>Company</th>
							<th>GitHub</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{#each sorted_contacts as contact}
							<tr class="hover">
								<td>
									<a
										href="/contacts/{contact.id}"
										class="link font-medium link-hover"
									>
										{contact.name}
									</a>
								</td>
								<td>{contact.email || '-'}</td>
								<td>{contact.company || '-'}</td>
								<td>
									{#if contact.github_username}
										<a
											href="https://github.com/{contact.github_username}"
											target="_blank"
											rel="noopener noreferrer"
											class="link link-primary"
										>
											@{contact.github_username}
										</a>
									{:else}
										-
									{/if}
								</td>
								<td>
									{#if contact.is_vip}
										<span class="badge badge-primary">VIP</span>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<div class="mt-4 text-sm opacity-70">
				Showing {contacts.length} contact{contacts.length !== 1
					? 's'
					: ''}
			</div>
		{/if}
	{/await}
</div>
