<script lang="ts">
	import type { Contact } from '$lib/types/db';
	import { get_user_preferences } from '../settings/settings.remote';
	import { get_contacts } from './contacts.remote';

	let search = $state('');
	let current_sort = $state<
		| 'name'
		| 'email'
		| 'company'
		| 'github'
		| 'status'
		| 'last_contacted'
		| 'recently_added'
	>('name');
	let sort_direction = $state<'asc' | 'desc'>('asc');

	function sort_contacts(contacts: Contact[]): Contact[] {
		const sorted = [...contacts];
		switch (current_sort) {
			case 'name':
				sorted.sort((a, b) => a.name.localeCompare(b.name));
				break;
			case 'email':
				sorted.sort((a, b) => {
					const a_email = a.email || '';
					const b_email = b.email || '';
					return a_email.localeCompare(b_email);
				});
				break;
			case 'company':
				sorted.sort((a, b) => {
					const a_company = a.company || '';
					const b_company = b.company || '';
					return a_company.localeCompare(b_company);
				});
				break;
			case 'github':
				sorted.sort((a, b) => {
					const a_github = a.github_username || '';
					const b_github = b.github_username || '';
					return a_github.localeCompare(b_github);
				});
				break;
			case 'status':
				sorted.sort((a, b) => b.is_vip - a.is_vip); // VIPs first
				break;
			case 'last_contacted':
				sorted.sort((a, b) => {
					const a_time = a.last_contacted_at || 0;
					const b_time = b.last_contacted_at || 0;
					return b_time - a_time; // Most recent first
				});
				break;
			case 'recently_added':
				sorted.sort((a, b) => b.created_at - a.created_at);
				break;
		}

		// Apply direction
		if (sort_direction === 'desc') {
			sorted.reverse();
		}

		return sorted;
	}

	function toggle_sort(
		column:
			| 'name'
			| 'email'
			| 'company'
			| 'github'
			| 'status'
			| 'last_contacted'
			| 'recently_added',
	) {
		if (current_sort === column) {
			// Toggle direction
			sort_direction = sort_direction === 'asc' ? 'desc' : 'asc';
		} else {
			// New column, default to asc
			current_sort = column;
			sort_direction = 'asc';
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
		{#if !current_sort}
			{(current_sort =
				preferences.default_contact_sort === 'recently_added' ||
				preferences.default_contact_sort === 'last_contacted'
					? 'name'
					: preferences.default_contact_sort)}
		{/if}
		{@const sorted_contacts = sort_contacts(contacts)}
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
							<th>
								<button
									onclick={() => toggle_sort('name')}
									class="flex items-center gap-1 hover:underline"
								>
									Name
									{#if current_sort === 'name'}
										{#if sort_direction === 'asc'}
											↑
										{:else}
											↓
										{/if}
									{/if}
								</button>
							</th>
							<th>
								<button
									onclick={() => toggle_sort('email')}
									class="flex items-center gap-1 hover:underline"
								>
									Email
									{#if current_sort === 'email'}
										{#if sort_direction === 'asc'}
											↑
										{:else}
											↓
										{/if}
									{/if}
								</button>
							</th>
							<th>
								<button
									onclick={() => toggle_sort('company')}
									class="flex items-center gap-1 hover:underline"
								>
									Company
									{#if current_sort === 'company'}
										{#if sort_direction === 'asc'}
											↑
										{:else}
											↓
										{/if}
									{/if}
								</button>
							</th>
							<th>
								<button
									onclick={() => toggle_sort('github')}
									class="flex items-center gap-1 hover:underline"
								>
									GitHub
									{#if current_sort === 'github'}
										{#if sort_direction === 'asc'}
											↑
										{:else}
											↓
										{/if}
									{/if}
								</button>
							</th>
							<th>
								<button
									onclick={() => toggle_sort('status')}
									class="flex items-center gap-1 hover:underline"
								>
									Status
									{#if current_sort === 'status'}
										{#if sort_direction === 'asc'}
											↑
										{:else}
											↓
										{/if}
									{/if}
								</button>
							</th>
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
