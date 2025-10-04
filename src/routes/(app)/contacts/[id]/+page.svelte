<script lang="ts">
	import { page } from '$app/state';
	import {
		complete_follow_up,
		delete_follow_up,
		get_contact_follow_ups,
		reopen_follow_up,
	} from '../../follow-ups/follow-ups.remote';
	import { get_interactions } from '../../interactions/interactions.remote';
	import { delete_contact, get_contact } from '../contacts.remote';

	const contact_id = $derived(page.params.id);

	const type_badges: Record<string, string> = {
		meeting: 'badge-primary',
		call: 'badge-secondary',
		email: 'badge-accent',
		message: 'badge-info',
	};

	function format_due_date(timestamp: number): string {
		const date = new Date(timestamp);
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		const date_only = new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
		);
		const today_only = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate(),
		);
		const tomorrow_only = new Date(
			tomorrow.getFullYear(),
			tomorrow.getMonth(),
			tomorrow.getDate(),
		);

		if (date_only.getTime() === today_only.getTime()) {
			return 'Today';
		} else if (date_only.getTime() === tomorrow_only.getTime()) {
			return 'Tomorrow';
		} else if (date_only < today_only) {
			return `Overdue: ${date.toLocaleDateString()}`;
		} else {
			return date.toLocaleDateString();
		}
	}

	function is_overdue(timestamp: number): boolean {
		return timestamp < Date.now();
	}

	async function handle_delete() {
		if (confirm('Are you sure you want to delete this contact?')) {
			await delete_contact(contact_id);
		}
	}

	async function handle_complete_follow_up(id: string) {
		await complete_follow_up(id);
		// Force re-render by reassigning contact_id
		window.location.reload();
	}

	async function handle_reopen_follow_up(id: string) {
		await reopen_follow_up(id);
		window.location.reload();
	}

	async function handle_delete_follow_up(id: string) {
		if (confirm('Are you sure you want to delete this follow-up?')) {
			await delete_follow_up(id);
			window.location.reload();
		}
	}
</script>

