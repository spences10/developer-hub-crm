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
	<div class="hero bg-base-100 rounded-box mb-6 p-6 shadow-md">
		<div class="hero-content text-center">
			<div class="max-w-md">
				<h1 class="text-3xl font-bold">
					{#if data.user && data.user.username}
						Welcome, {data.user.username}!
					{:else}
						Welcome to Developer Hub CRM!
					{/if}
				</h1>
				<p class="py-4">
					Your Developer Hub CRM dashboard is ready. Manage your
					contacts, track activities, and grow your network.
				</p>
				<a href="/contacts" class="btn btn-primary">Manage Contacts</a
				>
			</div>
		</div>
	</div>

	<!-- Dashboard Grid -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<!-- Quick Stats -->
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title flex items-center gap-2">
					<Stats height="24px" width="24px" class_names="h-6 w-6" />
					Quick Stats
				</h2>
				<div class="stats stats-vertical bg-base-200 shadow">
					<div class="stat">
						<div class="stat-figure text-primary">
							<Network
								height="32px"
								width="32px"
								class_names="h-8 w-8"
							/>
						</div>
						<div class="stat-title">Total Contacts</div>
						<div class="stat-value text-primary">
							{contact_state.total_contacts}
						</div>
						<div class="stat-desc">Your network size</div>
					</div>
					<div class="stat">
						<div class="stat-figure text-secondary">
							<VIP height="32px" width="32px" class_names="h-8 w-8" />
						</div>
						<div class="stat-title">VIP Contacts</div>
						<div class="stat-value text-secondary">
							{contact_state.vip_contacts}
						</div>
						<div class="stat-desc">High-priority connections</div>
					</div>
				</div>
				<div class="card-actions mt-4 justify-end">
					<a href="/analytics" class="btn btn-sm btn-outline"
						>View Analytics</a
					>
				</div>
			</div>
		</div>

		<!-- Recent Activity -->
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title flex items-center gap-2">
					<Clock height="24px" width="24px" class_names="h-6 w-6" />
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
					<a href="/activity" class="btn btn-sm btn-outline"
						>View All Activity</a
					>
				</div>
			</div>
		</div>

		<!-- Upcoming Tasks -->
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title flex items-center gap-2">
					<Tasks height="24px" width="24px" class_names="h-6 w-6" />
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
					<a href="/tasks" class="btn btn-sm btn-outline">
						Manage Tasks
					</a>
				</div>
			</div>
		</div>
	</div>

	<!-- Quick Actions -->
	<div class="card bg-base-100 mt-6 shadow-xl">
		<div class="card-body">
			<h2 class="card-title">Quick Actions</h2>
			<div class="mt-2 flex flex-wrap gap-3">
				<a href="/contacts/new" class="btn btn-primary">
					<AddContact
						height="20px"
						width="20px"
						class_names="mr-2 h-5 w-5"
					/>
					Add Contact
				</a>
				<a href="/calendar" class="btn btn-outline">
					<Calendar
						height="20px"
						width="20px"
						class_names="mr-2 h-5 w-5"
					/>
					Calendar
				</a>
				<a href="/notes" class="btn btn-outline">
					<Notes
						height="20px"
						width="20px"
						class_names="mr-2 h-5 w-5"
					/>
					Notes
				</a>
				<a href="/settings" class="btn btn-outline">
					<Settings
						height="20px"
						width="20px"
						class_names="mr-2 h-5 w-5"
					/>
					Settings
				</a>
			</div>
		</div>
	</div>
</div>
