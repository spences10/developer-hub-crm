<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import ConfirmDialog from '$lib/components/confirm-dialog.svelte';
	import EmptyState from '$lib/components/empty-state.svelte';
	import FollowUpCard from '$lib/components/follow-up-card.svelte';
	import InteractionCard from '$lib/components/interaction-card.svelte';
	import PageHeaderWithAction from '$lib/components/page-header-with-action.svelte';
	import PageNav from '$lib/components/page-nav.svelte';
	import SocialLinkIcon from '$lib/components/social-link.svelte';
	import { Edit, Trash } from '$lib/icons';
	import { format_date } from '$lib/utils/date-helpers';
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
	let show_delete_confirmation = $state(false);

	function handle_delete_click() {
		show_delete_confirmation = true;
	}

	async function confirm_delete() {
		const result = await delete_contact(contact_id);
		if (result && 'success' in result) {
			goto('/contacts');
		}
		show_delete_confirmation = false;
	}

	function cancel_delete() {
		show_delete_confirmation = false;
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

<div class="mx-auto max-w-6xl">
	{#if contact_id}
		{#key refresh_key}
			{#await Promise.all( [get_contact(contact_id), get_user_preferences()], ) then [contact, preferences]}
				<PageHeaderWithAction title={contact.name}>
					<div class="flex gap-2">
						<a
							href="/contacts/{contact.id}/edit"
							class="tooltip btn text-info btn-ghost btn-sm"
							data-tip="Edit"
							aria-label="Edit contact"
						>
							<Edit size="20px" />
						</a>
						{#if show_delete_confirmation}
							<ConfirmDialog
								is_inline={true}
								message="Delete contact?"
								on_confirm={confirm_delete}
								on_cancel={cancel_delete}
							/>
						{:else}
							<button
								onclick={handle_delete_click}
								class="tooltip btn text-error btn-ghost btn-sm"
								data-tip="Delete"
								aria-label="Delete contact"
							>
								<Trash size="20px" />
							</button>
						{/if}
					</div>
				</PageHeaderWithAction>
				<PageNav />

				<!-- Compact Contact Info Panel -->
				<div class="card mb-6 bg-base-100 shadow-xl">
					<div class="card-body">
						<div class="grid gap-6 md:grid-cols-3">
							<!-- Contact Details Column -->
							<div class="space-y-3">
								<h3
									class="text-sm font-semibold uppercase opacity-70"
								>
									Contact Info
								</h3>
								{#if contact.is_vip}
									<div>
										<span class="badge badge-primary">VIP</span>
									</div>
								{/if}
								{#if contact.email}
									<div>
										<p class="text-xs opacity-70">Email</p>
										<a
											href="mailto:{contact.email}"
											class="link text-sm link-primary"
										>
											{contact.email}
										</a>
									</div>
								{/if}
								{#if contact.phone}
									<div>
										<p class="text-xs opacity-70">Phone</p>
										<a
											href="tel:{contact.phone}"
											class="link text-sm link-primary"
										>
											{contact.phone}
										</a>
									</div>
								{/if}
								{#if contact.birthday}
									<div>
										<p class="text-xs opacity-70">Birthday</p>
										<p class="text-sm">
											{format_date(
												new Date(contact.birthday),
												preferences.date_format,
											)}
										</p>
									</div>
								{/if}
							</div>

							<!-- Work Details Column -->
							<div class="space-y-3">
								<h3
									class="text-sm font-semibold uppercase opacity-70"
								>
									Work Info
								</h3>
								{#if contact.company}
									<div>
										<p class="text-xs opacity-70">Company</p>
										<p class="text-sm">{contact.company}</p>
									</div>
								{/if}
								{#if contact.title}
									<div>
										<p class="text-xs opacity-70">Title</p>
										<p class="text-sm">{contact.title}</p>
									</div>
								{/if}
								{#if contact.github_username}
									<div>
										<p class="text-xs opacity-70">GitHub</p>
										<a
											href="https://github.com/{contact.github_username}"
											target="_blank"
											rel="noopener noreferrer"
											class="link text-sm link-primary"
										>
											@{contact.github_username}
										</a>
									</div>
								{/if}
								{#if contact.social_links && contact.social_links.length > 0}
									<div>
										<p class="mb-1 text-xs opacity-70">Social</p>
										<div class="flex flex-wrap gap-1">
											{#each contact.social_links as link}
												<a
													href={link.url}
													target="_blank"
													rel="noopener noreferrer"
													class="badge gap-1 badge-outline badge-sm"
												>
													<SocialLinkIcon platform={link.platform} />
													{link.platform}
												</a>
											{/each}
										</div>
									</div>
								{/if}
							</div>

							<!-- Activity Stats Column -->
							<div class="space-y-3">
								<h3
									class="text-sm font-semibold uppercase opacity-70"
								>
									Activity
								</h3>
								<div>
									<p class="text-xs opacity-70">Total Interactions</p>
									<p class="text-2xl font-bold">
										{contact.interaction_count}
									</p>
								</div>
								<div>
									<p class="text-xs opacity-70">Pending Follow-ups</p>
									<p class="text-2xl font-bold">
										{contact.pending_follow_ups}
									</p>
								</div>
								{#if contact.last_interaction_at}
									<div>
										<p class="text-xs opacity-70">Last Contact</p>
										<p class="text-sm">
											{format_date(
												new Date(contact.last_interaction_at),
												preferences.date_format,
											)}
										</p>
									</div>
								{/if}
								{#if contact.last_contacted_at}
									<div>
										<p class="text-xs opacity-70">Last Contacted</p>
										<p class="text-sm">
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
									<EmptyState message="No pending follow-ups." />
								{:else}
									<div class="space-y-3">
										{#each pending_follow_ups as follow_up}
											<FollowUpCard
												{follow_up}
												date_format={preferences.date_format}
												variant="full"
												on_complete={handle_complete_follow_up}
												on_delete={handle_delete_follow_up}
											/>
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
									<EmptyState message="No interactions logged yet." />
								{:else}
									<div class="space-y-3">
										{#each interactions as interaction}
											<InteractionCard
												{interaction}
												date_format={preferences.date_format}
												variant="full"
											/>
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
			{/await}
		{/key}
	{/if}
</div>
