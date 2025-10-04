<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		add_social_link,
		create_contact,
		fetch_github_data,
	} from '../contacts.remote';

	// Form state
	let name = $state('');
	let email = $state('');
	let phone = $state('');
	let company = $state('');
	let title = $state('');
	let github_username = $state('');
	let is_vip = $state(false);
	let birthday = $state('');
	let notes = $state('');

	// Social links from GitHub import (stored temporarily)
	let pending_social_links = $state<
		Array<{ platform: string; url: string }>
	>([]);

	// GitHub import state
	let github_input = $state('');
	let loading = $state(false);
	let error = $state('');

	async function handle_github_import() {
		if (!github_input.trim()) return;

		loading = true;
		error = '';

		try {
			const result = await fetch_github_data(github_input.trim());

			if (result && 'error' in result) {
				error = result.error;
			} else if (result && 'data' in result) {
				const data = result.data;
				// Pre-fill form with GitHub data
				name = data.name || name;
				email = data.email || email;
				company = data.company || company;
				github_username = data.github_username || github_username;
				notes = data.notes || notes;

				// Store social links temporarily
				pending_social_links = data.social_links || [];

				// Clear GitHub input on success
				github_input = '';
			}
		} catch (e) {
			error = 'Failed to fetch GitHub profile';
		} finally {
			loading = false;
		}
	}

	function remove_social_link(index: number) {
		pending_social_links = pending_social_links.filter(
			(_, i) => i !== index,
		);
	}

</script>

<div class="mx-auto max-w-2xl">
	<div class="mb-8">
		<a href="/contacts" class="link link-hover">
			&larr; Back to Contacts
		</a>
		<h1 class="mt-4 text-3xl font-bold">New Contact</h1>
	</div>

	<!-- GitHub Import Section -->
	<div class="card mb-6 bg-primary/5 shadow-md">
		<div class="card-body">
			<h2 class="card-title text-lg">Quick Import from GitHub</h2>
			<p class="text-sm opacity-70">
				Automatically populate contact details from a GitHub profile
			</p>
			<div class="mt-4 flex gap-2">
				<label class="input flex-1">
					<input
						type="text"
						placeholder="Enter GitHub username (e.g., octocat)"
						class="grow"
						bind:value={github_input}
						onkeydown={(e) =>
							e.key === 'Enter' && handle_github_import()}
						disabled={loading}
					/>
				</label>
				<button
					class="btn btn-primary"
					onclick={handle_github_import}
					disabled={loading || !github_input.trim()}
				>
					{#if loading}
						<span class="loading loading-sm loading-spinner"></span>
						Fetching...
					{:else}
						Fetch Profile
					{/if}
				</button>
			</div>
			{#if error}
				<div class="mt-2 alert alert-error">
					<span>{error}</span>
				</div>
			{/if}
		</div>
	</div>

	<!-- Contact Form -->
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<form {...create_contact} class="space-y-4">
				<!-- Hidden field for social links -->
				<input
					type="hidden"
					name="social_links"
					value={JSON.stringify(pending_social_links)}
				/>
				<!-- Name & VIP - Two Column Grid -->
				<div class="grid items-end gap-4 md:grid-cols-2">
					<fieldset class="fieldset">
						<legend class="fieldset-legend">Name *</legend>
						<label class="validator input w-full">
							<input
								type="text"
								name="name"
								placeholder="John Doe"
								class="grow"
								required
								bind:value={name}
							/>
						</label>
					</fieldset>

					<div class="form-control pb-2">
						<label class="label cursor-pointer justify-start gap-2">
							<input
								type="checkbox"
								name="is_vip"
								class="checkbox"
								bind:checked={is_vip}
							/>
							<span class="label-text">Mark as VIP</span>
						</label>
					</div>
				</div>

				<!-- Email & Phone - Two Column Grid -->
				<div class="grid gap-4 md:grid-cols-2">
					<fieldset class="fieldset">
						<legend class="fieldset-legend">Email</legend>
						<label class="validator input w-full">
							<input
								type="email"
								name="email"
								placeholder="Email"
								class="grow"
								bind:value={email}
							/>
						</label>
					</fieldset>

					<fieldset class="fieldset">
						<legend class="fieldset-legend">Phone</legend>
						<label class="input w-full">
							<input
								type="tel"
								name="phone"
								placeholder="+1 (555) 123-4567"
								class="grow"
								bind:value={phone}
							/>
						</label>
					</fieldset>
				</div>

				<!-- Company & Title - Two Column Grid -->
				<div class="grid gap-4 md:grid-cols-2">
					<fieldset class="fieldset">
						<legend class="fieldset-legend">Company</legend>
						<label class="input w-full">
							<input
								type="text"
								name="company"
								placeholder="Acme Inc."
								class="grow"
								bind:value={company}
							/>
						</label>
					</fieldset>

					<fieldset class="fieldset">
						<legend class="fieldset-legend">Title</legend>
						<label class="input w-full">
							<input
								type="text"
								name="title"
								placeholder="Senior Developer"
								class="grow"
								bind:value={title}
							/>
						</label>
					</fieldset>
				</div>

				<!-- GitHub Username & Birthday - Two Column Grid -->
				<div class="grid gap-4 md:grid-cols-2">
					<fieldset class="fieldset">
						<legend class="fieldset-legend">GitHub Username</legend>
						<label class="input w-full">
							<input
								type="text"
								name="github_username"
								placeholder="octocat"
								class="grow"
								bind:value={github_username}
							/>
						</label>
						<p class="label">Enter username without @</p>
					</fieldset>

					<fieldset class="fieldset">
						<legend class="fieldset-legend">Birthday</legend>
						<label class="input w-full">
							<input
								type="date"
								name="birthday"
								class="grow"
								bind:value={birthday}
							/>
						</label>
					</fieldset>
				</div>

				<!-- Social Links from GitHub Import -->
				{#if pending_social_links.length > 0}
					<div class="rounded-lg bg-base-200 p-4">
						<p class="mb-3 text-sm font-medium">
							Social Links (from GitHub)
						</p>
						<div class="space-y-2">
							{#each pending_social_links as link, i}
								<div class="flex items-center justify-between gap-2">
									<div class="flex items-center gap-2">
										{#if link.platform === 'twitter'}
											𝕏
										{:else if link.platform === 'bluesky'}
											🦋
										{:else if link.platform === 'linkedin'}
											in
										{:else if link.platform === 'website'}
											🌐
										{:else}
											🔗
										{/if}
										<span class="text-sm font-medium">
											{link.platform}:
										</span>
										<a
											href={link.url}
											target="_blank"
											rel="noopener noreferrer"
											class="link link-primary text-sm"
										>
											{link.url}
										</a>
									</div>
									<button
										type="button"
										onclick={() => remove_social_link(i)}
										class="btn btn-ghost btn-xs"
									>
										Remove
									</button>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Notes - Full Width -->
				<fieldset class="fieldset">
					<legend class="fieldset-legend">Notes</legend>
					<textarea
						name="notes"
						class="textarea w-full"
						rows="4"
						placeholder="Additional notes about this contact..."
						bind:value={notes}
					></textarea>
				</fieldset>

				<!-- Submit Button -->
				<div class="flex gap-4">
					<button class="btn flex-1 btn-primary" type="submit">
						Create Contact
					</button>
					<a href="/contacts" class="btn btn-ghost">Cancel</a>
				</div>
			</form>
		</div>
	</div>
</div>
