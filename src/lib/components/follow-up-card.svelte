<script lang="ts">
	import type { FollowUp } from '$lib/types/db';
	import {
		type DateFormat,
		format_due_date,
		is_overdue,
	} from '$lib/utils/date-helpers';

	interface Props {
		follow_up: FollowUp & {
			contact_name?: string;
			contact_id?: string;
		};
		date_format: DateFormat;
		variant?: 'full' | 'compact' | 'dashboard';
		context?: Array<{ note: string; type: string }>;
		on_complete?: (id: string) => void;
		on_reopen?: (id: string) => void;
		on_delete?: (id: string) => void;
	}

	let {
		follow_up,
		date_format,
		variant = 'full',
		context,
		on_complete,
		on_reopen,
		on_delete,
	}: Props = $props();

	const overdue =
		variant !== 'dashboard' &&
		!follow_up.completed &&
		is_overdue(follow_up.due_date);
</script>

{#if variant === 'dashboard'}
	<!-- Dashboard compact version (used in overdue section) -->
	<div class="rounded-box bg-base-100 p-4">
		<div class="flex items-center justify-between">
			<div class="flex-1">
				{#if follow_up.contact_id && follow_up.contact_name}
					<a
						href="/contacts/{follow_up.contact_id}"
						class="link font-semibold link-hover"
					>
						{follow_up.contact_name}
					</a>
				{/if}
				<p class="text-sm text-error">
					Due: {format_due_date(follow_up.due_date, date_format)}
				</p>
				{#if follow_up.note}
					<p class="text-sm opacity-80">
						{follow_up.note}
					</p>
				{/if}
				{#if context && context.length > 0}
					<div class="mt-2 border-t border-base-300 pt-2">
						<p class="mb-1 text-xs font-medium opacity-60">
							Last discussed:
						</p>
						<div class="flex flex-wrap gap-1">
							{#each context.slice(0, 3) as ctx}
								<span class="badge badge-ghost badge-xs">
									{ctx.type}
								</span>
							{/each}
						</div>
					</div>
				{/if}
			</div>
			{#if follow_up.contact_id}
				<a
					href="/contacts/{follow_up.contact_id}"
					class="btn btn-sm btn-error"
				>
					View
				</a>
			{/if}
		</div>
	</div>
{:else if variant === 'compact'}
	<!-- Compact version (used in dashboard upcoming section) -->
	{#if follow_up.contact_id}
		<a
			href="/contacts/{follow_up.contact_id}"
			class="block rounded-box bg-base-200 p-3 transition hover:bg-base-300"
		>
			{#if follow_up.contact_name}
				<p class="font-semibold">
					{follow_up.contact_name}
				</p>
			{/if}
			<p class="text-sm opacity-70">
				{format_due_date(follow_up.due_date, date_format)}
			</p>
			{#if follow_up.note}
				<p class="text-sm opacity-60">
					{follow_up.note.substring(0, 50)}{follow_up.note.length > 50
						? '...'
						: ''}
				</p>
			{/if}
			{#if context && context.length > 0}
				<div class="mt-2 flex flex-wrap gap-1">
					{#each context.slice(0, 2) as ctx}
						<span class="badge badge-ghost badge-xs">
							{ctx.type}
						</span>
					{/each}
				</div>
			{/if}
		</a>
	{:else}
		<div class="block rounded-box bg-base-200 p-3">
			<p class="text-sm opacity-70">
				{format_due_date(follow_up.due_date, date_format)}
			</p>
			{#if follow_up.note}
				<p class="text-sm opacity-60">
					{follow_up.note.substring(0, 50)}{follow_up.note.length > 50
						? '...'
						: ''}
				</p>
			{/if}
		</div>
	{/if}
{:else}
	<!-- Full version (used in follow-ups list and contact detail) -->
	<div class="rounded-box bg-base-200 p-4">
		<div class="mb-2 flex items-center justify-between">
			<div>
				<span class="text-sm font-medium" class:text-error={overdue}>
					{format_due_date(follow_up.due_date, date_format)}
				</span>
				{#if overdue}
					<span class="ml-2 badge badge-sm badge-error">
						Overdue
					</span>
				{/if}
			</div>
			<div class="flex gap-2">
				{#if on_complete && !follow_up.completed}
					<button
						onclick={() => on_complete?.(follow_up.id)}
						class="btn btn-xs btn-success"
					>
						Complete
					</button>
				{/if}
				{#if on_reopen && follow_up.completed}
					<button
						onclick={() => on_reopen?.(follow_up.id)}
						class="btn btn-outline btn-xs"
					>
						Reopen
					</button>
				{/if}
				{#if on_delete}
					<button
						onclick={() => on_delete?.(follow_up.id)}
						class="btn btn-outline btn-xs btn-error"
					>
						Delete
					</button>
				{/if}
			</div>
		</div>
		{#if follow_up.note}
			<p class="text-sm whitespace-pre-wrap">
				{follow_up.note}
			</p>
		{/if}
	</div>
{/if}
