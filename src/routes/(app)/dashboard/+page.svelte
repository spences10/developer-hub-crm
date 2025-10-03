<script lang="ts">
	import { get_current_user } from '../../auth.remote';
	import { get_dashboard_data } from './dashboard.remote';
</script>

<div class="mx-auto max-w-4xl">
	<h1 class="mb-8 text-3xl font-bold">Dashboard</h1>

	<div class="grid gap-6">
		<!-- User info card -->
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">User Information</h2>
				{#await get_current_user() then user}
					{#if user}
						<div class="space-y-2">
							<p><strong>Name:</strong> {user.name}</p>
							<p><strong>Email:</strong> {user.email}</p>
							<p>
								<strong>Email Verified:</strong>
								{user.emailVerified ? 'Yes' : 'No'}
							</p>
						</div>
					{/if}
				{/await}
			</div>
		</div>

		<!-- Protected data card -->
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">Protected Data</h2>
				{#await get_dashboard_data() then data}
					<p>{data.message}</p>
					<p class="text-sm opacity-70">
						Loaded at: {new Date(data.timestamp).toLocaleString()}
					</p>
				{/await}
			</div>
		</div>
	</div>
</div>
