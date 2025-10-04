<script lang="ts">
	import { get_contacts } from './contacts.remote';

	let search = $state('');
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
	{#await get_contacts(search) then contacts}
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
						{#each contacts as contact}
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
