<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Contact } from '$lib/server/db/schema';
	import { create_contact_state } from '$lib/state/contacts.svelte';
	import type { PageData } from './$types';

	// Get data from the server
	const { data } = $props<{ data: PageData }>();

	// Initialize the state with context API and server data
	const contact_state = create_contact_state(data.contacts || []);

	// State for UI
	let is_creating = $state(false);
	let is_editing = $state(false);
	let current_contact = $state<Contact | null>(null);
	let search_term = $state('');
	let show_vip_only = $state(false);

	// Get user initial for avatar
	const user_initial = $derived(() => {
		if (data.user && data.user.username) {
			return data.user.username.charAt(0).toUpperCase();
		}
		return '?';
	});

	// Filtered contacts based on search and VIP filter
	const filtered_contacts = $derived.by(() => {
		// First filter by search term
		const search_filtered = search_term
			? contact_state.contacts.filter((contact: Contact) => {
					return (
						contact.name
							.toLowerCase()
							.includes(search_term.toLowerCase()) ||
						(contact.industry &&
							contact.industry
								.toLowerCase()
								.includes(search_term.toLowerCase())) ||
						(contact.location &&
							contact.location
								.toLowerCase()
								.includes(search_term.toLowerCase()))
					);
				})
			: contact_state.contacts;

		// Then filter by VIP status if needed
		return show_vip_only
			? search_filtered.filter((contact: Contact) => contact.vip)
			: search_filtered;
	});

	// Toggle create form
	function toggle_create_form() {
		is_creating = !is_creating;
		is_editing = false;
		current_contact = null;
	}

	// Edit contact
	function edit_contact(contact: Contact) {
		current_contact = contact;
		is_editing = true;
		is_creating = false;
	}

	// Cancel editing
	function cancel_edit() {
		is_editing = false;
		current_contact = null;
	}

	// Reset form state
	function reset_form() {
		is_creating = false;
		is_editing = false;
		current_contact = null;
	}
</script>

