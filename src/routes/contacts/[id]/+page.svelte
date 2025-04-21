<script lang="ts">
	import { format, fromUnixTime, isValid } from 'date-fns';
	import type { PageData } from './$types';

	const { data } = $props<{ data: PageData }>();
	const contact = $state(data.contact);

	// Type for social links
	interface SocialLinks {
		[key: string]: string;
	}

	// Format timestamp to readable date
	function format_date(timestamp: number | null) {
		if (!timestamp) return 'Not set';
		// Convert from milliseconds to seconds for fromUnixTime
		const date = fromUnixTime(Math.floor(timestamp / 1000));
		if (!isValid(date)) return 'Invalid date';
		return format(date, 'dd MMM yyyy');
	}

	// Parse social links safely
	function parse_social_links(links: string | null): SocialLinks {
		if (!links) return {};
		try {
			const parsed = JSON.parse(links);
			return typeof parsed === 'object' && parsed !== null
				? parsed
				: {};
		} catch {
			return {};
		}
	}

	// New interaction form state
	let show_interaction_form = $state(false);
	let new_interaction = $state({
		type: '',
		date: new Date().toISOString().split('T')[0],
		notes: '',
	});

	// Reset interaction form
	function reset_interaction_form() {
		new_interaction = {
			type: '',
			date: new Date().toISOString().split('T')[0],
			notes: '',
		};
		show_interaction_form = false;
	}
</script>

