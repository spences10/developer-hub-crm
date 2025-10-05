<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import ActivityCard from '$lib/components/activity-card.svelte';
	import ConfirmDialog from '$lib/components/confirm-dialog.svelte';
	import EmptyState from '$lib/components/empty-state.svelte';
	import PageHeaderWithAction from '$lib/components/page-header-with-action.svelte';
	import PageNav from '$lib/components/page-nav.svelte';
	import SocialLinkIcon from '$lib/components/social-link.svelte';
	import {
		Calendar,
		Call,
		Check,
		CircleBack,
		Edit,
		Email,
		Message,
		Trash,
	} from '$lib/icons';
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
		update_follow_up,
	} from '../../follow-ups/follow-ups.remote';
	import {
		delete_interaction,
		get_interactions,
		update_interaction,
	} from '../../interactions/interactions.remote';
	import { get_user_preferences } from '../../settings/settings.remote';
	import { delete_contact, get_contact } from '../contacts.remote';

	const contact_id = $derived(page.params.id);

	// Reactive key to trigger re-fetches after mutations
	let refresh_key = $state(0);
	let show_delete_confirmation = $state(false);

	// Follow-up state
	let delete_follow_up_id = $state<string | null>(null);
	let edit_follow_up_id = $state<string | null>(null);
	let edit_follow_up_due_date_str = $state('');
	let edit_follow_up_note = $state('');

	// Interaction state
	let delete_interaction_id = $state<string | null>(null);
	let edit_interaction_id = $state<string | null>(null);
	let edit_interaction_type = $state<
		'meeting' | 'call' | 'email' | 'message'
	>('meeting');
	let edit_interaction_note = $state('');

	const type_icons = {
		meeting: Calendar,
		call: Call,
		email: Email,
		message: Message,
	};

	const type_colors = {
		meeting: 'bg-primary text-primary-content',
		call: 'bg-secondary text-secondary-content',
		email: 'bg-accent text-accent-content',
		message: 'bg-info text-info-content',
	};

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

	// Follow-up handlers
	function handle_edit_follow_up_click(
		event: MouseEvent,
		follow_up: any,
	) {
		event.stopPropagation();
		edit_follow_up_id = follow_up.id;
		const date = new Date(follow_up.due_date);
		edit_follow_up_due_date_str = date.toISOString().slice(0, 16);
		edit_follow_up_note = follow_up.note || '';
	}

	async function save_edit_follow_up() {
		if (!edit_follow_up_id) return;
		const due_date = new Date(
			edit_follow_up_due_date_str,
		).getTime();
		await update_follow_up({
			id: edit_follow_up_id,
			due_date,
			note: edit_follow_up_note,
		});
		edit_follow_up_id = null;
		refresh_key++;
	}

	function cancel_edit_follow_up() {
		edit_follow_up_id = null;
	}

	async function handle_complete_follow_up(id: string) {
		await complete_follow_up(id);
		refresh_key++;
	}

	async function handle_reopen_follow_up(id: string) {
		await reopen_follow_up(id);
		refresh_key++;
	}

	function handle_delete_follow_up_click(
		event: MouseEvent,
		id: string,
	) {
		event.stopPropagation();
		delete_follow_up_id = id;
	}

	async function confirm_delete_follow_up() {
		if (!delete_follow_up_id) return;
		await delete_follow_up(delete_follow_up_id);
		delete_follow_up_id = null;
		refresh_key++;
	}

	function cancel_delete_follow_up() {
		delete_follow_up_id = null;
	}

	// Interaction handlers
	function handle_edit_interaction_click(
		event: MouseEvent,
		interaction: any,
	) {
		event.stopPropagation();
		edit_interaction_id = interaction.id;
		edit_interaction_type = interaction.type;
		edit_interaction_note = interaction.note || '';
	}

	async function save_edit_interaction() {
		if (!edit_interaction_id) return;
		await update_interaction({
			id: edit_interaction_id,
			type: edit_interaction_type,
			note: edit_interaction_note,
		});
		edit_interaction_id = null;
		refresh_key++;
	}

	function cancel_edit_interaction() {
		edit_interaction_id = null;
	}

	function handle_delete_interaction_click(
		event: MouseEvent,
		id: string,
	) {
		event.stopPropagation();
		delete_interaction_id = id;
	}

	async function confirm_delete_interaction() {
		if (!delete_interaction_id) return;
		await delete_interaction(delete_interaction_id);
		delete_interaction_id = null;
		refresh_key++;
	}

	function cancel_delete_interaction() {
		delete_interaction_id = null;
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
									<p class="text-sm font-bold">
										{contact.interaction_count}
									</p>
								</div>
								<div>
									<p class="text-xs opacity-70">Pending Follow-ups</p>
									<p class="text-sm font-bold">
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
									<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
										{#each pending_follow_ups as follow_up}
											{@const overdue =
												!follow_up.completed &&
												is_overdue(follow_up.due_date)}
											{@const icon_color =
												overdue && !follow_up.completed
													? 'bg-error text-error-content'
													: follow_up.completed
														? 'bg-success text-success-content'
														: 'bg-base-200'}
											{@const metadata_classes =
												overdue && !follow_up.completed
													? 'opacity-60 text-error'
													: 'opacity-60'}
											{#if edit_follow_up_id === follow_up.id}
												<!-- Edit Mode -->
												<div
													class="card bg-base-100 shadow-md transition-shadow hover:shadow-lg"
												>
													<div class="card-body p-4">
														<div class="space-y-4">
															<div class="flex items-center justify-between">
																<span class="text-lg font-semibold">
																	{contact.name}
																</span>
															</div>

															<div class="space-y-3">
																<label class="form-control w-full">
																	<div class="label">
																		<span class="label-text">Due Date</span>
																	</div>
																	<input
																		type="datetime-local"
																		bind:value={edit_follow_up_due_date_str}
																		class="input-bordered input w-full"
																	/>
																</label>

																<label class="form-control w-full">
																	<div class="label">
																		<span class="label-text">Note</span>
																	</div>
																	<textarea
																		bind:value={edit_follow_up_note}
																		class="textarea-bordered textarea h-24 w-full"
																		placeholder="Add a note..."
																	></textarea>
																</label>
															</div>

															<div class="flex justify-end gap-2">
																<button
																	class="btn btn-ghost btn-sm"
																	onclick={cancel_edit_follow_up}
																>
																	Cancel
																</button>
																<button
																	class="btn btn-sm btn-primary"
																	onclick={save_edit_follow_up}
																>
																	Save
																</button>
															</div>
														</div>
													</div>
												</div>
											{:else}
												<!-- View Mode -->
												<ActivityCard
													icon={Calendar}
													icon_color_classes={icon_color}
													contact_id={contact.id}
													contact_name={contact.name}
													metadata="Due: {format_due_date(
														follow_up.due_date,
														preferences.date_format,
													)}"
													{metadata_classes}
													note={follow_up.note}
													footer_text={follow_up.completed &&
													follow_up.completed_at
														? `Completed: ${format_date(
																new Date(follow_up.completed_at),
																preferences.date_format,
															)}`
														: undefined}
													show_delete_confirmation={delete_follow_up_id ===
														follow_up.id}
													on_confirm_delete={confirm_delete_follow_up}
													on_cancel_delete={cancel_delete_follow_up}
												>
													{#snippet action_buttons()}
														{#if follow_up.completed}
															<button
																onclick={() =>
																	handle_reopen_follow_up(follow_up.id)}
																class="btn gap-1 btn-ghost btn-xs"
																aria-label="Reopen follow-up"
															>
																<CircleBack size="16px" />
																Reopen
															</button>
														{:else}
															<button
																onclick={() =>
																	handle_complete_follow_up(follow_up.id)}
																class="btn gap-1 text-success btn-ghost btn-xs"
																aria-label="Complete follow-up"
															>
																<Check size="16px" />
																Complete
															</button>
														{/if}
														<button
															class="btn gap-1 btn-ghost btn-xs"
															aria-label="Edit follow-up"
															onclick={(e) =>
																handle_edit_follow_up_click(e, follow_up)}
														>
															<Edit size="16px" />
															Edit
														</button>
														<button
															class="btn gap-1 text-error btn-ghost btn-xs"
															aria-label="Delete follow-up"
															onclick={(e) =>
																handle_delete_follow_up_click(e, follow_up.id)}
														>
															<Trash size="16px" />
															Delete
														</button>
													{/snippet}
												</ActivityCard>
											{/if}
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
									<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
										{#each interactions as interaction}
											{@const TypeIcon = type_icons[interaction.type]}
											{#if edit_interaction_id === interaction.id}
												<!-- Edit Mode -->
												<div
													class="card bg-base-100 shadow-md transition-shadow hover:shadow-lg"
												>
													<div class="card-body p-4">
														<div class="space-y-4">
															<div class="flex items-center justify-between">
																<span class="text-lg font-semibold">
																	{contact.name}
																</span>
															</div>

															<div class="space-y-3">
																<label class="form-control w-full">
																	<div class="label">
																		<span class="label-text">Type</span>
																	</div>
																	<select
																		bind:value={edit_interaction_type}
																		class="select-bordered select w-full"
																	>
																		<option value="meeting">Meeting</option>
																		<option value="call">Call</option>
																		<option value="email">Email</option>
																		<option value="message">Message</option>
																	</select>
																</label>

																<label class="form-control w-full">
																	<div class="label">
																		<span class="label-text">Note</span>
																	</div>
																	<textarea
																		bind:value={edit_interaction_note}
																		class="textarea-bordered textarea h-24 w-full"
																		placeholder="Add a note..."
																	></textarea>
																</label>
															</div>

															<div class="flex justify-end gap-2">
																<button
																	class="btn btn-ghost btn-sm"
																	onclick={cancel_edit_interaction}
																>
																	Cancel
																</button>
																<button
																	class="btn btn-sm btn-primary"
																	onclick={save_edit_interaction}
																>
																	Save
																</button>
															</div>
														</div>
													</div>
												</div>
											{:else}
												<!-- View Mode -->
												<ActivityCard
													icon={TypeIcon}
													icon_color_classes={type_colors[interaction.type]}
													contact_id={contact.id}
													contact_name={contact.name}
													metadata="<span class='capitalize'>{interaction.type}</span> • {format_date(
														new Date(interaction.created_at),
														preferences.date_format,
													)}"
													note={interaction.note}
													show_delete_confirmation={delete_interaction_id ===
														interaction.id}
													on_confirm_delete={confirm_delete_interaction}
													on_cancel_delete={cancel_delete_interaction}
												>
													{#snippet action_buttons()}
														<button
															class="btn gap-1 btn-ghost btn-xs"
															aria-label="Edit interaction"
															onclick={(e) =>
																handle_edit_interaction_click(e, interaction)}
														>
															<Edit size="16px" />
															Edit
														</button>
														<button
															class="btn gap-1 text-error btn-ghost btn-xs"
															aria-label="Delete interaction"
															onclick={(e) =>
																handle_delete_interaction_click(
																	e,
																	interaction.id,
																)}
														>
															<Trash size="16px" />
															Delete
														</button>
													{/snippet}
												</ActivityCard>
											{/if}
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
