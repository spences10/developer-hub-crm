<script lang="ts">
	import { create_contact } from '../contacts.remote';
</script>

<div class="mx-auto max-w-2xl">
	<div class="mb-8">
		<a href="/contacts" class="link link-hover">
			&larr; Back to Contacts
		</a>
		<h1 class="mt-4 text-3xl font-bold">New Contact</h1>
	</div>

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
						/>
					</label>
					<p class="label">Enter username without @</p>
				</fieldset>

				<!-- VIP Checkbox -->
				<div class="form-control">
					<label class="label cursor-pointer justify-start gap-4">
						<input type="checkbox" name="is_vip" class="checkbox" />
						<span class="label-text">Mark as VIP</span>
					</label>
				</div>

				<!-- Birthday -->
				<fieldset class="fieldset">
					<legend class="fieldset-legend">Birthday</legend>
					<label class="input w-full">
						<input type="date" name="birthday" class="grow" />
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
					></textarea>
				</fieldset>

				<!-- Error Display -->
				<!-- TODO: Add error handling when form errors are available -->

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
