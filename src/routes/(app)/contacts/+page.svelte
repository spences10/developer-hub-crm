<script lang="ts">
	import { goto } from '$app/navigation';
	import EmptyState from '$lib/components/empty-state.svelte';
	import ItemCount from '$lib/components/item-count.svelte';
	import PageHeaderWithAction from '$lib/components/page-header-with-action.svelte';
	import PageNav from '$lib/components/page-nav.svelte';
	import SortableTableHeader from '$lib/components/sortable-table-header.svelte';
	import { StarFill } from '$lib/icons';
	import { seo_configs } from '$lib/seo';
	import type { Contact } from '$lib/types/db';
	import { Head } from 'svead';
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

	// Helper to get initials from name
	function get_initials(name: string): string {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}
</script>

<Head seo_config={seo_configs.contacts} />

<div class="mx-auto max-w-6xl">
	<PageHeaderWithAction title="Contacts">
		<a href="/contacts/new" class="btn btn-primary">New Contact</a>
	</PageHeaderWithAction>
	<PageNav />
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
			<EmptyState
				message={search
					? 'No contacts found matching your search.'
					: 'No contacts yet.'}
				action_href={!search ? '/contacts/new' : undefined}
				action_text={!search ? 'Add Your First Contact' : undefined}
			/>
		{:else}
			<div class="overflow-x-auto">
				<table class="table">
					<thead>
						<tr>
							<SortableTableHeader
								label="Contact"
								column="name"
								{current_sort}
								{sort_direction}
								on_toggle={toggle_sort}
							/>
							<SortableTableHeader
								label="Email"
								column="email"
								{current_sort}
								{sort_direction}
								on_toggle={toggle_sort}
								class_names="hidden md:table-cell"
							/>
							<SortableTableHeader
								label="Company"
								column="company"
								{current_sort}
								{sort_direction}
								on_toggle={toggle_sort}
								class_names="hidden lg:table-cell"
							/>
							<SortableTableHeader
								label="Status"
								column="status"
								{current_sort}
								{sort_direction}
								on_toggle={toggle_sort}
								center={true}
								class_names="hidden md:table-cell"
							/>
						</tr>
					</thead>
					<tbody>
						{#each sorted_contacts as contact}
							<tr
								class="cursor-pointer hover:bg-base-100"
								onclick={() => goto(`/contacts/${contact.id}`)}
							>
								<td>
									<div class="flex items-center gap-3">
										{#if contact.avatar_url}
											<img
												src={contact.avatar_url}
												alt="{contact.name} avatar"
												class="size-10 rounded-full object-cover"
											/>
										{:else}
											<div
												class="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-bold text-primary-content"
											>
												{get_initials(contact.name)}
											</div>
										{/if}
										<div class="flex flex-col">
											<span class="font-medium">
												{contact.name}
											</span>
											{#if contact.github_username}
												<a
													href="https://github.com/{contact.github_username}"
													target="_blank"
													rel="noopener noreferrer"
													class="link text-xs link-primary"
													onclick={(e) => e.stopPropagation()}
												>
													@{contact.github_username}
												</a>
											{/if}
											<div
												class="mt-1 text-xs text-base-content/70 md:hidden"
											>
												{contact.email || 'No email'}
											</div>
										</div>
									</div>
								</td>
								<td class="hidden md:table-cell">
									{contact.email || '-'}
								</td>
								<td class="hidden lg:table-cell">
									{contact.company || '-'}
								</td>
								<td class="hidden text-center md:table-cell">
									{#if contact.is_vip}
										<div class="inline-block" title="VIP">
											<StarFill
												size="48px"
												class_names="h-4 w-4 text-warning"
											/>
										</div>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<ItemCount count={contacts.length} item_name="contact" />
		{/if}
	{/await}
</div>
