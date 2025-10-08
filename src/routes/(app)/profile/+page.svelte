<script lang="ts">
	import PageNav from '$lib/components/page-nav.svelte';
	import SocialLinkIcon from '$lib/components/social-link.svelte';
	import { seo_configs } from '$lib/seo';
	import { generate_qr_code_data_url } from '$lib/utils/qr-code';
	import { Head } from 'svead';
	import { onMount } from 'svelte';
	import {
		add_user_social_link,
		delete_user_social_link,
		disconnect_github,
		get_github_connection_status,
		get_profile_qr_url,
		get_user_profile,
		get_user_qr_code,
		get_user_social_links,
		save_qr_code,
		update_bio,
		update_email,
		update_location,
		update_name,
		update_tagline,
		update_username,
		update_visibility,
		update_website,
	} from './profile.remote';

	const profile = get_user_profile();
	const social_links = get_user_social_links();
	const github_status = get_github_connection_status();
	const user_qr = get_user_qr_code();

	let saving = $state(false);
	let generating_qr = $state(false);
	let qr_code_url = $state<string | null>(null);
	let refresh_key = $state(0);

	// Social link form state
	let new_platform = $state('');
	let new_url = $state('');
	let adding_link = $state(false);

	onMount(async () => {
		const url = await user_qr;
		qr_code_url = url;
	});

	async function save_with_indicator(fn: () => Promise<void>) {
		saving = true;
		await fn();
		await profile.refresh();
		setTimeout(() => (saving = false), 500);
	}

	async function handle_generate_qr() {
		generating_qr = true;
		try {
			const profile_url = await get_profile_qr_url();
			const data_url = await generate_qr_code_data_url(profile_url);
			await save_qr_code({ qr_code_url: data_url });
			qr_code_url = data_url;
		} catch (error) {
			console.error('Failed to generate QR code:', error);
		} finally {
			generating_qr = false;
		}
	}

	async function handle_add_social_link() {
		if (!new_platform || !new_url) return;

		adding_link = true;
		try {
			await add_user_social_link({
				platform: new_platform,
				url: new_url,
			});
			new_platform = '';
			new_url = '';
			refresh_key++;
		} catch (err) {
			console.error('Failed to add social link:', err);
		} finally {
			adding_link = false;
		}
	}

	async function handle_delete_social_link(link_id: string) {
		if (!confirm('Remove this social link?')) return;

		try {
			await delete_user_social_link(link_id);
			refresh_key++;
		} catch (err) {
			console.error('Failed to delete social link:', err);
		}
	}

	async function handle_disconnect_github() {
		if (
			!confirm(
				'Are you sure you want to disconnect your GitHub account?',
			)
		)
			return;

		try {
			await disconnect_github(undefined);
			await github_status.refresh();
			await profile.refresh();
		} catch (err) {
			console.error('Failed to disconnect GitHub:', err);
		}
	}
</script>

<Head seo_config={seo_configs.settings} />

