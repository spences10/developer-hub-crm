<script lang="ts">
	import { get_current_user, logout } from '../auth/auth.remote';
	import { get_dashboard_data } from './dashboard.remote';
	import { goto } from '$app/navigation';

	async function handle_logout() {
		await logout();
		goto('/auth/login');
	}
</script>

<svelte:boundary>
	<div class="min-h-screen bg-base-200 p-8">
		<div class="mx-auto max-w-4xl">
			<div class="mb-8 flex items-center justify-between">
				<h1 class="text-3xl font-bold">Dashboard</h1>
				<button class="btn btn-outline" onclick={handle_logout}>
					Logout
				</button>
			</div>

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
	</div>

	{#snippet pending()}
		<div class="flex min-h-screen items-center justify-center">
			<span class="loading loading-lg loading-spinner"></span>
		</div>
	{/snippet}

	{#snippet failed(error: unknown, reset)}
		<div class="flex min-h-screen items-center justify-center">
			<div class="alert max-w-md alert-error">
				<span>Error: {error instanceof Error ? error.message : String(error)}</span>
				<button class="btn btn-sm" onclick={reset}>Retry</button>
			</div>
		</div>
	{/snippet}
</svelte:boundary>
