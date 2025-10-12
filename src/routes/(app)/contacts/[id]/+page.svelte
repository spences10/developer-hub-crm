<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import ActivityCard from '$lib/components/activity-card.svelte';
	import ConfirmDialog from '$lib/components/confirm-dialog.svelte';
	import EmptyState from '$lib/components/empty-state.svelte';
	import PageHeaderWithAction from '$lib/components/page-header-with-action.svelte';
	import PageNav from '$lib/components/page-nav.svelte';
	import {
		Calendar,
		Call,
		Check,
		CheckCircleFill,
		Edit,
		Email,
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
	import { get_contact_tags } from '../../tags/tags.remote';
	import { delete_contact, get_contact } from '../contacts.remote';
	import ContactDetailsCard from './contact-details-card.svelte';
	import ContactGitHubCard from './contact-github-card.svelte';
	import ContactNotesCard from './contact-notes-card.svelte';
	import ContactQuickActions from './contact-quick-actions.svelte';
	import ContactStatsCards from './contact-stats-cards.svelte';

	const contact_id = $derived(page.params.id);

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
	}

	function cancel_edit_follow_up() {
		edit_follow_up_id = null;
	}

	async function handle_complete_follow_up(id: string) {
		await complete_follow_up(id);
	}

	async function handle_reopen_follow_up(id: string) {
		await reopen_follow_up(id);
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
		<button class="btn btn-ghost btn-sm" onclick={on_cancel}>
			Cancel
		</button>
		<button class="btn btn-sm btn-primary" onclick={on_save}>
			Save
		</button>
	</div>
{/snippet}

{#if contact_id}
	{#await Promise.all( [get_contact(contact_id), get_user_preferences(), get_interactions(contact_id), get_contact_follow_ups(contact_id), get_contact_tags(contact_id)], ) then [contact, preferences, interactions, follow_ups, contact_tags]}
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
				<div class="mb-2 flex flex-wrap items-center gap-2">
					{#if contact.is_vip}
						<span class="badge flex items-center gap-1 badge-primary">
							<StarFill size="14px" />
							VIP
						</span>
					{/if}
					{#if contact_tags && contact_tags.length > 0}
						{#each contact_tags as tag}
							<span
								class="badge badge-sm"
								style="background-color: {tag.color}; color: white; border: none;"
							>
								{tag.name}
							</span>
						{/each}
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
		<ContactStatsCards
			stats_cards={get_stats_cards(
				contact,
				health_score,
				health_status,
				overdue_follow_ups.length,
				preferences,
			)}
		/>

		<!-- Quick Actions -->
		<ContactQuickActions
			action_cards={get_action_cards(contact.id, contact.email)}
		/>

		<!-- Main Content Area -->
		<div>
			<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<!-- Left Column: Contact Details & Notes -->
				<div class="space-y-6 lg:col-span-1">
					<ContactDetailsCard
						email={contact.email}
						phone={contact.phone}
						birthday={contact.birthday}
						company={contact.company}
						title={contact.title}
						social_links={contact.social_links}
						date_format={preferences.date_format}
					/>
					<ContactNotesCard notes={contact.notes} />
					<ContactGitHubCard
						github_username={contact.github_username}
					/>
				</div>

				<!-- Right Column: Activity Timeline -->
				<div class="space-y-6 lg:col-span-2">
					<!-- Activity Timeline Header -->
					<div class="flex items-center justify-between">
						<h2 class="flex items-center gap-2 text-2xl font-bold">
							<Sparkles
								size="28px"
								class_names="text-primary"
								gradient={true}
							/>
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
												{@const icon_color = overdue
													? 'bg-error text-error-content'
													: 'bg-warning text-warning-content'}
												{@const metadata_classes = overdue
													? 'opacity-60 text-error'
													: 'opacity-60'}
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
																	<span class="label-text">Note</span>
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
													<ActivityCard
														icon={Calendar}
														icon_color_classes={icon_color}
														contact_id={contact.id}
														contact_name={contact.name}
														metadata="Due: {format_due_date(
															follow_up.due_date,
															preferences.date_format,
														)}{overdue
															? " <span class='badge badge-sm badge-error'>Overdue</span>"
															: ''}"
														{metadata_classes}
														note={follow_up.note}
														show_delete_confirmation={delete_follow_up_id ===
															follow_up.id}
														on_confirm_delete={confirm_delete_follow_up}
														on_cancel_delete={cancel_delete_follow_up}
													>
														{#snippet action_buttons()}
															<button
																onclick={() =>
																	handle_complete_follow_up(
																		follow_up.id,
																	)}
																class="btn gap-1 text-success btn-ghost btn-xs"
																aria-label="Complete follow-up"
															>
																<Check size="16px" />
																Complete
															</button>
															<button
																class="btn gap-1 btn-ghost btn-xs"
																aria-label="Edit follow-up"
																onclick={(e) =>
																	handle_edit_follow_up_click(
																		e,
																		follow_up,
																	)}
															>
																<Edit size="16px" />
																Edit
															</button>
															<button
																class="btn gap-1 text-error btn-ghost btn-xs"
																aria-label="Delete follow-up"
																onclick={(e) =>
																	handle_delete_follow_up_click(
																		e,
																		follow_up.id,
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
																	bind:value={edit_interaction_type}
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
																	<span class="label-text">Note</span>
																</div>
																<textarea
																	bind:value={edit_interaction_note}
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
													<ActivityCard
														icon={TypeIcon}
														icon_color_classes={type_colors[
															interaction.type
														]}
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
																	handle_edit_interaction_click(
																		e,
																		interaction,
																	)}
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
{/if}
