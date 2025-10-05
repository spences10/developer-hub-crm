<script lang="ts">
	import ContactFormFields from '$lib/components/contact-form-fields.svelte';
	import FormActions from '$lib/components/form-actions.svelte';
	import LoadingButton from '$lib/components/loading-button.svelte';
	import PageHeader from '$lib/components/page-header.svelte';
	import SocialLinksList from '$lib/components/social-links-list.svelte';
	import {
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

	function remove_social_link(id_or_index: string | number) {
		pending_social_links = pending_social_links.filter(
			(_, i) => i !== id_or_index,
		);
	}
</script>

<div class="mx-auto max-w-2xl">
	<PageHeader
		back_href="/contacts"
		back_text="Back to Contacts"
		title="New Contact"
	/>

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
				<LoadingButton
					{loading}
					disabled={!github_input.trim()}
					class_names="btn btn-primary"
					loading_text="Fetching..."
					onclick={handle_github_import}
				>
					Fetch Profile
				</LoadingButton>
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

				<ContactFormFields
					{name}
					{email}
					{phone}
					{company}
					{title}
					{github_username}
					{is_vip}
					{birthday}
					{notes}
				/>

				<SocialLinksList
					links={pending_social_links}
					editable
					on_remove={remove_social_link}
				/>

				<FormActions
					submit_text="Create Contact"
					cancel_href="/contacts"
				/>
			</form>
		</div>
	</div>
</div>
