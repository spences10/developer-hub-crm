<script lang="ts">
	import { goto } from '$app/navigation';
	import Logo from '$lib/logo.svelte';
	import { generate_qr_code_data_url } from '$lib/utils/qr-code';
	import { onMount } from 'svelte';
	import { get_current_user, logout } from '../auth.remote';
	import { ensure_profile } from './layout.remote';
	import {
		get_profile_qr_url,
		get_user_qr_code,
		save_qr_code,
	} from './profile/profile.remote';

	let { children } = $props();

	async function handle_logout() {
		await logout();
		goto('/login');
	}

	// Auto-generate QR code if user doesn't have one
	onMount(async () => {
		try {
			// Wait for profile to be ensured first
			await ensure_profile();

			const qr_url = await get_user_qr_code();
			if (!qr_url) {
				// Generate QR code silently in background
				const profile_url = await get_profile_qr_url();
				const data_url = await generate_qr_code_data_url(profile_url);
				await save_qr_code({ qr_code_url: data_url });
			}
		} catch (error) {
			// Silent fail - users can generate manually in settings
			console.error('Failed to auto-generate QR code:', error);
		}
	});
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<svelte:boundary>
	{#await ensure_profile()}
		<div class="flex min-h-screen items-center justify-center">
			<span class="loading loading-lg loading-spinner"></span>
		</div>
	{:then}
		<div class="min-h-screen bg-base-200">
			<div class="navbar bg-base-100 shadow-lg">
				<div class="flex-1">
					<a href="/dashboard" class="">
						<Logo />
					</a>
				</div>
				<div class="flex-none gap-2">
					{#await get_current_user() then user}
						{#if user}
							<div class="dropdown dropdown-end">
								<div
									tabindex="0"
									role="button"
									class="btn avatar btn-circle btn-ghost"
								>
									<div class="w-10 rounded-full">
										{#if user.image}
											<img src={user.image} alt={user.name} />
										{:else}
											<div
												class="flex h-full w-full items-center justify-center bg-neutral text-neutral-content"
											>
												<span class="text-xl">
													{user.name?.[0]?.toUpperCase()}
												</span>
											</div>
										{/if}
									</div>
								</div>
								<ul
									tabindex="0"
									class="dropdown-content menu z-[1] mt-3 w-52 menu-sm rounded-box bg-base-100 p-2 shadow"
								>
									<li class="menu-title">
										<span>{user.name}</span>
									</li>
									<li><a href="/dashboard">Dashboard</a></li>
									<li><a href="/contacts">Contacts</a></li>
									<li><a href="/interactions">Interactions</a></li>
									<li><a href="/follow-ups">Follow-ups</a></li>
									<li><a href="/settings">Settings</a></li>
									<li>
										<button onclick={handle_logout}>Logout</button>
									</li>
								</ul>
							</div>
						{/if}
					{/await}
				</div>
			</div>

			<main class="p-8">
				{@render children()}
			</main>
		</div>
	{/await}

	{#snippet pending()}
		<div class="flex min-h-screen items-center justify-center">
			<span class="loading loading-lg loading-spinner"></span>
		</div>
	{/snippet}

	{#snippet failed(error: unknown, reset)}
		<div class="flex min-h-screen items-center justify-center">
			<div class="alert max-w-md alert-error">
				<span
					>Error: {error instanceof Error
						? error.message
						: String(error)}</span
				>
				<button class="btn btn-sm" onclick={reset}>Retry</button>
			</div>
		</div>
	{/snippet}
</svelte:boundary>