<div class="bg-base-200 min-h-screen p-4">
	<!-- Navigation -->
	<div class="navbar bg-base-100 rounded-box mb-6 shadow-md">
		<div class="flex-1">
			<a href="/dashboard" class="btn btn-ghost text-xl"
				>Developer Hub CRM</a
			>
		</div>
		<div class="flex-none">
			<div class="dropdown dropdown-end">
				<label
					for="user-menu"
					class="btn btn-ghost btn-circle avatar placeholder"
				>
					<div
						class="bg-neutral text-neutral-content w-10 rounded-full"
					>
						<span>{user_initial}</span>
					</div>
				</label>
				<ul
					id="user-menu"
					class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
				>
					<li><a href="/profile">Profile</a></li>
					<li>
						<form method="POST" action="/auth?/logout">
							<button type="submit" class="w-full text-left"
								>Logout</button
							>
						</form>
					</li>
				</ul>
			</div>
		</div>
	</div>

	<!-- Main content -->
	<div class="container mx-auto">
		<div
			class="mb-6 flex flex-col items-center justify-between md:flex-row"
		>
			<h1 class="text-3xl font-bold">Contacts</h1>
			<div class="mt-4 flex flex-col gap-4 sm:flex-row md:mt-0">
				<button class="btn btn-primary" onclick={toggle_create_form}>
					{is_creating ? 'Cancel' : 'Add Contact'}
				</button>
			</div>
		</div>

		<!-- Search and filter -->
		<div class="mb-6 flex flex-col gap-4 md:flex-row">
			<div class="form-control flex-1">
				<div class="input-group">
					<input
						type="text"
						placeholder="Search contacts..."
						class="input input-bordered w-full"
						bind:value={search_term}
					/>
					<button class="btn btn-square" aria-label="Search contacts">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 01-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</button>
				</div>
			</div>
			<div class="form-control">
				<label class="label cursor-pointer">
					<span class="label-text mr-2">VIP Only</span>
					<input
						type="checkbox"
						class="toggle toggle-primary"
						bind:checked={show_vip_only}
					/>
				</label>
			</div>
		</div>

		<!-- Create/Edit Contact Form -->
		{#if is_creating || is_editing}
			<div class="card bg-base-100 mb-6 shadow-xl">
				<div class="card-body">
					<h2 class="card-title">
						{is_editing ? 'Edit Contact' : 'Add New Contact'}
					</h2>

					<form
						method="POST"
						action={is_editing ? '?/update' : '?/create'}
						use:enhance={({ formData }) => {
							return async ({ result }) => {
								if (result.type === 'success') {
									// Update state based on action type
									if (is_editing) {
										const updated_contact = result.data as Contact;
										contact_state.update_contact(updated_contact);
									} else {
										const new_contact = result.data as Contact;
										contact_state.add_contact(new_contact);
									}
									reset_form();
								}
							};
						}}
					>
						{#if is_editing && current_contact}
							<input
								type="hidden"
								name="id"
								value={current_contact.id}
							/>
						{/if}

						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div class="form-control">
								<label class="label" for="name">
									<span class="label-text">Name*</span>
								</label>
								<div class="relative">
									<input
										type="text"
										id="name"
										name="name"
										class="input input-bordered w-full"
										value={current_contact?.name || ''}
										required
									/>
									<!-- Future Speech-to-Text integration point -->
									<button
										type="button"
										class="btn btn-circle btn-ghost btn-xs tooltip tooltip-left absolute top-1/2 right-2 -translate-y-1/2 transform"
										data-tip="Speech-to-text coming soon!"
										aria-label="Speech-to-text for name"
										disabled
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
											/>
										</svg>
									</button>
								</div>
							</div>

							<div class="form-control">
								<label class="label" for="relationship">
									<span class="label-text">Relationship</span>
								</label>
								<div class="relative">
									<input
										type="text"
										id="relationship"
										name="relationship"
										class="input input-bordered w-full"
										value={current_contact?.relationship || ''}
									/>
									<!-- Future Speech-to-Text integration point -->
									<button
										type="button"
										class="btn btn-circle btn-ghost btn-xs tooltip tooltip-left absolute top-1/2 right-2 -translate-y-1/2 transform"
										data-tip="Speech-to-text coming soon!"
										aria-label="Speech-to-text for relationship"
										disabled
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
											/>
										</svg>
									</button>
								</div>
							</div>

							<div class="form-control">
								<label class="label" for="industry">
									<span class="label-text">Industry</span>
								</label>
								<div class="relative">
									<input
										type="text"
										id="industry"
										name="industry"
										class="input input-bordered w-full"
										value={current_contact?.industry || ''}
									/>
									<!-- Future Speech-to-Text integration point -->
									<button
										type="button"
										class="btn btn-circle btn-ghost btn-xs tooltip tooltip-left absolute top-1/2 right-2 -translate-y-1/2 transform"
										data-tip="Speech-to-text coming soon!"
										aria-label="Speech-to-text for industry"
										disabled
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
											/>
										</svg>
									</button>
								</div>
							</div>

							<div class="form-control">
								<label class="label" for="location">
									<span class="label-text">Location</span>
								</label>
								<div class="relative">
									<input
										type="text"
										id="location"
										name="location"
										class="input input-bordered w-full"
										value={current_contact?.location || ''}
									/>
									<!-- Future Speech-to-Text integration point -->
									<button
										type="button"
										class="btn btn-circle btn-ghost btn-xs tooltip tooltip-left absolute top-1/2 right-2 -translate-y-1/2 transform"
										data-tip="Speech-to-text coming soon!"
										aria-label="Speech-to-text for location"
										disabled
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
											/>
										</svg>
									</button>
								</div>
							</div>
						</div>

						<div class="form-control mt-4">
							<label class="label cursor-pointer justify-start">
								<input
									type="checkbox"
									name="vip"
									class="checkbox checkbox-primary mr-2"
									checked={current_contact?.vip || false}
								/>
								<span class="label-text">VIP Contact</span>
							</label>
						</div>

						<!-- Future Speech-to-Text transcript preview area -->
						<div class="bg-base-200 mt-4 hidden rounded-lg p-4">
							<h3 class="mb-2 font-semibold">Speech Transcript</h3>
							<p class="text-sm opacity-70">
								This area will display the speech transcript and allow
								for editing before applying to fields.
							</p>
							<div class="mt-2 flex justify-end">
								<button type="button" class="btn btn-sm btn-outline"
									>Apply to Fields</button
								>
							</div>
						</div>

						<div class="card-actions mt-6 justify-end">
							<button
								type="button"
								class="btn btn-ghost"
								onclick={reset_form}>Cancel</button
							>
							<button type="submit" class="btn btn-primary">
								{is_editing ? 'Update Contact' : 'Save Contact'}
							</button>
						</div>
					</form>
				</div>
			</div>
		{/if}

		<!-- Contacts List -->
		{#if filtered_contacts.length > 0}
			<div
				class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
			>
				{#each filtered_contacts as contact (contact.id)}
					<div class="card bg-base-100 shadow-xl">
						<div class="card-body">
							<div class="flex items-start justify-between">
								<h2 class="card-title">
									{contact.name}
									{#if contact.vip}
										<div class="badge badge-primary">VIP</div>
									{/if}
								</h2>
								<div class="dropdown dropdown-end">
									<button
										class="btn btn-ghost btn-xs btn-circle"
										aria-label="Contact options"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
											/>
										</svg>
									</button>
									<ul
										class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
									>
										<li>
											<button onclick={() => edit_contact(contact)}
												>Edit</button
											>
										</li>
										<li>
											<form
												method="POST"
												action="?/delete"
												use:enhance={({ formData }) => {
													return async ({ result }) => {
														if (result.type === 'success') {
															// Handle success
														}
													};
												}}
											>
												<input
													type="hidden"
													name="id"
													value={contact.id}
												/>
												<button type="submit" class="text-error"
													>Delete</button
												>
											</form>
										</li>
									</ul>
								</div>
							</div>

							{#if contact.relationship}
								<p>
									<span class="font-semibold">Relationship:</span>
									{contact.relationship}
								</p>
							{/if}

							{#if contact.industry}
								<p>
									<span class="font-semibold">Industry:</span>
									{contact.industry}
								</p>
							{/if}

							{#if contact.location}
								<p>
									<span class="font-semibold">Location:</span>
									{contact.location}
								</p>
							{/if}

							<div class="card-actions mt-4 justify-end">
								<a
									href={`/contacts/${contact.id}`}
									class="btn btn-sm btn-outline"
								>
									View Details
								</a>
								{#if contact.vip}
									<a
										href={`/contacts/${contact.id}/vip`}
										class="btn btn-sm btn-primary"
									>
										VIP Profile
									</a>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body text-center">
					<h2 class="card-title justify-center">No contacts found</h2>
					<p>
						{search_term || show_vip_only
							? 'Try adjusting your search or filters'
							: 'Get started by adding your first contact'}
					</p>
					{#if !is_creating}
						<div class="card-actions mt-4 justify-center">
							<button
								class="btn btn-primary"
								onclick={toggle_create_form}>Add Contact</button
							>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>
