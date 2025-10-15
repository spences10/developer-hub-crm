<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import ConfirmDialog from '$lib/components/confirm-dialog.svelte';
	import PageHeaderWithAction from '$lib/components/page-header-with-action.svelte';
	import PageNav from '$lib/components/page-nav.svelte';
	import { Edit, StarFill, Trash } from '$lib/icons';
	import {
		calculate_health_score,
		get_action_cards,
		get_health_status,
		get_initials,
		get_stats_cards,
	} from '$lib/utils/contact-calculations';
	import { get_contact_follow_ups } from '../../follow-ups/follow-ups.remote';
	import { get_interactions } from '../../interactions/interactions.remote';
	import { get_user_preferences } from '../../settings/settings.remote';
	import { get_contact_tags } from '../../tags/tags.remote';
	import { delete_contact, get_contact } from '../contacts.remote';
	import {
		edit_state,
		cancel_delete_interaction,
		cancel_delete_follow_up,
		cancel_edit_interaction,
		cancel_edit_follow_up,
		confirm_delete_interaction,
		confirm_delete_follow_up,
	} from '$lib/state/contact-edit-state.svelte';
	import ActivitySection from './activity-section.svelte';
	import ContactDetailsCard from './contact-details-card.svelte';
	import ContactGitHubCard from './contact-github-card.svelte';
	import ContactNotesCard from './contact-notes-card.svelte';
	import ContactQuickActions from './contact-quick-actions.svelte';
	import ContactStatsCards from './contact-stats-cards.svelte';

	const contact_id = $derived(page.params.id);

	// Contact deletion
	function handle_delete_click() {
		edit_state.show_delete_confirmation = true;
	}

	async function confirm_delete() {
		const result = await delete_contact(contact_id);
		if (result && 'success' in result) {
			goto('/contacts');
		}
		edit_state.show_delete_confirmation = false;
	}

	function cancel_delete() {
		edit_state.show_delete_confirmation = false;
	}
</script>

{#if contact_id}
	{#await Promise.all( [get_contact(contact_id), get_user_preferences(), get_interactions(contact_id), get_contact_follow_ups(contact_id), get_contact_tags(contact_id)], ) then [contact, preferences, interactions, follow_ups, contact_tags]}
		{@const health_score = calculate_health_score(contact)}
		{@const health_status = get_health_status(health_score)}
		{@const pending_follow_ups = follow_ups.filter(
			(f) => !f.completed,
		)}
		{@const overdue_follow_ups = pending_follow_ups.filter(
			(f) => f.due_date < Date.now(),
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
				{#if edit_state.show_delete_confirmation}
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
				<div class="lg:col-span-2">
					<ActivitySection
						{interactions}
						{pending_follow_ups}
						{overdue_follow_ups}
						contact_id={contact.id}
						contact_name={contact.name}
						date_format={preferences.date_format}
					/>
				</div>
			</div>
		</div>
	{/await}
{/if}
