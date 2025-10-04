<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { get_contact, update_contact } from '../../contacts.remote';

	const contact_id = $derived(page.params.id);

	let error = $state<string | null>(null);
	let submitting = $state(false);

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
	{/if}
</div>
