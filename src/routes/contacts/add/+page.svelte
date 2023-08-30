<script lang="ts">
	import { enhance } from '$app/forms'

	export let data
	export let form

	$: submission_status = form?.success
</script>

<h1>Add a contact</h1>

<pre>{JSON.stringify(submission_status, null, 2)}</pre>

<pre>{JSON.stringify(data, null, 2)}</pre>

<form
	action="?/add_contact"
	method="POST"
	use:enhance
	class="w-full pt-5"
>
	<div class="form-control w-full max-w-md">
		<label for="name">Name</label>
		<input
			type="text"
			id="name"
			name="name"
			placeholder="Enter contact name"
			class="input-bordered"
			value="Default Name"
		/>
	</div>
	<div class="form-control w-full max-w-md">
		<label for="relationship">Relationship</label>
		<input
			type="text"
			id="relationship"
			name="relationship"
			placeholder="Enter relationship type"
			class="input-bordered"
			value="Default Relationship"
		/>
	</div>
	<div class="form-control w-full max-w-md">
		<label for="industry">Industry</label>
		<input
			type="text"
			id="industry"
			name="industry"
			placeholder="Industry"
			class="input-bordered"
			value="Default Industry"
		/>
	</div>
	<div class="form-control w-full max-w-md">
		<label for="birthday">Birthday</label>
		<input
			type="date"
			id="birthday"
			name="birthday"
			placeholder="Birthday"
			class="input-bordered"
			value="2000-01-01"
		/>
	</div>
	<div class="form-control w-full max-w-md">
		<label for="location">Location</label>
		<input
			type="text"
			id="location"
			name="location"
			placeholder="Location"
			class="input-bordered"
			value="Default Location"
		/>
	</div>
	<div class="form-control w-full max-w-md">
		<label for="vip">VIP</label>
		<input
			type="checkbox"
			id="vip"
			name="vip"
			class="input-bordered"
			checked
		/>
	</div>
	<div class="form-control w-full max-w-md">
		<label for="last_update">Last Update</label>
		<input
			type="date"
			id="last_update"
			name="last_update"
			placeholder="Last Update"
			class="input-bordered"
			value="2023-08-27"
		/>
	</div>
	<div class="form-control w-full max-w-md">
		<label for="last_contacted">Last Contacted</label>
		<input
			type="date"
			id="last_contacted"
			name="last_contacted"
			placeholder="Last Contacted"
			class="input-bordered"
			value="2023-08-26"
		/>
	</div>
	<div class="form-control w-full max-w-md">
		<label for="status">Status</label>
		<input
			type="text"
			id="status"
			name="status"
			placeholder="Status"
			class="input-bordered"
			value="Default Status"
		/>
	</div>
	<div class="form-control w-full max-w-lg">
		<input
			type="submit"
			value="Add contact"
			class="btn btn-primary mt-6"
		/>
	</div>
</form>
