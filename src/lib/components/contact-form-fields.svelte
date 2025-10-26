<script lang="ts">
	import {
		Checkbox,
		Field,
		Input,
		Textarea,
	} from '$lib/components/ui';

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
	<Field legend="Name *">
		<Input
			type="text"
			name="name"
			value={name}
			placeholder="John Doe"
			required
			validator
		/>
	</Field>

	<div class="pb-2">
		<Checkbox name="is_vip" checked={is_vip} label="Mark as VIP" />
	</div>
</div>

<!-- Email & Phone - Two Column Grid -->
<div class="grid gap-4 md:grid-cols-2">
	<Field legend="Email">
		<Input
			type="email"
			name="email"
			value={email}
			placeholder="Email"
			validator
		/>
	</Field>

	<Field legend="Phone">
		<Input
			type="tel"
			name="phone"
			value={phone}
			placeholder="+1 (555) 123-4567"
		/>
	</Field>
</div>

<!-- Company & Title - Two Column Grid -->
<div class="grid gap-4 md:grid-cols-2">
	<Field legend="Company">
		<Input
			type="text"
			name="company"
			value={company}
			placeholder="Acme Inc."
		/>
	</Field>

	<Field legend="Title">
		<Input
			type="text"
			name="title"
			value={title}
			placeholder="Senior Developer"
		/>
	</Field>
</div>

<!-- GitHub Username & Birthday - Two Column Grid -->
<div class="grid gap-4 md:grid-cols-2">
	<Field
		legend="GitHub Username"
		helper_text="Enter username without @"
	>
		<Input
			type="text"
			name="github_username"
			value={github_username}
			placeholder="octocat"
		/>
	</Field>

	<Field legend="Birthday">
		<Input type="date" name="birthday" value={birthday} />
	</Field>
</div>

<!-- Notes - Full Width -->
<Field legend="Notes">
	<Textarea
		name="notes"
		value={notes}
		placeholder="Additional notes about this contact..."
	/>
</Field>
