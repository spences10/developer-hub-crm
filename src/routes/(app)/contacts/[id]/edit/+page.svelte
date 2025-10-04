<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import {
		add_social_link,
		delete_social_link,
		get_contact,
		update_contact,
	} from '../../contacts.remote';

	const contact_id = $derived(page.params.id);

	let error = $state<string | null>(null);
	let submitting = $state(false);

	// Reactive key to trigger re-fetch after social link changes
	let refresh_key = $state(0);

	// New social link state
	let new_platform = $state('');
	let new_url = $state('');
	let adding_link = $state(false);

	async function handle_add_social_link() {
		if (!contact_id || !new_platform || !new_url) return;

		adding_link = true;
		try {
			await add_social_link({
				contact_id,
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
			await delete_social_link(link_id);
			refresh_key++;
		} catch (err) {
			console.error('Failed to delete social link:', err);
		}
	}

	async function handle_submit(event: SubmitEvent) {
		event.preventDefault();
		submitting = true;
		error = null;

		if (!contact_id) {
			error = 'Contact ID is required';
			submitting = false;
			return;
		}

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		try {
			await update_contact({
				id: contact_id,
				name: formData.get('name') as string,
				email: (formData.get('email') as string) || undefined,
				phone: (formData.get('phone') as string) || undefined,
				company: (formData.get('company') as string) || undefined,
				title: (formData.get('title') as string) || undefined,
				github_username:
					(formData.get('github_username') as string) || undefined,
				is_vip: formData.get('is_vip') === 'on',
				birthday: (formData.get('birthday') as string) || undefined,
				notes: (formData.get('notes') as string) || undefined,
			});

			goto(`/contacts/${contact_id}`);
		} catch (err: any) {
			error = err.message || 'Failed to update contact';
		} finally {
			submitting = false;
		}
	}
</script>

<div class="mx-auto max-w-2xl">
	<div class="mb-8">
		<a href="/contacts/{contact_id}" class="link link-hover">
			&larr; Back to Contact
		</a>
		<h1 class="mt-4 text-3xl font-bold">Edit Contact</h1>
	</div>

	{#if contact_id}
		{#key refresh_key}
			{#await get_contact(contact_id) then contact}
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<form onsubmit={handle_submit} class="space-y-4">
						<!-- Name (Required) -->
						<fieldset class="fieldset">
							<legend class="fieldset-legend">Name *</legend>
							<label class="validator input w-full">
								<input
									type="text"
									name="name"
									value={contact.name}
									placeholder="John Doe"
									class="grow"
									required
								/>
							</label>
						</fieldset>

						<!-- Email -->
						<fieldset class="fieldset">
							<legend class="fieldset-legend">Email</legend>
							<label class="validator input w-full">
								<input
									type="email"
									name="email"
									value={contact.email || ''}
									placeholder="Email"
									class="grow"
								/>
							</label>
						</fieldset>

						<!-- Phone -->
						<fieldset class="fieldset">
							<legend class="fieldset-legend">Phone</legend>
							<label class="input w-full">
								<input
									type="tel"
									name="phone"
									value={contact.phone || ''}
									placeholder="+1 (555) 123-4567"
									class="grow"
								/>
							</label>
						</fieldset>

						<!-- Company -->
						<fieldset class="fieldset">
							<legend class="fieldset-legend">Company</legend>
							<label class="input w-full">
								<input
									type="text"
									name="company"
									value={contact.company || ''}
									placeholder="Acme Inc."
									class="grow"
								/>
							</label>
						</fieldset>

						<!-- Title -->
						<fieldset class="fieldset">
							<legend class="fieldset-legend">Title</legend>
							<label class="input w-full">
								<input
									type="text"
									name="title"
									value={contact.title || ''}
									placeholder="Senior Developer"
									class="grow"
								/>
							</label>
						</fieldset>

						<!-- GitHub Username -->
						<fieldset class="fieldset">
							<legend class="fieldset-legend">GitHub Username</legend>
							<label class="input w-full">
								<input
									type="text"
									name="github_username"
									value={contact.github_username || ''}
									placeholder="octocat"
									class="grow"
								/>
							</label>
							<p class="label">Enter username without @</p>
						</fieldset>

						<!-- VIP Checkbox -->
						<div class="form-control">
							<label class="label cursor-pointer justify-start gap-4">
								<input
									type="checkbox"
									name="is_vip"
									checked={contact.is_vip === 1}
									class="checkbox"
								/>
								<span class="label-text">Mark as VIP</span>
							</label>
						</div>

						<!-- Birthday -->
						<fieldset class="fieldset">
							<legend class="fieldset-legend">Birthday</legend>
							<label class="input w-full">
								<input
									type="date"
									name="birthday"
									value={contact.birthday || ''}
									class="grow"
								/>
							</label>
						</fieldset>

						<!-- Social Links Management -->
						<div class="rounded-lg bg-base-200 p-4">
							<p class="mb-3 text-sm font-medium">Social Links</p>

							<!-- Existing Social Links -->
							{#if contact.social_links && contact.social_links.length > 0}
								<div class="mb-4 space-y-2">
									{#each contact.social_links as link}
										<div
											class="flex items-center justify-between gap-2"
										>
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

							<!-- Add New Social Link -->
							<div class="space-y-2">
								<p class="text-xs opacity-70">Add new social link</p>
								<div class="flex gap-2">
									<select
										bind:value={new_platform}
										class="select select-sm select-bordered"
									>
										<option value="">Select platform</option>
										<option value="twitter">Twitter/X</option>
										<option value="bluesky">Bluesky</option>
										<option value="linkedin">LinkedIn</option>
										<option value="website">Website</option>
									</select>
									<input
										type="url"
										placeholder="URL"
										bind:value={new_url}
										class="input input-sm input-bordered flex-1"
									/>
									<button
										type="button"
										onclick={handle_add_social_link}
										disabled={adding_link ||
											!new_platform ||
											!new_url}
										class="btn btn-primary btn-sm"
									>
										{#if adding_link}
											<span
												class="loading loading-sm loading-spinner"
											></span>
										{:else}
											Add
										{/if}
									</button>
								</div>
							</div>
						</div>

						<!-- Notes -->
						<fieldset class="fieldset">
							<legend class="fieldset-legend">Notes</legend>
							<textarea
								name="notes"
								class="textarea w-full"
								rows="4"
								placeholder="Additional notes about this contact..."
								value={contact.notes || ''}
							></textarea>
						</fieldset>

						<!-- Error Display -->
						{#if error}
							<div class="alert alert-error">
								<span>{error}</span>
							</div>
						{/if}

						<!-- Submit Button -->
						<div class="flex gap-4">
							<button
								class="btn flex-1 btn-primary"
								type="submit"
								disabled={submitting}
							>
								{submitting ? 'Saving...' : 'Save Changes'}
							</button>
							<a href="/contacts/{contact_id}" class="btn btn-ghost">
								Cancel
							</a>
						</div>
					</form>
				</div>
			</div>
			{/await}
		{/key}
	{/if}
</div>
