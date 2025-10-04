<script lang="ts">
	import { format_date } from '$lib/utils/date-helpers';
	import { get_user_preferences } from '../settings/settings.remote';
	import { get_all_interactions } from './interactions.remote';

	let filter = $state<
		'all' | 'meeting' | 'call' | 'email' | 'message'
	>('all');

	const interaction_types = [
		'all',
		'meeting',
		'call',
		'email',
		'message',
	] as const;

	const type_badges: Record<string, string> = {
		meeting: 'badge-primary',
		call: 'badge-secondary',
		email: 'badge-accent',
		message: 'badge-info',
	};
</script>

<div class="mx-auto max-w-6xl">
	<div class="mb-8 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Interactions</h1>
		<a href="/interactions/new" class="btn btn-primary">
			New Interaction
		</a>
	</div>

	<!-- Filter Tabs -->
	<div class="tabs-boxed mb-6 tabs">
		{#each interaction_types as type}
			<button
				class="tab"
				class:tab-active={filter === type}
				onclick={() => (filter = type)}
			>
				{type.charAt(0).toUpperCase() + type.slice(1)}
			</button>
		{/each}
	</div>

	<!-- Interactions List -->
	{#await Promise.all( [get_all_interactions(), get_user_preferences()], ) then [all_interactions, preferences]}
		{@const interactions =
			filter === 'all'
				? all_interactions
				: all_interactions.filter((i) => i.type === filter)}

		{#if interactions.length === 0}
			<div class="py-12 text-center">
				<p class="text-lg opacity-70">
					{filter === 'all'
						? 'No interactions yet.'
						: `No ${filter} interactions found.`}
				</p>
				{#if filter === 'all'}
					<a href="/interactions/new" class="btn mt-4 btn-primary">
						Log Your First Interaction
					</a>
				{/if}
			</div>
		{:else}
			<div class="space-y-4">
				{#each interactions as interaction}
					<div class="card bg-base-100 shadow-md">
						<div class="card-body">
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<div class="mb-2 flex items-center gap-3">
										<a
											href="/contacts/{interaction.contact_id}"
											class="link text-lg font-semibold link-hover"
										>
											{interaction.contact_name}
										</a>
										<span
											class="badge {type_badges[interaction.type]}"
										>
											{interaction.type}
										</span>
									</div>
									{#if interaction.note}
										<p class="whitespace-pre-wrap opacity-80">
											{interaction.note}
										</p>
									{/if}
									<p class="mt-2 text-sm opacity-60">
										{format_date(
											new Date(interaction.created_at),
											preferences.date_format,
										)}
									</p>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<div class="mt-6 text-sm opacity-70">
				Showing {interactions.length} interaction{interactions.length !==
				1
					? 's'
					: ''}
			</div>
		{/if}
	{/await}
</div>
