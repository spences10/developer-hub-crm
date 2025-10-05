<script lang="ts">
	import EmptyState from '$lib/components/empty-state.svelte';
	import FilterTabs from '$lib/components/filter-tabs.svelte';
	import ItemCount from '$lib/components/item-count.svelte';
	import PageHeaderWithAction from '$lib/components/page-header-with-action.svelte';
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
	<PageHeaderWithAction title="Interactions">
		<a href="/interactions/new" class="btn btn-primary">
			New Interaction
		</a>
	</PageHeaderWithAction>

	<!-- Filter Tabs -->
	<FilterTabs
		options={interaction_types}
		active_filter={filter}
		on_filter_change={(f) => (filter = f)}
	/>

	<!-- Interactions List -->
	{#await Promise.all( [get_all_interactions(), get_user_preferences()], ) then [all_interactions, preferences]}
		{@const interactions =
			filter === 'all'
				? all_interactions
				: all_interactions.filter((i) => i.type === filter)}

		{#if interactions.length === 0}
			<EmptyState
				message={filter === 'all'
					? 'No interactions yet.'
					: `No ${filter} interactions found.`}
				action_href={filter === 'all'
					? '/interactions/new'
					: undefined}
				action_text={filter === 'all'
					? 'Log Your First Interaction'
					: undefined}
			/>
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

			<ItemCount
				count={interactions.length}
				item_name="interaction"
			/>
		{/if}
	{/await}
</div>
