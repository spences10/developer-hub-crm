<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import ConfirmDialog from '$lib/components/confirm-dialog.svelte';
	import EmptyState from '$lib/components/empty-state.svelte';
	import PageHeaderWithAction from '$lib/components/page-header-with-action.svelte';
	import PageNav from '$lib/components/page-nav.svelte';
	import SocialLinkIcon from '$lib/components/social-link.svelte';
	import {
		Calendar,
		Call,
		Check,
		CheckCircleFill,
		ContactBook,
		Edit,
		Email,
		GitHub,
		Lightbulb,
		Message,
		Sparkles,
		StarFill,
		Target,
		Trash,
		User,
		Warning,
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

	const interaction_types = [
		{ value: 'meeting', label: 'Meeting' },
		{ value: 'call', label: 'Call' },
		{ value: 'email', label: 'Email' },
		{ value: 'message', label: 'Message' },
	] as const;

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
		const due_date = new Date(edit_follow_up_due_date_str).getTime();
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

	// Helper to get initials from name
	function get_initials(name: string): string {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}

	// Calculate relationship health score (0-100)
	function calculate_health_score(contact: any): number {
		let score = 50; // Base score

		// Interactions boost
		if (contact.interaction_count > 0) {
			score += Math.min(contact.interaction_count * 5, 30);
		}

		// Recent contact boost
		if (contact.last_interaction_at) {
			const days_since = Math.floor(
				(Date.now() - contact.last_interaction_at) /
					(1000 * 60 * 60 * 24),
			);
			if (days_since < 7) score += 20;
			else if (days_since < 30) score += 10;
			else if (days_since > 90) score -= 20;
		} else {
			score -= 20; // Never contacted
		}

		// VIP boost
		if (contact.is_vip) score += 10;

		// Pending follow-ups penalty
		if (contact.pending_follow_ups > 2) score -= 10;

		return Math.max(0, Math.min(100, score));
	}

	// Get health status
	function get_health_status(score: number): {
		label: string;
		color: string;
		icon: any;
	} {
		if (score >= 80)
			return {
				label: 'Excellent',
				color: 'text-success',
				icon: CheckCircleFill,
			};
		if (score >= 60)
			return { label: 'Good', color: 'text-info', icon: Target };
		if (score >= 40)
			return {
				label: 'Fair',
				color: 'text-warning',
				icon: Lightbulb,
			};
		return {
			label: 'Needs Attention',
			color: 'text-error',
			icon: Warning,
		};
	}

	// Calculate days since last contact
	function days_since_contact(timestamp: number | null): string {
		if (!timestamp) return 'Never';
		const days = Math.floor(
			(Date.now() - timestamp) / (1000 * 60 * 60 * 24),
		);
		if (days === 0) return 'Today';
		if (days === 1) return 'Yesterday';
		if (days < 7) return `${days} days ago`;
		if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
		if (days < 365) return `${Math.floor(days / 30)} months ago`;
		return `${Math.floor(days / 365)} years ago`;
	}

	// Stats card configuration
	const get_stats_cards = (
		contact: any,
		health_score: number,
		health_status: any,
		overdue_count: number,
		preferences: any,
	) => [
		{
			icon: health_status.icon,
			icon_color: health_status.color,
			value: health_score,
			value_color: health_status.color,
			label: 'Relationship Health',
			sublabel: health_status.label,
			sublabel_color: health_status.color,
		},
		{
			icon: Message,
			icon_color: 'text-info',
			value: contact.interaction_count,
			value_color: 'text-info',
			label: 'Total Interactions',
			sublabel: days_since_contact(contact.last_interaction_at),
			sublabel_color: 'opacity-60',
		},
		{
			icon: Calendar,
			icon_color: overdue_count > 0 ? 'text-error' : 'text-warning',
			value: contact.pending_follow_ups,
			value_color: overdue_count > 0 ? 'text-error' : 'text-warning',
			label: 'Pending Follow-ups',
			sublabel: overdue_count > 0 ? `${overdue_count} overdue` : null,
			sublabel_color: 'text-error',
		},
		{
			icon: User,
			icon_color: 'text-success',
			value: `${Math.floor((Date.now() - contact.created_at) / (1000 * 60 * 60 * 24))}d`,
			value_color: 'text-success',
			label: 'In Your Network',
			sublabel: `Since ${format_date(new Date(contact.created_at), preferences.date_format)}`,
			sublabel_color: 'opacity-60',
		},
	];

	// Quick action cards configuration
	const get_action_cards = (
		contact_id: string,
		email: string | null,
	) => [
		{
			href: `/interactions/new?contact_id=${contact_id}`,
			border_color: 'border-primary/20',
			bg_gradient: 'from-primary/10 to-primary/5',
			hover_border: 'hover:border-primary/30',
			icon_bg: 'bg-primary/20',
			icon: Message,
			icon_color: 'text-primary',
			title: 'Log Interaction',
			title_color: 'text-primary',
			description: 'Record a meeting, call, email, or message',
			enabled: true,
		},
		{
			href: `/follow-ups/new?contact_id=${contact_id}`,
			border_color: 'border-warning/20',
			bg_gradient: 'from-warning/10 to-warning/5',
			hover_border: 'hover:border-warning/30',
			icon_bg: 'bg-warning/20',
			icon: Calendar,
			icon_color: 'text-warning',
			title: 'Schedule Follow-up',
			title_color: 'text-warning',
			description: 'Set a reminder to reconnect',
			enabled: true,
		},
		{
			href: email ? `mailto:${email}` : null,
			border_color: email ? 'border-info/20' : 'border-base-300',
			bg_gradient: email ? 'from-info/10 to-info/5' : '',
			hover_border: email ? 'hover:border-info/30' : '',
			icon_bg: email ? 'bg-info/20' : 'bg-base-300',
			icon: Email,
			icon_color: email ? 'text-info' : 'opacity-50',
			title: 'Send Email',
			title_color: email ? 'text-info' : '',
			description: email
				? 'Open your email client'
				: 'No email address on file',
			enabled: !!email,
		},
	];
</script>

{#snippet form_actions(on_cancel: () => void, on_save: () => void)}
	<div class="flex justify-end gap-2">
		<button class="btn btn-ghost btn-sm" onclick={on_cancel}
			>Cancel</button
		>
		<button class="btn btn-sm btn-primary" onclick={on_save}
			>Save</button
		>
	</div>
{/snippet}

<div class="mx-auto max-w-6xl">
	{#if contact_id}
		{#key refresh_key}
			{#await Promise.all( [get_contact(contact_id), get_user_preferences(), get_interactions(contact_id), get_contact_follow_ups(contact_id)], ) then [contact, preferences, interactions, follow_ups]}
				{@const health_score = calculate_health_score(contact)}
				{@const health_status = get_health_status(health_score)}
				{@const pending_follow_ups = follow_ups.filter(
					(f) => !f.completed,
				)}
				{@const overdue_follow_ups = pending_follow_ups.filter((f) =>
					is_overdue(f.due_date),
				)}

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

				<!-- Contact Info Bar -->
				<div class="mb-6 flex items-center gap-4">
					<!-- Avatar -->
					{#if contact.avatar_url}
						<img
							src={contact.avatar_url}
							alt="{contact.name} avatar"
							class="size-20 rounded-full object-cover shadow-lg"
						/>
					{:else}
						<div
							class="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-3xl font-bold text-primary-content shadow-lg"
						>
							{get_initials(contact.name)}
						</div>
					{/if}

					<div class="flex-1">
						<div class="mb-1 flex items-center gap-3">
							{#if contact.is_vip}
								<span
									class="badge flex items-center gap-1 badge-primary"
								>
									<StarFill size="14px" />
									VIP
								</span>
							{/if}
						</div>
						{#if contact.title || contact.company}
							<p class="text-base-content/70">
								{#if contact.title}{contact.title}{/if}
								{#if contact.title && contact.company}
									<span class="mx-2">at</span>
								{/if}
								{#if contact.company}{contact.company}{/if}
							</p>
						{/if}
					</div>
				</div>

				<!-- Stats Cards -->
				{@const stats_cards = get_stats_cards(
					contact,
					health_score,
					health_status,
					overdue_follow_ups.length,
					preferences,
				)}
				<div class="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
					{#each stats_cards as stat}
						<div
							class="card border border-base-300 bg-base-100 shadow"
						>
							<div class="card-body p-4 text-center">
								<div class="mb-2 flex items-center justify-center">
									<stat.icon
										size="28px"
										class_names={stat.icon_color}
									/>
								</div>
								<div
									class="mb-1 text-2xl font-extrabold {stat.value_color}"
								>
									{stat.value}
								</div>
								<div class="text-xs font-semibold opacity-70">
									{stat.label}
								</div>
								{#if stat.sublabel}
									<div class="text-xs {stat.sublabel_color}">
										{stat.sublabel}
									</div>
								{/if}
							</div>
						</div>
					{/each}
				</div>

				<!-- Quick Actions -->
				{@const action_cards = get_action_cards(
					contact.id,
					contact.email,
				)}
				<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
					{#each action_cards as action}
						{#if action.enabled}
							<a
								href={action.href}
								class="card border {action.border_color} bg-gradient-to-br {action.bg_gradient} transition-all duration-200 {action.hover_border} hover:shadow-md"
							>
								<div class="card-body items-center p-6 text-center">
									<div class="mb-3 rounded-full {action.icon_bg} p-3">
										<action.icon
											size="28px"
											class_names={action.icon_color}
										/>
									</div>
									<h3
										class="card-title justify-center text-base {action.title_color}"
									>
										{action.title}
									</h3>
									<p class="text-xs opacity-70">
										{action.description}
									</p>
								</div>
							</a>
						{:else}
							<div
								class="card border {action.border_color} bg-base-200/50 opacity-50"
							>
								<div class="card-body items-center p-6 text-center">
									<div class="mb-3 rounded-full {action.icon_bg} p-3">
										<action.icon
											size="28px"
											class_names={action.icon_color}
										/>
									</div>
									<h3 class="card-title justify-center text-base">
										{action.title}
									</h3>
									<p class="text-xs opacity-70">
										{action.description}
									</p>
								</div>
							</div>
						{/if}
					{/each}
				</div>

				<!-- Main Content Area -->
				<div>
					<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
						<!-- Left Column: Contact Details & Notes -->
						<div class="space-y-6 lg:col-span-1">
							<!-- Contact Information Card -->
							<div class="card bg-base-100 shadow-xl">
								<div class="card-body">
									<h2 class="mb-4 card-title flex items-center gap-2">
										<ContactBook size="24px" />
										Contact Details
									</h2>

									{#snippet detail_field(
										label: string,
										value: string | null,
										is_link: boolean = false,
										link_prefix: string = '',
									)}
										{#if value}
											<div>
												<p
													class="mb-1 text-xs font-semibold uppercase opacity-60"
												>
													{label}
												</p>
												{#if is_link}
													<a
														href="{link_prefix}{value}"
														class="link text-sm link-primary"
													>
														{value}
													</a>
												{:else}
													<p class="text-sm">{value}</p>
												{/if}
											</div>
										{/if}
									{/snippet}

									<div class="space-y-4">
										{@render detail_field(
											'Email',
											contact.email,
											true,
											'mailto:',
										)}
										{@render detail_field(
											'Phone',
											contact.phone,
											true,
											'tel:',
										)}
										{@render detail_field(
											'Birthday',
											contact.birthday
												? format_date(
														new Date(contact.birthday),
														preferences.date_format,
													)
												: null,
										)}
										{@render detail_field('Company', contact.company)}
										{@render detail_field('Title', contact.title)}

										{#if contact.social_links && contact.social_links.length > 0}
											<div>
												<p
													class="mb-2 text-xs font-semibold uppercase opacity-60"
												>
													Social Links
												</p>
												<div class="flex flex-wrap gap-2">
													{#each contact.social_links as link}
														<a
															href={link.url}
															target="_blank"
															rel="noopener noreferrer"
															class="badge gap-1 badge-outline"
														>
															<SocialLinkIcon
																platform={link.platform}
															/>
															{link.platform}
														</a>
													{/each}
												</div>
											</div>
										{/if}
									</div>
								</div>
							</div>

							<!-- Notes Card -->
							{#if contact.notes}
								<div class="card bg-base-100 shadow-xl">
									<div class="card-body">
										<h2
											class="mb-4 card-title flex items-center gap-2"
										>
											<Lightbulb size="24px" />
											Notes
										</h2>
										<p class="text-sm whitespace-pre-wrap">
											{contact.notes}
										</p>
									</div>
								</div>
							{/if}

							<!-- GitHub Card -->
							{#if contact.github_username}
								<div
									class="card overflow-hidden border border-base-300 bg-gradient-to-br from-base-100 to-base-200 shadow-xl"
								>
									<div class="card-body">
										<h2
											class="mb-4 card-title flex items-center gap-2"
										>
											<GitHub size="24px" />
											GitHub Profile
										</h2>
										<div class="space-y-3">
											<a
												href="https://github.com/{contact.github_username}"
												target="_blank"
												rel="noopener noreferrer"
												class="btn btn-block gap-2 btn-outline"
											>
												<GitHub size="20px" />
												@{contact.github_username}
											</a>
											<p class="text-xs opacity-70">
												View their repositories, contributions, and
												activity on GitHub
											</p>
										</div>
									</div>
								</div>
							{/if}
						</div>

						<!-- Right Column: Activity Timeline -->
						<div class="space-y-6 lg:col-span-2">
							<!-- Activity Timeline Header -->
							<div class="flex items-center justify-between">
								<h2
									class="flex items-center gap-2 text-2xl font-bold"
								>
									<Sparkles size="28px" class_names="text-primary" />
									Activity Timeline
								</h2>
							</div>

							<!-- Combined Timeline -->
							{#if interactions.length === 0 && pending_follow_ups.length === 0}
								<div class="card bg-base-100 shadow-xl">
									<div class="card-body">
										<EmptyState
											message="No activity yet. Start by logging an interaction or scheduling a follow-up!"
										/>
									</div>
								</div>
							{:else}
								<div class="space-y-4">
									<!-- Follow-ups Section -->
									{#if pending_follow_ups.length > 0}
										<div class="card bg-base-100 shadow-xl">
											<div class="card-body">
												<div
													class="mb-4 flex items-center justify-between"
												>
													<h3
														class="flex items-center gap-2 text-xl font-bold"
													>
														<Calendar size="24px" />
														Pending Follow-ups
														{#if overdue_follow_ups.length > 0}
															<span class="badge badge-error">
																{overdue_follow_ups.length} overdue
															</span>
														{/if}
													</h3>
													<a
														href="/follow-ups/new?contact_id={contact.id}"
														class="btn btn-sm btn-primary"
													>
														Add Follow-up
													</a>
												</div>

												<div class="space-y-3">
													{#each pending_follow_ups as follow_up}
														{@const overdue =
															!follow_up.completed &&
															is_overdue(follow_up.due_date)}
														{#if edit_follow_up_id === follow_up.id}
															<!-- Edit Mode -->
															<div
																class="rounded-box border border-base-300 bg-base-200/50 p-4"
															>
																<div class="space-y-3">
																	<label class="form-control w-full">
																		<div class="label">
																			<span class="label-text"
																				>Due Date</span
																			>
																		</div>
																		<input
																			type="datetime-local"
																			bind:value={
																				edit_follow_up_due_date_str
																			}
																			class="input-bordered input w-full"
																		/>
																	</label>

																	<label class="form-control w-full">
																		<div class="label">
																			<span class="label-text"
																				>Note</span
																			>
																		</div>
																		<textarea
																			bind:value={edit_follow_up_note}
																			class="textarea-bordered textarea h-24 w-full"
																			placeholder="Add a note..."
																		></textarea>
																	</label>

																	{@render form_actions(
																		cancel_edit_follow_up,
																		save_edit_follow_up,
																	)}
																</div>
															</div>
														{:else}
															<!-- View Mode -->
															<div
																class="group rounded-box border transition-all duration-300 hover:shadow-lg {overdue
																	? 'border-error/30 bg-error/5'
																	: 'border-base-300 bg-base-200/30'}"
															>
																<div
																	class="flex items-start gap-4 p-4"
																>
																	<!-- Icon -->
																	<div
																		class="flex-shrink-0 rounded-full p-3 {overdue
																			? 'bg-error text-error-content'
																			: 'bg-warning text-warning-content'}"
																	>
																		<Calendar size="20px" />
																	</div>

																	<!-- Content -->
																	<div class="flex-1">
																		<div
																			class="mb-1 flex items-center gap-2"
																		>
																			<span
																				class="font-semibold {overdue
																					? 'text-error'
																					: ''}"
																			>
																				Due: {format_due_date(
																					follow_up.due_date,
																					preferences.date_format,
																				)}
																			</span>
																			{#if overdue}
																				<span
																					class="badge badge-sm badge-error"
																				>
																					Overdue
																				</span>
																			{/if}
																		</div>
																		{#if follow_up.note}
																			<p class="text-sm opacity-70">
																				{follow_up.note}
																			</p>
																		{/if}
																	</div>

																	<!-- Actions -->
																	<div class="flex flex-col gap-2">
																		{#if delete_follow_up_id === follow_up.id}
																			<ConfirmDialog
																				is_inline={true}
																				message="Delete follow-up?"
																				on_confirm={confirm_delete_follow_up}
																				on_cancel={cancel_delete_follow_up}
																			/>
																		{:else}
																			<button
																				onclick={() =>
																					handle_complete_follow_up(
																						follow_up.id,
																					)}
																				class="tooltip btn text-success btn-ghost btn-xs"
																				data-tip="Complete"
																				aria-label="Complete follow-up"
																			>
																				<Check size="16px" />
																			</button>
																			<button
																				onclick={(e) =>
																					handle_edit_follow_up_click(
																						e,
																						follow_up,
																					)}
																				class="tooltip btn btn-ghost btn-xs"
																				data-tip="Edit"
																				aria-label="Edit follow-up"
																			>
																				<Edit size="16px" />
																			</button>
																			<button
																				onclick={(e) =>
																					handle_delete_follow_up_click(
																						e,
																						follow_up.id,
																					)}
																				class="tooltip btn text-error btn-ghost btn-xs"
																				data-tip="Delete"
																				aria-label="Delete follow-up"
																			>
																				<Trash size="16px" />
																			</button>
																		{/if}
																	</div>
																</div>
															</div>
														{/if}
													{/each}
												</div>
											</div>
										</div>
									{/if}

									<!-- Interactions Section -->
									{#if interactions.length > 0}
										<div class="card bg-base-100 shadow-xl">
											<div class="card-body">
												<div
													class="mb-4 flex items-center justify-between"
												>
													<h3
														class="flex items-center gap-2 text-xl font-bold"
													>
														<Message size="24px" />
														Recent Interactions
													</h3>
													<a
														href="/interactions/new?contact_id={contact.id}"
														class="btn btn-sm btn-primary"
													>
														Log Interaction
													</a>
												</div>

												<div class="space-y-3">
													{#each interactions.slice(0, 10) as interaction}
														{@const TypeIcon =
															type_icons[interaction.type]}
														{#if edit_interaction_id === interaction.id}
															<!-- Edit Mode -->
															<div
																class="rounded-box border border-base-300 bg-base-200/50 p-4"
															>
																<div class="space-y-3">
																	<label class="form-control w-full">
																		<div class="label">
																			<span class="label-text">
																				Type
																			</span>
																		</div>
																		<select
																			bind:value={
																				edit_interaction_type
																			}
																			class="select-bordered select w-full"
																		>
																			{#each interaction_types as type}
																				<option value={type.value}>
																					{type.label}
																				</option>
																			{/each}
																		</select>
																	</label>

																	<label class="form-control w-full">
																		<div class="label">
																			<span class="label-text"
																				>Note</span
																			>
																		</div>
																		<textarea
																			bind:value={
																				edit_interaction_note
																			}
																			class="textarea-bordered textarea h-24 w-full"
																			placeholder="Add a note..."
																		></textarea>
																	</label>

																	{@render form_actions(
																		cancel_edit_interaction,
																		save_edit_interaction,
																	)}
																</div>
															</div>
														{:else}
															<!-- View Mode -->
															<div
																class="group rounded-box border border-base-300 bg-base-200/30 transition-all duration-300 hover:shadow-lg"
															>
																<div
																	class="flex items-start gap-4 p-4"
																>
																	<!-- Icon -->
																	<div
																		class="flex-shrink-0 rounded-full p-3 {type_colors[
																			interaction.type
																		]}"
																	>
																		<TypeIcon size="20px" />
																	</div>

																	<!-- Content -->
																	<div class="flex-1">
																		<div
																			class="mb-1 flex items-center gap-2"
																		>
																			<span
																				class="font-semibold capitalize"
																			>
																				{interaction.type}
																			</span>
																			<span
																				class="text-sm opacity-60"
																			>
																				•
																				{format_date(
																					new Date(
																						interaction.created_at,
																					),
																					preferences.date_format,
																				)}
																			</span>
																		</div>
																		{#if interaction.note}
																			<p class="text-sm opacity-70">
																				{interaction.note}
																			</p>
																		{/if}
																	</div>

																	<!-- Actions -->
																	<div class="flex flex-col gap-2">
																		{#if delete_interaction_id === interaction.id}
																			<ConfirmDialog
																				is_inline={true}
																				message="Delete interaction?"
																				on_confirm={confirm_delete_interaction}
																				on_cancel={cancel_delete_interaction}
																			/>
																		{:else}
																			<button
																				onclick={(e) =>
																					handle_edit_interaction_click(
																						e,
																						interaction,
																					)}
																				class="tooltip btn btn-ghost btn-xs"
																				data-tip="Edit"
																				aria-label="Edit interaction"
																			>
																				<Edit size="16px" />
																			</button>
																			<button
																				onclick={(e) =>
																					handle_delete_interaction_click(
																						e,
																						interaction.id,
																					)}
																				class="tooltip btn text-error btn-ghost btn-xs"
																				data-tip="Delete"
																				aria-label="Delete interaction"
																			>
																				<Trash size="16px" />
																			</button>
																		{/if}
																	</div>
																</div>
															</div>
														{/if}
													{/each}
												</div>

												{#if interactions.length > 10}
													<div class="mt-4 text-center">
														<a
															href="/interactions?contact_id={contact.id}"
															class="link link-primary"
														>
															View all {interactions.length} interactions
														</a>
													</div>
												{/if}
											</div>
										</div>
									{/if}
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/await}
		{/key}
	{/if}
</div>
