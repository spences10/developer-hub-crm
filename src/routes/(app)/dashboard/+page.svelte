<script lang="ts">
	import { type_badges } from '$lib/constants/badges';
	import {
		format_date,
		format_due_date,
	} from '$lib/utils/date-helpers';
	import { get_user_preferences } from '../settings/settings.remote';
	import {
		get_dashboard_activity,
		get_dashboard_stats,
	} from './dashboard.remote';
</script>

<div class="mx-auto max-w-6xl">
	<div class="mb-8 flex flex-wrap items-center justify-between gap-4">
		<h1 class="text-3xl font-bold">Dashboard</h1>

		<div class="flex gap-2">
			<a href="/contacts/new" class="btn btn-sm btn-primary">
				+ Contact
			</a>
			<a href="/interactions/new" class="btn btn-sm btn-secondary">
				+ Interaction
			</a>
			<a href="/follow-ups/new" class="btn btn-sm btn-accent">
				+ Follow-up
			</a>
		</div>
	</div>

	<!-- Stats Cards -->
	{#await get_dashboard_stats() then stats}
		<div class="mb-8 grid gap-6 md:grid-cols-3">
			<!-- Contacts Stats -->
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title text-lg">Contacts</h2>
					<p class="text-4xl font-bold">{stats.contacts}</p>
					<div class="card-actions justify-end">
						<a href="/contacts" class="link text-sm link-primary">
							View all →
						</a>
					</div>
				</div>
			</div>

			<!-- Interactions Stats -->
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title text-lg">Interactions</h2>
					<p class="text-4xl font-bold">{stats.interactions}</p>
					<div class="card-actions justify-end">
						<a href="/interactions" class="link text-sm link-primary">
							View all →
						</a>
					</div>
				</div>
			</div>

			<!-- Follow-ups Stats -->
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title text-lg">Follow-ups</h2>
					<div class="flex items-baseline gap-3">
						<p class="text-4xl font-bold">
							{stats.follow_ups.pending}
						</p>
						<p class="text-sm opacity-70">pending</p>
					</div>
					{#if stats.follow_ups.overdue > 0}
						<div class="badge badge-error">
							{stats.follow_ups.overdue} overdue
						</div>
					{/if}
					<div class="card-actions justify-end">
						<a href="/follow-ups" class="link text-sm link-primary">
							View all →
						</a>
					</div>
				</div>
			</div>
		</div>
	{/await}

	<!-- Activity Section -->
	{#await Promise.all( [get_dashboard_activity(), get_user_preferences()], ) then [activity, preferences]}
		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Overdue Follow-ups (if any) -->
			{#if activity.overdue_follow_ups.length > 0}
				<div class="card bg-error/10 shadow-xl lg:col-span-2">
					<div class="card-body">
						<div class="mb-4 flex items-center justify-between">
							<h2 class="card-title text-error">
								⚠️ Overdue Follow-ups
							</h2>
							<a
								href="/follow-ups?filter=overdue"
								class="link link-error"
							>
								View all
							</a>
						</div>
						<div class="space-y-3">
							{#each activity.overdue_follow_ups as follow_up}
								<div class="rounded-box bg-base-100 p-4">
									<div class="flex items-center justify-between">
										<div class="flex-1">
											<a
												href="/contacts/{follow_up.contact_id}"
												class="link font-semibold link-hover"
											>
												{follow_up.contact_name}
											</a>
											<p class="text-sm text-error">
												Due: {format_due_date(
													follow_up.due_date,
													preferences.date_format,
												)}
											</p>
											{#if follow_up.note}
												<p class="text-sm opacity-80">
													{follow_up.note}
												</p>
											{/if}
										</div>
										<a
											href="/contacts/{follow_up.contact_id}"
											class="btn btn-sm btn-error"
										>
											View
										</a>
									</div>
								</div>
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
						<p class="py-4 text-center opacity-70">
							No upcoming follow-ups
						</p>
					{:else}
						<div class="space-y-3">
							{#each activity.upcoming_follow_ups as follow_up}
								<a
									href="/contacts/{follow_up.contact_id}"
									class="block rounded-box bg-base-200 p-3 transition hover:bg-base-300"
								>
									<p class="font-semibold">
										{follow_up.contact_name}
									</p>
									<p class="text-sm opacity-70">
										{format_due_date(
											follow_up.due_date,
											preferences.date_format,
										)}
									</p>
									{#if follow_up.note}
										<p class="text-sm opacity-60">
											{follow_up.note.substring(0, 50)}{follow_up.note
												.length > 50
												? '...'
												: ''}
										</p>
									{/if}
								</a>
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
						<p class="py-4 text-center opacity-70">
							No interactions yet
						</p>
					{:else}
						<div class="space-y-3">
							{#each activity.recent_interactions as interaction}
								<a
									href="/contacts/{interaction.contact_id}"
									class="block rounded-box bg-base-200 p-3 transition hover:bg-base-300"
								>
									<div class="mb-1 flex items-center gap-2">
										<p class="font-semibold">
											{interaction.contact_name}
										</p>
										<span
											class="badge badge-sm {type_badges[
												interaction.type
											]}"
										>
											{interaction.type}
										</span>
									</div>
									<p class="text-xs opacity-60">
										{format_date(
											new Date(interaction.created_at),
											preferences.date_format,
										)}
									</p>
									{#if interaction.note}
										<p class="text-sm opacity-70">
											{interaction.note.substring(0, 50)}{interaction
												.note.length > 50
												? '...'
												: ''}
										</p>
									{/if}
								</a>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/await}
</div>
