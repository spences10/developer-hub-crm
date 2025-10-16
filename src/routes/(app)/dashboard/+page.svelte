<script lang="ts">
	import EmptyState from '$lib/components/empty-state.svelte';
	import FollowUpCard from '$lib/components/follow-up-card.svelte';
	import InteractionCard from '$lib/components/interaction-card.svelte';
	import PageNav from '$lib/components/page-nav.svelte';
	import { Cross, Warning } from '$lib/icons';
	import { seo_configs } from '$lib/seo';
	import { Head } from 'svead';
	import { get_user_preferences } from '../settings/settings.remote';
	import {
		get_dashboard_activity,
		get_dashboard_stats,
	} from './dashboard.remote';

	const stats_query = get_dashboard_stats();
	const activity_query = get_dashboard_activity();
	const preferences_query = get_user_preferences();
</script>

<Head seo_config={seo_configs.dashboard} />

<div class="mb-8 flex flex-wrap items-center justify-between gap-4">
	<h1 class="text-3xl font-bold">Dashboard</h1>

	<div class="flex gap-2">
		<a href="/contacts/new" class="btn btn-sm btn-primary">
			<Cross size="10px" type="add" class_names="-mr-1" />
			Contact
		</a>
		<a href="/interactions/new" class="btn btn-sm btn-secondary">
			<Cross size="10px" type="add" class_names="-mr-1" />
			Interaction
		</a>
		<a href="/follow-ups/new" class="btn btn-sm btn-accent">
			<Cross size="10px" type="add" class_names="-mr-1" />
			Follow-up
		</a>
	</div>
</div>
<PageNav />
<!-- Stats Bar -->
{#if stats_query.loading}
	<div class="mb-8 flex justify-center">
		<span class="loading loading-sm loading-spinner"></span>
	</div>
{:else if stats_query.error}
	<div class="mb-8 alert alert-error">
		<p>Error loading stats</p>
	</div>
{:else if stats_query.current}
	{@const stats = stats_query.current}
	<div class="mb-8 flex flex-wrap items-center gap-2 text-sm">
		<a href="/contacts" class="link link-hover">
			<span class="font-semibold">{stats.contacts}</span>
			contact{stats.contacts !== 1 ? 's' : ''}
		</a>
		<span class="opacity-50">•</span>
		<a href="/interactions" class="link link-hover">
			<span class="font-semibold">{stats.interactions}</span>
			interaction{stats.interactions !== 1 ? 's' : ''}
		</a>
		<span class="opacity-50">•</span>
		<a href="/follow-ups" class="link link-hover">
			<span class="font-semibold">{stats.follow_ups.pending}</span>
			pending follow-up{stats.follow_ups.pending !== 1 ? 's' : ''}
		</a>
		{#if stats.follow_ups.overdue > 0}
			<span class="badge badge-sm badge-error">
				{stats.follow_ups.overdue} overdue
			</span>
		{/if}
	</div>
{/if}

<!-- Activity Section -->
{#if activity_query.error || preferences_query.error}
	<div class="alert alert-error">
		<p>Error loading activity. Please try again.</p>
	</div>
{:else if (activity_query.loading || preferences_query.loading) && (activity_query.current === undefined || preferences_query.current === undefined)}
	<!-- Only show loading spinner on initial load -->
	<div class="flex justify-center p-8">
		<span class="loading loading-lg loading-spinner"></span>
	</div>
{:else if activity_query.current && preferences_query.current}
	{@const activity = activity_query.current}
	{@const preferences = preferences_query.current}
	<div
		class="grid gap-6 lg:grid-cols-2"
		class:opacity-60={activity_query.loading}
	>
		<!-- Overdue Follow-ups (if any) -->
		{#if activity.overdue_follow_ups.length > 0}
			<div
				class="card border-2 border-warning bg-base-100 shadow-xl lg:col-span-2"
			>
				<div class="card-body">
					<div class="mb-4 flex items-center justify-between">
						<h2
							class="card-title flex items-center gap-2 text-warning"
						>
							<Warning size="20px" />
							Overdue Follow-ups
						</h2>
						<a
							href="/follow-ups?filter=overdue"
							class="link link-warning"
						>
							View all
						</a>
					</div>
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						{#each activity.overdue_follow_ups as follow_up}
							<FollowUpCard
								{follow_up}
								date_format={preferences?.date_format ?? 'YYYY-MM-DD'}
								variant="dashboard"
							/>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		<!-- Upcoming Follow-ups -->
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<div class="mb-4 flex items-center justify-between">
					<h2 class="card-title">Upcoming Follow-ups</h2>
					<a href="/follow-ups" class="link text-sm link-primary">
						View all
					</a>
				</div>
				{#if activity.upcoming_follow_ups.length === 0}
					<EmptyState message="No upcoming follow-ups" />
				{:else}
					<div class="space-y-3">
						{#each activity.upcoming_follow_ups as follow_up}
							<FollowUpCard
								{follow_up}
								date_format={preferences?.date_format ?? 'YYYY-MM-DD'}
								variant="compact"
							/>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<!-- Recent Interactions -->
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<div class="mb-4 flex items-center justify-between">
					<h2 class="card-title">Recent Interactions</h2>
					<a href="/interactions" class="link text-sm link-primary">
						View all
					</a>
				</div>
				{#if activity.recent_interactions.length === 0}
					<EmptyState message="No interactions yet" />
				{:else}
					<div class="space-y-3">
						{#each activity.recent_interactions as interaction}
							<InteractionCard
								{interaction}
								date_format={preferences?.date_format ?? 'YYYY-MM-DD'}
								variant="compact"
							/>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
