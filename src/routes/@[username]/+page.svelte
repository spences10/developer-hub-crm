<script lang="ts">
	import { page } from '$app/state';
	import {
		Bluesky,
		ContactBook,
		GitHub,
		Globe,
		LinkedIn,
		LocationPin,
		Mastodon,
		Phone,
		Rocket,
		Twitter,
		YouTube,
	} from '$lib/icons';
	import { get_current_user } from '../auth.remote';
	import { get_profile } from './profile.remote';

	const username = $derived(page.params.username);
	const is_qr_scan = $derived(page.url.searchParams.has('qr'));

	// Icon mapping for social platforms
	const platform_icons: Record<string, any> = {
		github: GitHub,
		twitter: Twitter,
		linkedin: LinkedIn,
		youtube: YouTube,
		bluesky: Bluesky,
		mastodon: Mastodon,
	};

	// Label mapping for social platforms
	const platform_labels: Record<string, string> = {
		github: 'GitHub',
		twitter: 'Twitter',
		linkedin: 'LinkedIn',
		youtube: 'YouTube',
		bluesky: 'Bluesky',
		mastodon: 'Mastodon',
	};

	function get_platform_icon(platform: string) {
		return platform_icons[platform.toLowerCase()] || Globe;
	}

	function get_platform_label(platform: string) {
		return (
			platform_labels[platform.toLowerCase()] ||
			platform.charAt(0).toUpperCase() + platform.slice(1)
		);
	}
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
										<h1 class="mb-1 text-4xl font-bold">
											{profile.name}
										</h1>
										<p class="mb-3 text-xl text-base-content/60">
											@{profile.username}
										</p>

										{#if profile.tagline}
											<p class="mb-3 text-lg font-medium text-base-content/90">
												{profile.tagline}
											</p>
										{/if}

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
													<LocationPin size="20px" />
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
													<Globe size="20px" />
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
											{@const Icon = get_platform_icon(link.platform)}
											<a
												href={link.url}
												target="_blank"
												rel="noopener noreferrer"
												class="btn gap-2 btn-outline btn-sm"
											>
												<Icon size="16px" />
												{get_platform_label(link.platform)}
											</a>
										{/each}
									</div>
								{/if}

								<!-- QR Scan CTA -->
								{#if is_qr_scan}
									<div class="divider"></div>
									<div class="text-center">
										{#await get_current_user() then current_user}
											{#if current_user}
												<div class="mb-4 alert alert-info">
													<Phone size="24px" />
													<span>Scanned from QR code</span>
												</div>
												<button class="btn btn-lg btn-primary">
													<ContactBook size="24px" />
													Add {profile.username} to My Contacts
												</button>
											{:else}
												<div class="mb-4 alert alert-success">
													<Phone size="24px" />
													<span>
														QR Code scanned! Save this contact to your
														CRM
													</span>
												</div>
												<a
													href="/register"
													class="btn btn-lg btn-primary"
												>
													<Rocket size="24px" />
													Sign up to save {profile.username}'s contact
												</a>
												<p class="mt-4 text-sm text-base-content/60">
													Create your free account and get your own QR
													profile
												</p>
											{/if}
										{/await}
									</div>
								{/if}

								<!-- QR Code -->
								<div class="divider"></div>
								<div class="text-center">
									<h2 class="mb-4 text-2xl font-bold">QR Code</h2>
									{#if profile.qr_code_url}
										<div class="mx-auto w-64">
											<img
												src={profile.qr_code_url}
												alt="QR Code for {profile.username}"
												class="rounded-lg border-2 border-base-300"
											/>
										</div>
										<p class="mt-4 text-sm text-base-content/60">
											Scan to add {profile.username} to your Devhub CRM
										</p>
									{:else}
										<div
											class="mx-auto flex h-64 w-64 items-center justify-center rounded-lg bg-base-200"
										>
											<div class="text-center">
												<p class="text-base-content/40">
													No QR Code yet
												</p>
												<p class="mt-2 text-sm text-base-content/30">
													Generate one in Settings
												</p>
											</div>
										</div>
									{/if}
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
