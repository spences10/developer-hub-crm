<script lang="ts">
	interface ConnectionStatus {
		connected: boolean;
		has_follow_scope: boolean;
		username?: string;
	}

	interface Props {
		connection: ConnectionStatus;
		is_authorizing: boolean;
		following_list_length: number;
		is_loading_following: boolean;
		on_connect: () => void;
		on_authorize: () => void;
		on_load_following: () => void;
	}

	let {
		connection,
		is_authorizing,
		following_list_length,
		is_loading_following,
		on_connect,
		on_authorize,
		on_load_following,
	}: Props = $props();
</script>

{#if !connection.connected}
	<!-- Not connected to GitHub -->
	<div class="card mb-6 bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title">Connect Your GitHub Account</h2>
			<p class="text-sm opacity-70">
				To import contacts from GitHub, you need to connect your
				GitHub account and grant access to your following list.
			</p>
			<div class="card-actions justify-end">
				<button
					class="btn btn-primary"
					onclick={on_connect}
					disabled={is_authorizing}
				>
					{#if is_authorizing}
						<span class="loading loading-spinner"></span>
						Connecting...
					{:else}
						Connect GitHub
					{/if}
				</button>
			</div>
		</div>
	</div>
{:else if !connection.has_follow_scope}
	<!-- Connected but missing scope -->
	<div class="card mb-6 bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title">Additional Permission Required</h2>
			<p class="text-sm opacity-70">
				Your GitHub account is connected, but we need additional
				permission to access your following list.
			</p>
			<p class="mt-2 text-sm opacity-70">
				<strong>Why we need this:</strong> To show you the list of people
				you follow on GitHub so you can import them as contacts.
			</p>
			<p class="mt-1 text-sm opacity-70">
				<strong>What we request:</strong> Read-only access to your
				following list (<code>user:follow</code> scope)
			</p>
			<div class="card-actions justify-end">
				<button
					class="btn btn-primary"
					onclick={on_authorize}
					disabled={is_authorizing}
				>
					{#if is_authorizing}
						<span class="loading loading-spinner"></span>
						Authorizing...
					{:else}
						Authorize GitHub Access
					{/if}
				</button>
			</div>
		</div>
	</div>
{:else}
	<!-- Connected with proper scope -->
	<div class="card mb-6 bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title">GitHub Connected</h2>
			<p class="text-sm opacity-70">
				Your GitHub account (@{connection.username}) is connected and
				authorized.
			</p>
			{#if following_list_length === 0 && !is_loading_following}
				<div class="card-actions justify-end">
					<button
						class="btn btn-primary"
						onclick={on_load_following}
						disabled={is_loading_following}
					>
						Load Following List
					</button>
				</div>
			{/if}
		</div>
	</div>
{/if}
