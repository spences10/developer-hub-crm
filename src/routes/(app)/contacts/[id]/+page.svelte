<script lang="ts">
	import { page } from '$app/state';
	import { delete_contact, get_contact } from '../contacts.remote';

	const contact_id = $derived(page.params.id);

	async function handle_delete() {
		if (confirm('Are you sure you want to delete this contact?')) {
			await delete_contact(contact_id);
		}
	}
</script>

<div class="mx-auto max-w-4xl">
	<div class="mb-8">
		<a href="/contacts" class="link link-hover">
			&larr; Back to Contacts
		</a>
	</div>

	{#if contact_id}
		{#await get_contact(contact_id) then contact}
			<div class="mb-6 flex items-start justify-between">
				<div>
					<h1 class="text-3xl font-bold">
						{contact.name}
						{#if contact.is_vip}
							<span class="ml-2 badge badge-primary">VIP</span>
						{/if}
					</h1>
				</div>
				<div class="flex gap-2">
					<a
						href="/contacts/{contact.id}/edit"
						class="btn btn-outline"
					>
						Edit
					</a>
					<button
						onclick={handle_delete}
						class="btn btn-outline btn-error"
					>
						Delete
					</button>
				</div>
			</div>

			<div class="grid gap-6 md:grid-cols-2">
				<!-- Contact Info Card -->
				<div class="card bg-base-100 shadow-xl">
					<div class="card-body">
						<h2 class="card-title">Contact Information</h2>
						<div class="space-y-3">
							{#if contact.email}
								<div>
									<p class="text-sm opacity-70">Email</p>
									<a
										href="mailto:{contact.email}"
										class="link link-primary"
									>
										{contact.email}
									</a>
								</div>
							{/if}

							{#if contact.phone}
								<div>
									<p class="text-sm opacity-70">Phone</p>
									<a
										href="tel:{contact.phone}"
										class="link link-primary"
									>
										{contact.phone}
									</a>
								</div>
							{/if}

							{#if contact.company}
								<div>
									<p class="text-sm opacity-70">Company</p>
									<p>{contact.company}</p>
								</div>
							{/if}

							{#if contact.title}
								<div>
									<p class="text-sm opacity-70">Title</p>
									<p>{contact.title}</p>
								</div>
							{/if}

							{#if contact.github_username}
								<div>
									<p class="text-sm opacity-70">GitHub</p>
									<a
										href="https://github.com/{contact.github_username}"
										target="_blank"
										rel="noopener noreferrer"
										class="link link-primary"
									>
										@{contact.github_username}
									</a>
								</div>
							{/if}

							{#if contact.birthday}
								<div>
									<p class="text-sm opacity-70">Birthday</p>
									<p>
										{new Date(contact.birthday).toLocaleDateString()}
									</p>
								</div>
							{/if}
						</div>
					</div>
				</div>

				<!-- Stats Card -->
				<div class="card bg-base-100 shadow-xl">
					<div class="card-body">
						<h2 class="card-title">Activity</h2>
						<div class="space-y-3">
							<div>
								<p class="text-sm opacity-70">Total Interactions</p>
								<p class="text-2xl font-bold">
									{contact.interaction_count}
								</p>
							</div>

							{#if contact.last_interaction_at}
								<div>
									<p class="text-sm opacity-70">Last Contact</p>
									<p>
										{new Date(
											contact.last_interaction_at,
										).toLocaleDateString()}
									</p>
								</div>
							{/if}

							<div>
								<p class="text-sm opacity-70">Pending Follow-ups</p>
								<p class="text-2xl font-bold">
									{contact.pending_follow_ups}
								</p>
							</div>

							{#if contact.last_contacted_at}
								<div>
									<p class="text-sm opacity-70">Last Contacted</p>
									<p>
										{new Date(
											contact.last_contacted_at,
										).toLocaleDateString()}
									</p>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<!-- Notes Card -->
			{#if contact.notes}
				<div class="card mt-6 bg-base-100 shadow-xl">
					<div class="card-body">
						<h2 class="card-title">Notes</h2>
						<p class="whitespace-pre-wrap">{contact.notes}</p>
					</div>
				</div>
			{/if}

			<!-- Metadata -->
			<div class="mt-6 text-sm opacity-50">
				<p>
					Created: {new Date(contact.created_at).toLocaleString()}
				</p>
				<p>
					Last updated: {new Date(
						contact.updated_at,
					).toLocaleString()}
				</p>
			</div>
		{/await}
	{/if}
</div>
