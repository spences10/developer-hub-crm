<script lang="ts">
	import type { FollowUp } from '$lib/types/db';
	import {
		format_date,
		format_due_date,
		is_overdue,
	} from '$lib/utils/date-helpers';
	import { get_user_preferences } from '../settings/settings.remote';
	import {
		complete_follow_up,
		delete_follow_up,
		get_all_follow_ups,
		reopen_follow_up,
	} from './follow-ups.remote';

	let filter = $state<'all' | 'pending' | 'completed' | 'overdue'>(
		'all',
	);

	// Reactive key to trigger re-fetches after mutations
	let refresh_key = $state(0);

	const filter_options = [
		'all',
		'pending',
		'completed',
		'overdue',
	] as const;

	function filter_follow_ups(
		follow_ups: Array<FollowUp & { contact_name: string }>,
		filter_type: typeof filter,
	) {
		const now = Date.now();
		if (filter_type === 'pending') {
			return follow_ups.filter((f) => !f.completed);
		} else if (filter_type === 'completed') {
			return follow_ups.filter((f) => f.completed);
		} else if (filter_type === 'overdue') {
			return follow_ups.filter(
				(f) => !f.completed && f.due_date < now,
			);
		}
		return follow_ups;
	}

	async function handle_complete(id: string) {
		await complete_follow_up(id);
		refresh_key++;
	}

	async function handle_reopen(id: string) {
		await reopen_follow_up(id);
		refresh_key++;
	}

	async function handle_delete(id: string) {
		await delete_follow_up(id);
		refresh_key++;
	}
</script>

<div class="mx-auto max-w-6xl">
	<div class="mb-8 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Follow-ups</h1>
		<a href="/follow-ups/new" class="btn btn-primary">
			New Follow-up
		</a>
	</div>

	<!-- Filter Tabs -->
	<div class="tabs-boxed mb-6 tabs">
		{#each filter_options as option}
			<button
				class="tab"
				class:tab-active={filter === option}
				onclick={() => (filter = option)}
			>
				{option.charAt(0).toUpperCase() + option.slice(1)}
			</button>
		{/each}
	</div>

	<!-- Follow-ups List -->
	{#key refresh_key}
		{#await Promise.all( [get_all_follow_ups(), get_user_preferences()], ) then [all_follow_ups, preferences]}
			{@const follow_ups = filter_follow_ups(all_follow_ups, filter)}
			{#if follow_ups.length === 0}
				<div class="py-12 text-center">
					<p class="text-lg opacity-70">
						{filter === 'all'
							? 'No follow-ups yet.'
							: `No ${filter} follow-ups found.`}
					</p>
					{#if filter === 'all'}
						<a href="/follow-ups/new" class="btn mt-4 btn-primary">
							Create Your First Follow-up
						</a>
					{/if}
				</div>
			{:else}
				<div class="space-y-4">
					{#each follow_ups as follow_up}
						{@const overdue =
							!follow_up.completed && is_overdue(follow_up.due_date)}
						<div class="card bg-base-100 shadow-md">
							<div class="card-body">
								<div class="flex items-start justify-between gap-4">
									<div class="flex-1">
										<div class="mb-2 flex items-center gap-3">
											<a
												href="/contacts/{follow_up.contact_id}"
												class="link text-lg font-semibold link-hover"
											>
												{follow_up.contact_name}
											</a>
											{#if follow_up.completed}
												<span class="badge badge-success">
													Completed
												</span>
											{:else if overdue}
												<span class="badge badge-error">Overdue</span>
											{:else}
												<span class="badge badge-warning">
													Pending
												</span>
											{/if}
										</div>

										<div class="mb-2">
											<span
												class="text-sm font-medium"
												class:text-error={overdue &&
													!follow_up.completed}
											>
												Due: {format_due_date(
													follow_up.due_date,
													preferences.date_format,
												)}
											</span>
										</div>

										{#if follow_up.note}
											<p class="whitespace-pre-wrap opacity-80">
												{follow_up.note}
											</p>
										{/if}

										{#if follow_up.completed && follow_up.completed_at}
											<p class="mt-2 text-sm opacity-60">
												Completed: {format_date(
													new Date(follow_up.completed_at),
													preferences.date_format,
												)}
											</p>
										{/if}
									</div>

									<div class="flex flex-col gap-2">
										{#if follow_up.completed}
											<button
												onclick={() => handle_reopen(follow_up.id)}
												class="btn btn-outline btn-sm"
											>
												Reopen
											</button>
										{:else}
											<button
												onclick={() => handle_complete(follow_up.id)}
												class="btn btn-sm btn-success"
											>
												Complete
											</button>
										{/if}
										<button
											onclick={() => handle_delete(follow_up.id)}
											class="btn btn-outline btn-sm btn-error"
										>
											Delete
										</button>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>

				<div class="mt-6 text-sm opacity-70">
					Showing {follow_ups.length} follow-up{follow_ups.length !==
					1
						? 's'
						: ''}
				</div>
			{/if}
		{/await}
	{/key}
</div>
