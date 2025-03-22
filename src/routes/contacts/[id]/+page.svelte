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
</script>

<div class="bg-base-200 min-h-screen p-4">
	<!-- Navigation -->
	<div class="navbar bg-base-100 rounded-box mb-6 shadow-md">
		<div class="flex-1">
			<a href="/contacts" class="btn btn-ghost">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					/>
				</svg>
				Back to Contacts
			</a>
		</div>
	</div>

	<!-- Main content -->
	<div class="container mx-auto">
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<div class="flex items-center justify-between">
					<h2 class="card-title text-3xl">
						{contact.name}
						{#if contact.vip}
							<div class="badge badge-primary">VIP</div>
						{/if}
					</h2>
					<a
						href="/contacts?edit={contact.id}"
						class="btn btn-primary">Edit Contact</a
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
							{format_date(contact.lastContacted)}
						</div>
					</div>
					<div class="stat bg-base-200 rounded-box">
						<div class="stat-title">Last Update</div>
						<div class="stat-value text-lg">
							{format_date(contact.lastUpdate)}
						</div>
					</div>
				</div>

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
						{#if contact.background.likesDislikes || contact.background.miscNotes}
							<div class="mt-4">
								{#if contact.background.likesDislikes}
									<div class="mb-4">
										<h3 class="font-bold">Likes & Dislikes</h3>
										<p class="whitespace-pre-line">
											{contact.background.likesDislikes}
										</p>
									</div>
								{/if}
								{#if contact.background.miscNotes}
									<div>
										<h3 class="font-bold">Additional Notes</h3>
										<p class="whitespace-pre-line">
											{contact.background.miscNotes}
										</p>
									</div>
								{/if}
							</div>
						{/if}
					{/if}

					{#if contact.contactInfo}
						<div class="divider">Contact Information</div>
						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div class="stat bg-base-200 rounded-box">
								<div class="stat-title">Preferred App</div>
								<div class="stat-value text-lg">
									{contact.contactInfo.mainApp || 'Not specified'}
								</div>
							</div>
							<div class="stat bg-base-200 rounded-box">
								<div class="stat-title">Email</div>
								<div class="stat-value text-lg">
									{#if contact.contactInfo.email}
										<a
											href="mailto:{contact.contactInfo.email}"
											class="link-primary"
											>{contact.contactInfo.email}</a
										>
									{:else}
										Not specified
									{/if}
								</div>
							</div>
							<div class="stat bg-base-200 rounded-box">
								<div class="stat-title">Phone</div>
								<div class="stat-value text-lg">
									{#if contact.contactInfo.phoneNumber}
										<a
											href="tel:{contact.contactInfo.phoneNumber}"
											class="link-primary"
											>{contact.contactInfo.phoneNumber}</a
										>
									{:else}
										Not specified
									{/if}
								</div>
							</div>
							{#if contact.contactInfo.socialLinks}
								<div class="stat bg-base-200 rounded-box">
									<div class="stat-title">Social Links</div>
									<div class="stat-value text-lg">
										{#each Object.entries(parse_social_links(contact.contactInfo.socialLinks)) as [platform, url]}
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

				<!-- Interactions -->
				<div class="divider">Recent Interactions</div>
				{#if contact.interactions && contact.interactions.length > 0}
					<div class="overflow-x-auto">
						<table class="table-zebra table w-full">
							<thead>
								<tr>
									<th>Date</th>
									<th>Type</th>
									<th>Notes</th>
								</tr>
							</thead>
							<tbody>
								{#each contact.interactions as interaction}
									<tr>
										<td>{format_date(interaction.date)}</td>
										<td>{interaction.type}</td>
										<td>{interaction.notes || ''}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:else}
					<div class="alert">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							class="stroke-info h-6 w-6 shrink-0"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>No interactions recorded yet.</span>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
