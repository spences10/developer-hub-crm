<script lang="ts">
	import { create_contact_store } from '$lib/state/contact-context.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	// Get data from the server
	const { data } = $props<{ data: PageData }>();

	// Initialize contact store
	const contact_store = create_contact_store();

	// Initialize with data when component mounts
	onMount(() => {
		// Initialize with contacts data from the server
		contact_store.initialize(data.contacts || []);
	});

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

<div class="bg-base-200 min-h-screen p-4">
	<!-- Navigation -->
	<div class="navbar bg-base-100 rounded-box mb-6 shadow-md">
		<div class="flex-1">
			<a href="/dashboard" class="btn btn-ghost text-xl"
				>Developer Hub CRM</a
			>
		</div>
		<div class="flex-none gap-2">
			<a href="/contacts" class="btn btn-ghost btn-sm">Contacts</a>
			<a href="/analytics" class="btn btn-ghost btn-sm">Analytics</a>
			<div class="dropdown dropdown-end">
				<label
					for="user-menu"
					class="btn btn-ghost btn-circle avatar placeholder"
				>
					<div
						class="bg-neutral text-neutral-content w-10 rounded-full"
					>
						<span>{get_user_initial()}</span>
					</div>
				</label>
				<ul
					id="user-menu"
					class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
				>
					<li><a href="/profile">Profile</a></li>
					<li>
						<form method="POST" action="/auth?/logout">
							<button type="submit" class="w-full text-left"
								>Logout</button
							>
						</form>
					</li>
				</ul>
			</div>
		</div>
	</div>

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
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
						/>
					</svg>
					Quick Stats
				</h2>
				<div class="stats stats-vertical bg-base-200 shadow">
					<div class="stat">
						<div class="stat-figure text-primary">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-8 w-8"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
						</div>
						<div class="stat-title">Total Contacts</div>
						<div class="stat-value text-primary">
							{contact_store.total_contacts}
						</div>
						<div class="stat-desc">Your network size</div>
					</div>
					<div class="stat">
						<div class="stat-figure text-secondary">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-8 w-8"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
								/>
							</svg>
						</div>
						<div class="stat-title">VIP Contacts</div>
						<div class="stat-value text-secondary">
							{contact_store.vip_contacts}
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
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
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
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
						/>
					</svg>
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
								aria-label="Mark as complete">✓</button
							>
						</div>
					{/each}
				</div>
				<div class="card-actions mt-4 justify-end">
					<a href="/tasks" class="btn btn-sm btn-outline"
						>Manage Tasks</a
					>
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
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-2 h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
						/>
					</svg>
					Add Contact
				</a>
				<a href="/calendar" class="btn btn-outline">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-2 h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
					Calendar
				</a>
				<a href="/notes" class="btn btn-outline">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-2 h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
						/>
					</svg>
					Notes
				</a>
				<a href="/settings" class="btn btn-outline">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="mr-2 h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
					Settings
				</a>
			</div>
		</div>
	</div>
</div>