<div class="mx-auto max-w-6xl">
	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold">Profile Settings</h1>
		</div>
		{#if saving}
			<span class="badge badge-lg badge-success">Saving...</span>
		{/if}
	</div>
	<PageNav />

	{#await profile}
		<div class="flex justify-center">
			<span class="loading loading-lg loading-spinner"></span>
		</div>
	{:then profile_data}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<!-- Personal Info -->
			<div class="card bg-base-100 shadow-xl md:col-span-2">
				<div class="card-body">
					<h2 class="card-title">Personal Information</h2>
					<p class="text-sm opacity-70">
						Your basic account information
					</p>

					<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
						<fieldset class="fieldset">
							<legend class="fieldset-legend">Name</legend>
							<label class="input w-full">
								<input
									type="text"
									class="grow"
									value={profile_data.name}
									onblur={(e) =>
										save_with_indicator(() =>
											update_name(e.currentTarget.value),
										)}
								/>
							</label>
						</fieldset>

						<fieldset class="fieldset">
							<legend class="fieldset-legend">Email</legend>
							<label class="input w-full">
								<input
									type="email"
									class="grow"
									value={profile_data.email}
									onblur={(e) =>
										save_with_indicator(() =>
											update_email(e.currentTarget.value),
										)}
								/>
							</label>
						</fieldset>
					</div>
				</div>
			</div>

			<!-- Public Profile -->
			<div class="card bg-base-100 shadow-xl md:col-span-2">
				<div class="card-body">
					<h2 class="card-title">Public Profile</h2>
					<p class="text-sm opacity-70">
						Information displayed on your public profile page
					</p>

					<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
						<fieldset class="fieldset">
							<legend class="fieldset-legend">
								Username
								<span class="text-xs opacity-60">
									(devhubcrm.com/@{profile_data.username})
								</span>
							</legend>
							<label class="input w-full">
								<input
									type="text"
									class="grow"
									value={profile_data.username}
									onblur={(e) =>
										save_with_indicator(() =>
											update_username(e.currentTarget.value),
										)}
								/>
							</label>
						</fieldset>

						<fieldset class="fieldset">
							<legend class="fieldset-legend">Tagline</legend>
							<label class="input w-full">
								<input
									type="text"
									class="grow"
									value={profile_data.tagline || ''}
									placeholder="Your professional title or tagline"
									onblur={(e) =>
										save_with_indicator(() =>
											update_tagline(e.currentTarget.value),
										)}
								/>
							</label>
						</fieldset>

						<fieldset class="fieldset">
							<legend class="fieldset-legend">Location</legend>
							<label class="input w-full">
								<input
									type="text"
									class="grow"
									value={profile_data.location || ''}
									placeholder="City, Country"
									onblur={(e) =>
										save_with_indicator(() =>
											update_location(e.currentTarget.value),
										)}
								/>
							</label>
						</fieldset>

						<fieldset class="fieldset">
							<legend class="fieldset-legend">Website</legend>
							<label class="input w-full">
								<input
									type="url"
									class="grow"
									value={profile_data.website || ''}
									placeholder="https://example.com"
									onblur={(e) =>
										save_with_indicator(() =>
											update_website(e.currentTarget.value),
										)}
								/>
							</label>
						</fieldset>

						<fieldset class="fieldset md:col-span-2">
							<legend class="fieldset-legend">Bio</legend>
							<textarea
								class="textarea-bordered textarea w-full"
								rows="3"
								placeholder="Tell others about yourself"
								value={profile_data.bio || ''}
								onblur={(e) =>
									save_with_indicator(() =>
										update_bio(e.currentTarget.value),
									)}
							></textarea>
						</fieldset>
					</div>
				</div>
			</div>

			<!-- Social Links -->
			{#key refresh_key}
				{#await social_links then links}
					<div class="card bg-base-100 shadow-xl">
						<div class="card-body">
							<h2 class="card-title">Social Links</h2>
							<p class="text-sm opacity-70">
								Add links to your social media profiles
							</p>

							<!-- Existing Links -->
							{#if links && links.length > 0}
								<div class="mt-4 space-y-2">
									{#each links as link}
										<div
											class="flex items-center justify-between gap-2 rounded-lg bg-base-200 p-3"
										>
											<div class="flex items-center gap-3">
												<SocialLinkIcon platform={link.platform} />
												<span class="text-sm font-medium capitalize">
													{link.platform}:
												</span>
												<a
													href={link.url}
													target="_blank"
													rel="noopener noreferrer"
													class="link text-sm link-primary"
												>
													{link.url}
												</a>
											</div>
											<button
												type="button"
												onclick={() =>
													handle_delete_social_link(link.id)}
												class="btn btn-ghost btn-xs"
											>
												Remove
											</button>
										</div>
									{/each}
								</div>
							{/if}

							<!-- Add New Link -->
							<div class="mt-4 space-y-3">
								<p class="text-xs font-medium opacity-70">
									Add new social link
								</p>
								<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
									<fieldset class="fieldset">
										<legend class="fieldset-legend">Platform</legend>
										<select
											bind:value={new_platform}
											class="select w-full"
										>
											<option value="">Select platform</option>
											<option value="github">GitHub</option>
											<option value="twitter">Twitter/X</option>
											<option value="bluesky">Bluesky</option>
											<option value="linkedin">LinkedIn</option>
											<option value="mastodon">Mastodon</option>
											<option value="website">Website</option>
										</select>
									</fieldset>
									<fieldset class="fieldset">
										<legend class="fieldset-legend">URL</legend>
										<label class="input w-full">
											<input
												type="url"
												placeholder="https://example.com"
												bind:value={new_url}
												class="grow"
											/>
										</label>
									</fieldset>
								</div>
								<button
									type="button"
									onclick={handle_add_social_link}
									disabled={adding_link || !new_platform || !new_url}
									class="btn btn-block btn-primary"
								>
									{#if adding_link}
										<span class="loading loading-sm loading-spinner"
										></span>
									{:else}
										Add
									{/if}
								</button>
							</div>
						</div>
					</div>
				{/await}
			{/key}

			<!-- Privacy Settings -->
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title">Privacy</h2>
					<p class="text-sm opacity-70">
						Control who can see your public profile
					</p>

					<div class="mt-4 space-y-3">
						<label class="flex cursor-pointer items-center gap-3">
							<input
								type="radio"
								name="visibility"
								value="public"
								class="radio radio-primary"
								checked={profile_data.visibility === 'public'}
								onchange={() =>
									save_with_indicator(() =>
										update_visibility('public'),
									)}
							/>
							<div class="flex flex-col">
								<span class="font-medium">Public</span>
								<span class="text-sm opacity-60">
									Anyone can view your profile
								</span>
							</div>
						</label>

						<label class="flex cursor-pointer items-center gap-3">
							<input
								type="radio"
								name="visibility"
								value="unlisted"
								class="radio radio-primary"
								checked={profile_data.visibility === 'unlisted'}
								onchange={() =>
									save_with_indicator(() =>
										update_visibility('unlisted'),
									)}
							/>
							<div class="flex flex-col">
								<span class="font-medium">Unlisted</span>
								<span class="text-sm opacity-60">
									Only people with the link can view
								</span>
							</div>
						</label>

						<label class="flex cursor-pointer items-center gap-3">
							<input
								type="radio"
								name="visibility"
								value="private"
								class="radio radio-primary"
								checked={profile_data.visibility === 'private'}
								onchange={() =>
									save_with_indicator(() =>
										update_visibility('private'),
									)}
							/>
							<div class="flex flex-col">
								<span class="font-medium">Private</span>
								<span class="text-sm opacity-60">
									Only logged-in users can view
								</span>
							</div>
						</label>
					</div>
				</div>
			</div>

			<!-- GitHub Integration -->
			{#await github_status then status}
				<div class="card bg-base-100 shadow-xl">
					<div class="card-body">
						<h2 class="card-title">GitHub Integration</h2>
						<p class="text-sm opacity-70">
							Connect your GitHub account for enhanced features
						</p>

						<div class="mt-4">
							{#if status.is_connected}
								<div class="space-y-3">
									<div class="alert alert-success">
										<span>
											Connected as
											<strong>{status.github_username}</strong>
										</span>
									</div>
									<button
										onclick={handle_disconnect_github}
										class="btn btn-outline btn-sm btn-error"
									>
										Disconnect GitHub
									</button>
								</div>
							{:else}
								<div class="alert alert-info">
									<span>No GitHub account connected</span>
								</div>
								<a
									href="/api/auth/signin/github"
									class="btn mt-3 btn-sm btn-primary"
								>
									Connect GitHub
								</a>
							{/if}
						</div>
					</div>
				</div>
			{/await}

			<!-- QR Code -->
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title">Profile QR Code</h2>
					<p class="text-sm opacity-70">
						Your unique QR code that links to your public profile
					</p>

					<div
						class="mt-4 flex flex-col items-center gap-4 md:flex-row"
					>
						{#if generating_qr}
							<div
								class="flex h-64 w-64 items-center justify-center rounded-lg border-2 border-dashed border-base-300"
							>
								<span class="loading loading-lg loading-spinner"
								></span>
							</div>
						{:else if qr_code_url}
							<div class="flex flex-col items-center gap-4">
								<img
									src={qr_code_url}
									alt="Profile QR Code"
									class="w-64 rounded-lg border-2 border-base-300"
								/>
								<button
									class="btn btn-outline btn-sm"
									onclick={handle_generate_qr}
								>
									Regenerate
								</button>
							</div>
						{:else}
							<div
								class="flex h-64 w-64 items-center justify-center rounded-lg border-2 border-dashed border-base-300"
							>
								<button
									class="btn btn-primary"
									onclick={handle_generate_qr}
								>
									Generate QR Code
								</button>
							</div>
						{/if}

						<div class="flex-1">
							<h3 class="mb-2 font-semibold">How to use:</h3>
							<ul class="list-inside list-disc space-y-1 text-sm">
								<li>Download and add it to your business card</li>
								<li>
									People can scan it to instantly view and save your
									contact info
								</li>
								<li>Share it at conferences and networking events</li>
								<li>Track scans in your analytics (coming soon)</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	{:catch error}
		<div class="alert alert-error">
			<span>Failed to load profile: {error.message}</span>
		</div>
	{/await}
</div>
