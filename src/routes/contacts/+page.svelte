<script lang="ts">
	type Contact = {
		contact_id: number
		name: string
		relationship: string | null
		birthday: Date | null
		industry: string | null
		location: string | null
		vip: number | null
		last_update: Date | null
		last_contacted: Date | null
		status: string | null
	}

	type LoadOutput = {
		body: {
			all_contacts: Contact[]
		}
	}

	export let data: LoadOutput

	const { all_contacts } = data.body
</script>

<h1>Contacts</h1>

<ul>
	{#each all_contacts as contact}
		<li>{contact.name} - {contact.relationship} {contact.birthday}</li>
	{/each}
</ul>
