<script lang="ts">
	import { page } from '$app/state';
	import Github from '$lib/icons/github.svelte';
	import { get_profile } from './profile.remote';

	const username = $derived(page.params.username);
</script>

<svelte:boundary>
	{#if username}
		{#await get_profile(username) then profile}
			{#if profile}
				<div class="min-h-screen bg-base-200 py-12">
					<div class="container mx-auto max-w-4xl px-4">
						<!-- Profile Card -->
						<div class="card bg-base-100 shadow-xl">
							<div class="card-body">
								<!-- Header Section -->
								<div
									class="flex flex-col items-center gap-6 md:flex-row"
								>
									<!-- Avatar -->
									<div class="avatar">
										<div class="w-32 rounded-full">
											{#if profile.image}
												<img
													src={profile.image}
													alt={profile.username}
												/>
											{:else}
												<div
													class="flex h-full w-full items-center justify-center bg-neutral text-neutral-content"
												>
													<span class="text-5xl">
														{profile.username[0].toUpperCase()}
													</span>
												</div>
											{/if}
										</div>
									</div>

									<!-- Info Section -->
									<div class="flex-1 text-center md:text-left">
										<h1 class="mb-2 text-4xl font-bold">
											@{profile.username}
										</h1>

										{#if profile.bio}
											<p class="mb-4 text-lg text-base-content/80">
												{profile.bio}
											</p>
										{/if}

										<div
											class="flex flex-wrap items-center justify-center gap-4 md:justify-start"
										>
											{#if profile.location}
												<div class="flex items-center gap-2">
													<svg
														class="h-5 w-5"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
														/>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
														/>
													</svg>
													<span>{profile.location}</span>
												</div>
											{/if}

											{#if profile.website}
												<a
													href={profile.website}
													target="_blank"
													rel="noopener noreferrer"
													class="flex link items-center gap-2 link-primary"
												>
													<svg
														class="h-5 w-5"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
														/>
													</svg>
													{profile.website.replace(
														/^https?:\/\//,
														'',
													)}
												</a>
											{/if}
										</div>
									</div>
								</div>

								<!-- Social Links -->
								{#if profile.social_links.length > 0}
									<div class="divider"></div>
									<div
										class="flex flex-wrap justify-center gap-4 md:justify-start"
									>
										{#each profile.social_links as link}
											<a
												href={link.url}
												target="_blank"
												rel="noopener noreferrer"
												class="btn gap-2 btn-outline btn-sm"
											>
												{#if link.platform === 'github'}
													<Github size="16px" />
													GitHub
												{:else if link.platform === 'twitter'}
													<svg
														class="h-4 w-4"
														fill="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
														/>
													</svg>
													Twitter
												{:else}
													{link.platform}
												{/if}
											</a>
										{/each}
									</div>
								{/if}

								<!-- QR Code Placeholder -->
								<div class="divider"></div>
								<div class="text-center">
									<h2 class="mb-4 text-2xl font-bold">QR Code</h2>
									<div
										class="mx-auto flex h-64 w-64 items-center justify-center rounded-lg bg-base-200"
									>
										<span class="text-base-content/40"
											>QR Code Coming Soon</span
										>
									</div>
									<p class="mt-4 text-sm text-base-content/60">
										Scan to add {profile.username} to your Devhub CRM
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			{:else}
				<!-- Profile Not Found -->
				<div
					class="flex min-h-screen items-center justify-center bg-base-200"
				>
					<div class="card max-w-md bg-base-100 shadow-xl">
						<div class="card-body text-center">
							<h2 class="card-title justify-center text-3xl">
								Profile Not Found
							</h2>
							<p class="text-base-content/70">
								The profile @{username} doesn't exist or is not public.
							</p>
							<div class="card-actions justify-center">
								<a href="/" class="btn btn-primary">Go Home</a>
							</div>
						</div>
					</div>
				</div>
			{/if}
		{/await}
	{/if}

	{#snippet pending()}
		<div class="flex min-h-screen items-center justify-center">
			<span class="loading loading-lg loading-spinner"></span>
		</div>
	{/snippet}

	{#snippet failed(error, reset)}
		<div class="flex min-h-screen items-center justify-center">
			<div class="alert max-w-md alert-error">
				<span>
					Error loading profile: {error instanceof Error
						? error.message
						: String(error)}
				</span>
				<button class="btn btn-sm" onclick={reset}>Retry</button>
			</div>
		</div>
	{/snippet}
</svelte:boundary>
