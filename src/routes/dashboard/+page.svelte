<script lang="ts">
	import {
		AddContact,
		Calendar,
		Checkmark,
		Clock,
		Network,
		Notes,
		Settings,
		Stats,
		Tasks,
		VIP,
	} from '$lib/icons';
	import { create_contact_state } from '$lib/state/contacts.svelte';
	import type { PageData } from './$types';

	// Get data from the server
	const { data } = $props<{ data: PageData }>();

	// Initialize contact state
	const contact_state = create_contact_state(data.contacts);

	// Mock recent activity - in a real app, this would come from the server
	const recent_activities = $state([
		{ date: 'Today', activity: 'Account created' },
		{ date: 'Today', activity: 'Dashboard accessed' },
	]);

	// Mock upcoming tasks - in a real app, this would be real data
	const upcoming_tasks = $state([
		{ title: 'Contact follow-up', due: 'Tomorrow', priority: 'high' },
		{ title: 'Update profile', due: 'This week', priority: 'medium' },
		{ title: 'Review contacts', due: 'Next week', priority: 'low' },
	]);

	// Get user initial for avatar
	const get_user_initial = () => {
		if (!data.user || !data.user.username) return '?';
		return data.user.username.charAt(0).toUpperCase();
	};
</script>

<div class="bg-base-200 min-h-screen">
	<!-- Welcome Banner -->
	<div class="hero bg-base-100 rounded-box mb-8 p-8 shadow-sm">
		<div class="hero-content text-center">
			<div class="max-w-md">
				<h1 class="mb-4 text-4xl font-extrabold tracking-tight">
					{#if data.user && data.user.username}
						Welcome, {data.user.username}!
					{:else}
						Welcome to Developer Hub CRM!
					{/if}
				</h1>
				<p class="mb-6 text-lg">
					Your Developer Hub CRM dashboard is ready. Manage your
					contacts, track activities, and grow your network.
				</p>
				<a href="/contacts" class="btn btn-primary">Manage Contacts</a
				>
			</div>
		</div>
	</div>

	<!-- Dashboard Grid -->
	<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
		<!-- Quick Stats -->
		<div class="card bg-base-100 border-base-300 border shadow-sm">
			<div class="card-body">
				<h2
					class="card-title flex items-center gap-2 text-xl font-bold"
				>
					<div
						class="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg"
					>
						<Stats
							height="20px"
							width="20px"
							class_names="text-primary"
						/>
					</div>
					Quick Stats
				</h2>
				<div class="stats stats-vertical bg-base-200 shadow-sm">
					<div class="stat">
						<div class="stat-figure text-primary">
							<Network
								height="32px"
								width="32px"
								class_names="h-8 w-8"
							/>
						</div>
						<div class="stat-title font-medium">Total Contacts</div>
						<div class="stat-value text-primary">
							{contact_state.total_contacts}
						</div>
						<div class="stat-desc">Your network size</div>
					</div>
					<div class="stat">
						<div class="stat-figure text-primary">
							<VIP
								height="32px"
								width="32px"
								class_names="h-8 w-8 text-primary"
							/>
						</div>
						<div class="stat-title font-medium">VIP Contacts</div>
						<div class="stat-value text-primary">
							{contact_state.vip_contacts}
						</div>
						<div class="stat-desc">High-priority connections</div>
					</div>
				</div>
				<div class="card-actions mt-4 justify-end">
					<a href="/analytics" class="btn btn-sm btn-ghost"
						>View Analytics →</a
					>
				</div>
			</div>
		</div>

		<!-- Recent Activity -->
		<div class="card bg-base-100 border-base-300 border shadow-sm">
			<div class="card-body">
				<h2
					class="card-title flex items-center gap-2 text-xl font-bold"
				>
					<div
						class="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg"
					>
						<Clock
							height="20px"
							width="20px"
							class_names="text-primary"
						/>
					</div>
					Recent Activity
				</h2>
				<div class="overflow-x-auto">
					<table class="table-zebra table">
						<thead>
							<tr>
								<th>Date</th>
								<th>Activity</th>
							</tr>
						</thead>
						<tbody>
							{#each recent_activities as activity}
								<tr>
									<td>{activity.date}</td>
									<td>{activity.activity}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
				<div class="card-actions mt-4 justify-end">
					<a href="/activity" class="btn btn-sm btn-ghost"
						>View All Activity →</a
					>
				</div>
			</div>
		</div>

		<!-- Upcoming Tasks -->
		<div class="card bg-base-100 border-base-300 border shadow-sm">
			<div class="card-body">
				<h2
					class="card-title flex items-center gap-2 text-xl font-bold"
				>
					<div
						class="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg"
					>
						<Tasks
							height="20px"
							width="20px"
							class_names="text-primary"
						/>
					</div>
					Upcoming Tasks
				</h2>
				<div class="space-y-3">
					{#each upcoming_tasks as task}
						<div
							class="bg-base-200 flex items-center gap-3 rounded-lg p-3"
						>
							<div
								class="badge badge-{task.priority === 'high'
									? 'error'
									: task.priority === 'medium'
										? 'warning'
										: 'info'} badge-sm"
							></div>
							<div class="flex-1">
								<p class="font-medium">{task.title}</p>
								<p class="text-xs opacity-70">Due: {task.due}</p>
							</div>
							<button
								class="btn btn-ghost btn-xs"
								aria-label="Mark as complete"
							>
								<Checkmark
									height="16px"
									width="16px"
									class_names="h-4 w-4"
								/>
							</button>
						</div>
					{/each}
				</div>
				<div class="card-actions mt-4 justify-end">
					<a href="/tasks" class="btn btn-sm btn-ghost">
						Manage Tasks →
					</a>
				</div>
			</div>
		</div>
	</div>

	<!-- Quick Actions -->
	<div class="card bg-base-100 border-base-300 mt-8 border shadow-sm">
		<div class="card-body">
			<h2 class="card-title text-xl font-bold">Quick Actions</h2>
			<div class="mt-4 flex flex-wrap gap-4">
				<a href="/contacts/new" class="btn btn-primary">
					<div class="mr-2 flex h-5 w-5 items-center justify-center">
						<AddContact height="16px" width="16px" />
					</div>
					Add Contact
				</a>
				<a href="/calendar" class="btn btn-outline">
					<div class="mr-2 flex h-5 w-5 items-center justify-center">
						<Calendar height="16px" width="16px" />
					</div>
					Calendar
				</a>
				<a href="/notes" class="btn btn-outline">
					<div class="mr-2 flex h-5 w-5 items-center justify-center">
						<Notes height="16px" width="16px" />
					</div>
					Notes
				</a>
				<a href="/settings" class="btn btn-outline">
					<div class="mr-2 flex h-5 w-5 items-center justify-center">
						<Settings height="16px" width="16px" />
					</div>
					Settings
				</a>
			</div>
		</div>
	</div>
</div>
