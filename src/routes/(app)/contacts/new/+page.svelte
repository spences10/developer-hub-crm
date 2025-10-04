<script lang="ts">
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

				// Clear GitHub input on success
				github_input = '';
			}
		} catch (e) {
			error = 'Failed to fetch GitHub profile';
		} finally {
			loading = false;
		}
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
				<!-- Name (Required) -->
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

				<!-- Email -->
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

				<!-- Phone -->
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

				<!-- Company -->
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

				<!-- Title -->
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

				<!-- GitHub Username -->
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

				<!-- VIP Checkbox -->
				<div class="form-control">
					<label class="label cursor-pointer justify-start gap-4">
						<input
							type="checkbox"
							name="is_vip"
							class="checkbox"
							bind:checked={is_vip}
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
							class="grow"
							bind:value={birthday}
						/>
					</label>
				</fieldset>

				<!-- Notes -->
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