<div class="bg-base-200 min-h-screen">
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<div class="flex items-center justify-between">
				<h2 class="card-title text-3xl">
					{contact.name}
					{#if contact.vip}
						<div class="badge badge-primary">VIP</div>
					{/if}
				</h2>
				<a href="/contacts?edit={contact.id}" class="btn btn-primary"
					>Edit Contact</a
				>
			</div>

			<!-- Basic Information -->
			<div class="divider">Basic Information</div>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div class="stat bg-base-200 rounded-box">
					<div class="stat-title">Relationship</div>
					<div class="stat-value text-lg">
						{contact.relationship || 'Not specified'}
					</div>
				</div>
				<div class="stat bg-base-200 rounded-box">
					<div class="stat-title">Industry</div>
					<div class="stat-value text-lg">
						{contact.industry || 'Not specified'}
					</div>
				</div>
				<div class="stat bg-base-200 rounded-box">
					<div class="stat-title">Location</div>
					<div class="stat-value text-lg">
						{contact.location || 'Not specified'}
					</div>
				</div>
				<div class="stat bg-base-200 rounded-box">
					<div class="stat-title">Status</div>
					<div class="stat-value text-lg">{contact.status}</div>
				</div>
			</div>

			<!-- Dates -->
			<div class="divider">Important Dates</div>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				<div class="stat bg-base-200 rounded-box">
					<div class="stat-title">Birthday</div>
					<div class="stat-value text-lg">
						{format_date(contact.birthday)}
					</div>
				</div>
				<div class="stat bg-base-200 rounded-box">
					<div class="stat-title">Last Contacted</div>
					<div class="stat-value text-lg">
						{format_date(contact.last_contacted)}
					</div>
				</div>
				<div class="stat bg-base-200 rounded-box">
					<div class="stat-title">Last Update</div>
					<div class="stat-value text-lg">
						{format_date(contact.last_update)}
					</div>
				</div>
			</div>

			<!-- Interactions Section -->
			<div class="divider">Interactions</div>
			<div class="mb-4 flex items-center justify-between">
				<h3 class="text-xl font-semibold">Recent Interactions</h3>
				<button
					class="btn btn-primary"
					onclick={() => (show_interaction_form = true)}
				>
					Add Interaction
				</button>
			</div>

			{#if show_interaction_form}
				<form
					method="POST"
					action="?/add_interaction"
					class="card bg-base-200 mb-4 p-4"
				>
					<div class="form-control">
						<label class="label" for="type">
							<span class="label-text">Type</span>
						</label>
						<select
							name="type"
							id="type"
							class="select select-bordered w-full"
							bind:value={new_interaction.type}
							required
						>
							<option value="">Select type</option>
							<option value="Meeting">Meeting</option>
							<option value="Call">Call</option>
							<option value="Email">Email</option>
							<option value="Message">Message</option>
							<option value="Other">Other</option>
						</select>
					</div>

					<div class="form-control">
						<label class="label" for="date">
							<span class="label-text">Date</span>
						</label>
						<input
							type="date"
							name="date"
							id="date"
							class="input input-bordered"
							bind:value={new_interaction.date}
							required
						/>
					</div>

					<div class="form-control">
						<label class="label" for="notes">
							<span class="label-text">Notes</span>
						</label>
						<textarea
							name="notes"
							id="notes"
							class="textarea textarea-bordered h-24"
							bind:value={new_interaction.notes}
						></textarea>
					</div>

					<div class="form-control mt-4">
						<div class="flex gap-2">
							<button type="submit" class="btn btn-primary flex-1"
								>Save</button
							>
							<button
								type="button"
								class="btn btn-ghost"
								onclick={reset_interaction_form}
							>
								Cancel
							</button>
						</div>
					</div>
				</form>
			{/if}

			{#if contact.interactions && contact.interactions.length > 0}
				<div class="overflow-x-auto">
					<table class="table w-full">
						<thead>
							<tr>
								<th>Type</th>
								<th>Date</th>
								<th>Notes</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{#each contact.interactions as interaction}
								<tr>
									<td>{interaction.type}</td>
									<td>{format_date(interaction.date)}</td>
									<td class="whitespace-pre-wrap">
										{interaction.notes || '-'}
									</td>
									<td>
										<form
											method="POST"
											action="?/delete_interaction"
											class="inline"
										>
											<input
												type="hidden"
												name="id"
												value={interaction.id}
											/>
											<button
												type="submit"
												class="btn btn-ghost btn-sm text-error"
											>
												Delete
											</button>
										</form>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<div class="alert">
					<span>No interactions recorded yet.</span>
				</div>
			{/if}

			{#if contact.vip}
				<!-- VIP Information -->
				<div class="divider">VIP Information</div>
				{#if contact.background}
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div class="stat bg-base-200 rounded-box">
							<div class="stat-title">Family</div>
							<div class="stat-value text-lg">
								{contact.background.family || 'Not specified'}
							</div>
						</div>
						<div class="stat bg-base-200 rounded-box">
							<div class="stat-title">Company</div>
							<div class="stat-value text-lg">
								{contact.background.company || 'Not specified'}
							</div>
						</div>
					</div>
					{#if contact.background.likes_dislikes || contact.background.misc_notes}
						<div class="mt-4">
							{#if contact.background.likes_dislikes}
								<div class="mb-4">
									<h3 class="font-bold">Likes & Dislikes</h3>
									<p class="whitespace-pre-line">
										{contact.background.likes_dislikes}
									</p>
								</div>
							{/if}
							{#if contact.background.misc_notes}
								<div>
									<h3 class="font-bold">Additional Notes</h3>
									<p class="whitespace-pre-line">
										{contact.background.misc_notes}
									</p>
								</div>
							{/if}
						</div>
					{/if}
				{/if}

				{#if contact.contact_info}
					<div class="divider">Contact Information</div>
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div class="stat bg-base-200 rounded-box">
							<div class="stat-title">Preferred App</div>
							<div class="stat-value text-lg">
								{contact.contact_info.main_app || 'Not specified'}
							</div>
						</div>
						<div class="stat bg-base-200 rounded-box">
							<div class="stat-title">Email</div>
							<div class="stat-value text-lg">
								{#if contact.contact_info.email}
									<a
										href="mailto:{contact.contact_info.email}"
										class="link-primary"
										>{contact.contact_info.email}</a
									>
								{:else}
									Not specified
								{/if}
							</div>
						</div>
						<div class="stat bg-base-200 rounded-box">
							<div class="stat-title">Phone</div>
							<div class="stat-value text-lg">
								{#if contact.contact_info.phone_number}
									<a
										href="tel:{contact.contact_info.phone_number}"
										class="link-primary"
										>{contact.contact_info.phone_number}</a
									>
								{:else}
									Not specified
								{/if}
							</div>
						</div>
						{#if contact.contact_info.social_links}
							<div class="stat bg-base-200 rounded-box">
								<div class="stat-title">Social Links</div>
								<div class="stat-value text-lg">
									{#each Object.entries(parse_social_links(contact.contact_info.social_links)) as [platform, url]}
										<a
											href={url}
											target="_blank"
											rel="noopener noreferrer"
											class="link-primary block">{platform}</a
										>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				{/if}
			{/if}
		</div>
	</div>
</div>
