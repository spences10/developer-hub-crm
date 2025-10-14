<script lang="ts">
	type Props = {
		name?: string;
		email?: string;
		phone?: string;
		company?: string;
		title?: string;
		github_username?: string;
		is_vip?: boolean;
		birthday?: string;
		notes?: string;
	};

	let {
		name = '',
		email = '',
		phone = '',
		company = '',
		title = '',
		github_username = '',
		is_vip = false,
		birthday = '',
		notes = '',
	}: Props = $props();
</script>

<!-- Name & VIP - Two Column Grid -->
<div class="grid items-end gap-4 md:grid-cols-2">
	<fieldset class="fieldset">
		<legend class="fieldset-legend">Name *</legend>
		<label class="validator input w-full">
			<input
				type="text"
				name="name"
				value={name}
				placeholder="John Doe"
				class="grow"
				required
			/>
		</label>
	</fieldset>

	<div class="pb-2">
		<label class="flex cursor-pointer items-center gap-2">
			<input
				type="checkbox"
				name="is_vip"
				checked={is_vip}
				class="checkbox"
			/>
			<span>Mark as VIP</span>
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
				value={email}
				placeholder="Email"
				class="grow"
			/>
		</label>
	</fieldset>

	<fieldset class="fieldset">
		<legend class="fieldset-legend">Phone</legend>
		<label class="input w-full">
			<input
				type="tel"
				name="phone"
				value={phone}
				placeholder="+1 (555) 123-4567"
				class="grow"
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
				value={company}
				placeholder="Acme Inc."
				class="grow"
			/>
		</label>
	</fieldset>

	<fieldset class="fieldset">
		<legend class="fieldset-legend">Title</legend>
		<label class="input w-full">
			<input
				type="text"
				name="title"
				value={title}
				placeholder="Senior Developer"
				class="grow"
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
				value={github_username}
				placeholder="octocat"
				class="grow"
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
				value={birthday}
				class="grow"
			/>
		</label>
	</fieldset>
</div>

<!-- Notes - Full Width -->
<fieldset class="fieldset">
	<legend class="fieldset-legend">Notes</legend>
	<textarea
		name="notes"
		class="textarea w-full"
		rows="4"
		placeholder="Additional notes about this contact..."
		value={notes}
	></textarea>
</fieldset>