<div class="mx-auto max-w-4xl">
	<div class="mb-8">
		<a href="/contacts" class="link link-hover">
			&larr; Back to Contacts
		</a>
	</div>

	{#if contact_id}
		{#await get_contact(contact_id) then contact}
			<div class="mb-6 flex items-start justify-between">
				<div>
					<h1 class="text-3xl font-bold">
						{contact.name}
						{#if contact.is_vip}
							<span class="ml-2 badge badge-primary">VIP</span>
						{/if}
					</h1>
				</div>
				<div class="flex gap-2">
					<a
						href="/contacts/{contact.id}/edit"
						class="btn btn-outline"
					>
						Edit
					</a>
					<button
						onclick={handle_delete}
						class="btn btn-outline btn-error"
					>
						Delete
					</button>
				</div>
			</div>

			<div class="grid gap-6 md:grid-cols-2">
				<!-- Contact Info Card -->
				<div class="card bg-base-100 shadow-xl">
					<div class="card-body">
						<h2 class="card-title">Contact Information</h2>
						<div class="space-y-3">
							{#if contact.email}
								<div>
									<p class="text-sm opacity-70">Email</p>
									<a
										href="mailto:{contact.email}"
										class="link link-primary"
									>
										{contact.email}
									</a>
								</div>
							{/if}

							{#if contact.phone}
								<div>
									<p class="text-sm opacity-70">Phone</p>
									<a
										href="tel:{contact.phone}"
										class="link link-primary"
									>
										{contact.phone}
									</a>
								</div>
							{/if}

							{#if contact.company}
								<div>
									<p class="text-sm opacity-70">Company</p>
									<p>{contact.company}</p>
								</div>
							{/if}

							{#if contact.title}
								<div>
									<p class="text-sm opacity-70">Title</p>
									<p>{contact.title}</p>
								</div>
							{/if}

							{#if contact.github_username}
								<div>
									<p class="text-sm opacity-70">GitHub</p>
									<a
										href="https://github.com/{contact.github_username}"
										target="_blank"
										rel="noopener noreferrer"
										class="link link-primary"
									>
										@{contact.github_username}
									</a>
								</div>
							{/if}

							{#if contact.birthday}
								<div>
									<p class="text-sm opacity-70">Birthday</p>
									<p>
										{new Date(contact.birthday).toLocaleDateString()}
									</p>
								</div>
							{/if}
						</div>
					</div>
				</div>

				<!-- Stats Card -->
				<div class="card bg-base-100 shadow-xl">
					<div class="card-body">
						<h2 class="card-title">Activity</h2>
						<div class="space-y-3">
							<div>
								<p class="text-sm opacity-70">Total Interactions</p>
								<p class="text-2xl font-bold">
									{contact.interaction_count}
								</p>
							</div>

							{#if contact.last_interaction_at}
								<div>
									<p class="text-sm opacity-70">Last Contact</p>
									<p>
										{new Date(
											contact.last_interaction_at,
										).toLocaleDateString()}
									</p>
								</div>
							{/if}

							<div>
								<p class="text-sm opacity-70">Pending Follow-ups</p>
								<p class="text-2xl font-bold">
									{contact.pending_follow_ups}
								</p>
							</div>

							{#if contact.last_contacted_at}
								<div>
									<p class="text-sm opacity-70">Last Contacted</p>
									<p>
										{new Date(
											contact.last_contacted_at,
										).toLocaleDateString()}
									</p>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<!-- Notes Card -->
			{#if contact.notes}
				<div class="card mt-6 bg-base-100 shadow-xl">
					<div class="card-body">
						<h2 class="card-title">Notes</h2>
						<p class="whitespace-pre-wrap">{contact.notes}</p>
					</div>
				</div>
			{/if}

			<!-- Follow-ups Section -->
			<div class="card mt-6 bg-base-100 shadow-xl">
				<div class="card-body">
					<div class="mb-4 flex items-center justify-between">
						<h2 class="card-title">Follow-ups</h2>
						<a
							href="/follow-ups/new?contact_id={contact.id}"
							class="btn btn-sm btn-primary"
						>
							Add Follow-up
						</a>
					</div>

					{#if contact_id}
						{#await get_contact_follow_ups(contact_id) then follow_ups}
							{@const pending_follow_ups = follow_ups.filter(
								(f) => !f.completed,
							)}
							{#if pending_follow_ups.length === 0}
								<p class="py-4 text-center opacity-70">
									No pending follow-ups.
								</p>
							{:else}
								<div class="space-y-3">
									{#each pending_follow_ups as follow_up}
										{@const overdue = is_overdue(follow_up.due_date)}
										<div class="rounded-lg bg-base-200 p-4">
											<div
												class="mb-2 flex items-center justify-between"
											>
												<div>
													<span
														class="text-sm font-medium"
														class:text-error={overdue}
													>
														{format_due_date(follow_up.due_date)}
													</span>
													{#if overdue}
														<span
															class="ml-2 badge badge-sm badge-error"
														>
															Overdue
														</span>
													{/if}
												</div>
												<div class="flex gap-2">
													<button
														onclick={() =>
															handle_complete_follow_up(follow_up.id)}
														class="btn btn-xs btn-success"
													>
														Complete
													</button>
													<button
														onclick={() =>
															handle_delete_follow_up(follow_up.id)}
														class="btn btn-outline btn-xs btn-error"
													>
														Delete
													</button>
												</div>
											</div>
											{#if follow_up.note}
												<p class="text-sm whitespace-pre-wrap">
													{follow_up.note}
												</p>
											{/if}
										</div>
									{/each}
								</div>

								{#if pending_follow_ups.length > 3}
									<div class="mt-4 text-center">
										<a href="/follow-ups" class="link link-primary">
											View all follow-ups
										</a>
									</div>
								{/if}
							{/if}
						{/await}
					{/if}
				</div>
			</div>

			<!-- Interactions Section -->
			<div class="card mt-6 bg-base-100 shadow-xl">
				<div class="card-body">
					<div class="mb-4 flex items-center justify-between">
						<h2 class="card-title">Interactions</h2>
						<a
							href="/interactions/new?contact_id={contact.id}"
							class="btn btn-sm btn-primary"
						>
							Log Interaction
						</a>
					</div>

					{#if contact_id}
						{#await get_interactions(contact_id) then interactions}
							{#if interactions.length === 0}
								<p class="py-4 text-center opacity-70">
									No interactions logged yet.
								</p>
							{:else}
								<div class="space-y-3">
									{#each interactions as interaction}
										<div class="rounded-lg bg-base-200 p-4">
											<div class="mb-2 flex items-center gap-2">
												<span
													class="badge {type_badges[
														interaction.type
													]}"
												>
													{interaction.type}
												</span>
												<span class="text-sm opacity-60">
													{new Date(
														interaction.created_at,
													).toLocaleDateString()}
												</span>
											</div>
											{#if interaction.note}
												<p class="text-sm whitespace-pre-wrap">
													{interaction.note}
												</p>
											{/if}
										</div>
									{/each}
								</div>

								{#if interactions.length > 5}
									<div class="mt-4 text-center">
										<a href="/interactions" class="link link-primary">
											View all interactions
										</a>
									</div>
								{/if}
							{/if}
						{/await}
					{/if}
				</div>
			</div>

			<!-- Metadata -->
			<div class="mt-6 text-sm opacity-50">
				<p>
					Created: {new Date(contact.created_at).toLocaleString()}
				</p>
				<p>
					Last updated: {new Date(
						contact.updated_at,
					).toLocaleString()}
				</p>
			</div>
		{/await}
	{/if}
</div>
