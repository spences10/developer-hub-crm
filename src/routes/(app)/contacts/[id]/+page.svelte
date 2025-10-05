<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { type_badges } from '$lib/constants/badges';
	import SocialLinkIcon from '$lib/components/social-link.svelte';
	import {
		format_date,
		format_due_date,
		is_overdue,
	} from '$lib/utils/date-helpers';
	import {
		complete_follow_up,
		delete_follow_up,
		get_contact_follow_ups,
		reopen_follow_up,
	} from '../../follow-ups/follow-ups.remote';
	import { get_interactions } from '../../interactions/interactions.remote';
	import { get_user_preferences } from '../../settings/settings.remote';
	import { delete_contact, get_contact } from '../contacts.remote';

	const contact_id = $derived(page.params.id);

	// Reactive key to trigger re-fetches after mutations
	let refresh_key = $state(0);
	let deleting = $state(false);

	async function handle_delete() {
		deleting = true;
		const result = await delete_contact(contact_id);
		if (result && 'success' in result) {
			goto('/contacts');
		}
		deleting = false;
	}

	async function handle_complete_follow_up(id: string) {
		await complete_follow_up(id);
		refresh_key++;
	}

	async function handle_reopen_follow_up(id: string) {
		await reopen_follow_up(id);
		refresh_key++;
	}

	async function handle_delete_follow_up(id: string) {
		await delete_follow_up(id);
		refresh_key++;
	}
</script>

<div class="mx-auto max-w-4xl">
	<div class="mb-8">
		<a href="/contacts" class="link link-hover">
			&larr; Back to Contacts
		</a>
	</div>

	{#if contact_id}
		{#key refresh_key}
			{#await Promise.all( [get_contact(contact_id), get_user_preferences()], ) then [contact, preferences]}
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
							disabled={deleting}
							class="btn btn-outline btn-error"
						>
							{#if deleting}
								<span class="loading loading-sm loading-spinner"
								></span>
								Deleting...
							{:else}
								Delete
							{/if}
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
											{format_date(
												new Date(contact.birthday),
												preferences.date_format,
											)}
										</p>
									</div>
								{/if}

								{#if contact.social_links && contact.social_links.length > 0}
									<div>
										<p class="mb-2 text-sm opacity-70">
											Social Links
										</p>
										<div class="flex flex-wrap gap-2">
											{#each contact.social_links as link}
												<a
													href={link.url}
													target="_blank"
													rel="noopener noreferrer"
													class="badge gap-1 badge-outline badge-lg"
												>
													<SocialLinkIcon platform={link.platform} />
													{link.platform}
												</a>
											{/each}
										</div>
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
											{format_date(
												new Date(contact.last_interaction_at),
												preferences.date_format,
											)}
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
											{format_date(
												new Date(contact.last_contacted_at),
												preferences.date_format,
											)}
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

				<!-- Follow-ups Section -->
				<div class="card mt-6 bg-base-100 shadow-xl">
					<div class="card-body">
						<div class="mb-4 flex items-center justify-between">
							<h2 class="card-title">Follow-ups</h2>
							<a
								href="/follow-ups/new?contact_id={contact.id}"
								class="btn btn-sm btn-primary"
							>
								Add Follow-up
							</a>
						</div>

						{#if contact_id}
							{#await get_contact_follow_ups(contact_id) then follow_ups}
								{@const pending_follow_ups = follow_ups.filter(
									(f) => !f.completed,
								)}
								{#if pending_follow_ups.length === 0}
									<p class="py-4 text-center opacity-70">
										No pending follow-ups.
									</p>
								{:else}
									<div class="space-y-3">
										{#each pending_follow_ups as follow_up}
											{@const overdue = is_overdue(
												follow_up.due_date,
											)}
											<div class="rounded-box bg-base-200 p-4">
												<div
													class="mb-2 flex items-center justify-between"
												>
													<div>
														<span
															class="text-sm font-medium"
															class:text-error={overdue}
														>
															{format_due_date(
																follow_up.due_date,
																preferences.date_format,
															)}
														</span>
														{#if overdue}
															<span
																class="ml-2 badge badge-sm badge-error"
															>
																Overdue
															</span>
														{/if}
													</div>
													<div class="flex gap-2">
														<button
															onclick={() =>
																handle_complete_follow_up(
																	follow_up.id,
																)}
															class="btn btn-xs btn-success"
														>
															Complete
														</button>
														<button
															onclick={() =>
																handle_delete_follow_up(follow_up.id)}
															class="btn btn-outline btn-xs btn-error"
														>
															Delete
														</button>
													</div>
												</div>
												{#if follow_up.note}
													<p class="text-sm whitespace-pre-wrap">
														{follow_up.note}
													</p>
												{/if}
											</div>
										{/each}
									</div>

									{#if pending_follow_ups.length > 3}
										<div class="mt-4 text-center">
											<a href="/follow-ups" class="link link-primary">
												View all follow-ups
											</a>
										</div>
									{/if}
								{/if}
							{/await}
						{/if}
					</div>
				</div>

				<!-- Interactions Section -->
				<div class="card mt-6 bg-base-100 shadow-xl">
					<div class="card-body">
						<div class="mb-4 flex items-center justify-between">
							<h2 class="card-title">Interactions</h2>
							<a
								href="/interactions/new?contact_id={contact.id}"
								class="btn btn-sm btn-primary"
							>
								Log Interaction
							</a>
						</div>

						{#if contact_id}
							{#await get_interactions(contact_id) then interactions}
								{#if interactions.length === 0}
									<p class="py-4 text-center opacity-70">
										No interactions logged yet.
									</p>
								{:else}
									<div class="space-y-3">
										{#each interactions as interaction}
											<div class="rounded-box bg-base-200 p-4">
												<div class="mb-2 flex items-center gap-2">
													<span
														class="badge {type_badges[
															interaction.type
														]}"
													>
														{interaction.type}
													</span>
													<span class="text-sm opacity-60">
														{format_date(
															new Date(interaction.created_at),
															preferences.date_format,
														)}
													</span>
												</div>
												{#if interaction.note}
													<p class="text-sm whitespace-pre-wrap">
														{interaction.note}
													</p>
												{/if}
											</div>
										{/each}
									</div>

									{#if interactions.length > 5}
										<div class="mt-4 text-center">
											<a
												href="/interactions"
												class="link link-primary"
											>
												View all interactions
											</a>
										</div>
									{/if}
								{/if}
							{/await}
						{/if}
					</div>
				</div>

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
		{/key}
	{/if}
</div>
