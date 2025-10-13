<script lang="ts">
	import { auth_client } from '$lib/client/auth';
	import PageHeaderWithAction from '$lib/components/page-header-with-action.svelte';
	import PageNav from '$lib/components/page-nav.svelte';
	import { seo_configs } from '$lib/seo';
	import { Head } from 'svead';
	import GithubConnectionStatus from './github-connection-status.svelte';
	import {
		check_github_connection,
		fetch_github_following,
		import_github_contacts,
	} from './github-import.remote';
	import GithubUserCard from './github-user-card.svelte';

	let is_authorizing = $state(false);
	let is_loading_following = $state(false);
	let is_importing = $state(false);
	let selected_usernames = $state<Set<string>>(new Set());
	let following_list = $state<any[]>([]);
	let search = $state('');
	let import_result = $state<
		| {
				success: true;
				imported_count: number;
				skipped_count: number;
		  }
		| {
				success: false;
				error: string;
		  }
		| null
	>(null);

	async function handle_connect_github() {
		try {
			is_authorizing = true;
			await auth_client.linkSocial({
				provider: 'github',
				scopes: ['user:follow'],
			});
		} catch (error) {
			console.error('Error connecting GitHub:', error);
			is_authorizing = false;
		}
	}

	async function handle_authorize_additional_scope() {
		try {
			is_authorizing = true;
			await auth_client.linkSocial({
				provider: 'github',
				scopes: ['user:follow'],
			});
		} catch (error) {
			console.error('Error authorizing GitHub scope:', error);
			is_authorizing = false;
		}
	}

	async function handle_load_following() {
		try {
			is_loading_following = true;
			const result = await fetch_github_following();
			if (result.success && result.profiles) {
				following_list = result.profiles;
			} else if (result.error) {
				console.error('Error loading following:', result.error);
				import_result = {
					success: false,
					error: result.error,
				};
			}
		} catch (error) {
			console.error('Error loading following:', error);
			import_result = {
				success: false,
				error: 'Failed to load following list',
			};
		} finally {
			is_loading_following = false;
		}
	}

	function toggle_selection(username: string) {
		if (selected_usernames.has(username)) {
			selected_usernames.delete(username);
		} else {
			selected_usernames.add(username);
		}
		selected_usernames = new Set(selected_usernames);
	}

	function select_all_not_imported() {
		const not_imported = following_list
			.filter((user) => !user.already_imported)
			.map((user) => user.login);
		selected_usernames = new Set(not_imported);
	}

	function deselect_all() {
		selected_usernames = new Set();
	}

	async function handle_import() {
		if (selected_usernames.size === 0) return;

		try {
			is_importing = true;
			import_result = null;
			const result = await import_github_contacts({
				usernames: Array.from(selected_usernames),
			});

			if (result.success) {
				import_result = {
					success: true,
					imported_count: result.imported_count || 0,
					skipped_count: result.skipped_count || 0,
				};
				await handle_load_following();
				selected_usernames = new Set();
			} else {
				import_result = {
					success: false,
					error: result.error || 'An unexpected error occurred',
				};
			}
		} catch (error) {
			console.error('Error importing contacts:', error);
			import_result = {
				success: false,
				error: 'An unexpected error occurred',
			};
		} finally {
			is_importing = false;
		}
	}

	function filter_following(users: any[], query: string) {
		if (!query) return users;
		const q = query.toLowerCase();
		return users.filter(
			(user) =>
				user.login?.toLowerCase().includes(q) ||
				user.name?.toLowerCase().includes(q) ||
				user.bio?.toLowerCase().includes(q),
		);
	}
</script>

<Head seo_config={seo_configs.contacts} />

<PageHeaderWithAction title="Import from GitHub">
	<a href="/contacts" class="btn btn-ghost btn-outline">Back to Contacts</a>
</PageHeaderWithAction>
<PageNav />

{#await check_github_connection() then connection}
	<GithubConnectionStatus
		{connection}
		{is_authorizing}
		following_list_length={following_list.length}
		{is_loading_following}
		on_connect={handle_connect_github}
		on_authorize={handle_authorize_additional_scope}
		on_load_following={handle_load_following}
	/>

	<!-- Import Results -->
	{#if import_result}
		<div
			class="mb-6 alert {import_result.success
				? 'alert-success'
				: 'alert-error'}"
		>
			{#if import_result.success}
				<span>
					Successfully imported {import_result.imported_count}
					contact{import_result.imported_count === 1 ? '' : 's'}!
					{#if import_result.skipped_count && import_result.skipped_count > 0}
						Skipped {import_result.skipped_count}
						duplicate{import_result.skipped_count === 1 ? '' : 's'}.
					{/if}
				</span>
			{:else}
				<span>
					Error: {import_result.error || 'Failed to import contacts'}
				</span>
			{/if}
		</div>
	{/if}

	<!-- Following List -->
	{#if following_list.length > 0}
		<!-- Search Bar -->
		<div class="mb-6">
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Search</legend>
				<label class="input w-full">
					<input
						type="text"
						bind:value={search}
						placeholder="Search by username, name, or bio..."
						class="grow"
					/>
				</label>
			</fieldset>
		</div>

		<!-- Actions -->
		<div class="mb-6 flex flex-wrap gap-2">
			<button
				class="btn btn-ghost btn-sm"
				onclick={select_all_not_imported}
			>
				Select All New
			</button>
			<button class="btn btn-ghost btn-sm" onclick={deselect_all}>
				Deselect All
			</button>
			<button
				class="btn btn-sm btn-primary"
				onclick={handle_import}
				disabled={selected_usernames.size === 0 || is_importing}
			>
				{#if is_importing}
					<span class="loading loading-spinner"></span>
					Importing {selected_usernames.size}
					contact{selected_usernames.size === 1 ? '' : 's'}...
				{:else}
					Import {selected_usernames.size} Selected
				{/if}
			</button>
		</div>

		<!-- User Grid -->
		{@const filtered = filter_following(following_list, search)}
		{#if filtered.length === 0}
			<div class="alert">
				<span>No users found matching your search.</span>
			</div>
		{:else}
			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each filtered as user}
					<GithubUserCard
						{user}
						selected={selected_usernames.has(user.login)}
						on_toggle={toggle_selection}
					/>
				{/each}
			</div>

			<div class="mt-6 text-center text-sm opacity-70">
				Showing {filtered.length} of {following_list.length}
				user{following_list.length === 1 ? '' : 's'}
			</div>
		{/if}
	{:else if is_loading_following}
		<div class="flex flex-col items-center gap-4 py-12">
			<span class="loading loading-lg loading-spinner"></span>
			<p class="opacity-70">
				Loading your following list from GitHub...
			</p>
			<p class="text-sm opacity-50">
				This may take a moment if you follow many people
			</p>
		</div>
	{/if}
{/await}
