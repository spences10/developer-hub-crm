<script lang="ts">
	import { get_current_user } from './auth/auth.remote';
</script>

<div class="flex min-h-screen flex-col items-center justify-center">
	<div class="text-center">
		<h1 class="mb-4 text-5xl font-bold">Developer Hub CRM</h1>
		<p class="mb-8 text-xl opacity-70">Connect, Relate, Meet</p>

		{#await get_current_user() then user}
			{#if user}
				<div class="space-y-4">
					<p class="text-lg">Welcome back, {user.name}!</p>
					<a href="/dashboard" class="btn btn-primary">
						Go to Dashboard
					</a>
				</div>
			{:else}
				<div class="flex gap-4">
					<a href="/auth/login" class="btn btn-primary"> Login </a>
					<a href="/auth/register" class="btn btn-outline">
						Register
					</a>
				</div>
			{/if}
		{/await}
	</div>
</div>
