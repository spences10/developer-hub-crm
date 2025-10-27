<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		// Link behavior
		href?: string | null;
		// Main heading
		heading?: string | null;
		// Metadata section (badges, dates, etc.)
		metadata: Snippet;
		// Optional note content
		note?: string | null;
		note_truncate?: number;
		// Additional content via snippet
		extra_content?: Snippet;
		// Custom classes
		item_class?: string;
	}

	let {
		href,
		heading,
		metadata,
		note,
		note_truncate = 50,
		extra_content,
		item_class = '',
	}: Props = $props();

	function truncate_text(text: string, length: number): string {
		if (text.length <= length) return text;
		return text.substring(0, length) + '...';
	}

	const base_classes = `block rounded-box bg-base-200 p-3 ${item_class}`;
	const link_classes = `${base_classes} transition hover:bg-base-300`;
</script>

{#if href}
	<a {href} class={link_classes}>
		{#if heading}
			<p class="mb-1 font-semibold">
				{heading}
			</p>
		{/if}
		<div class="mb-1">
			{@render metadata()}
		</div>
		{#if note}
			<p class="text-sm opacity-70">
				{truncate_text(note, note_truncate)}
			</p>
		{/if}
		{#if extra_content}
			{@render extra_content()}
		{/if}
	</a>
{:else}
	<div class={base_classes}>
		{#if heading}
			<p class="mb-1 font-semibold">
				{heading}
			</p>
		{/if}
		<div class="mb-1">
			{@render metadata()}
		</div>
		{#if note}
			<p class="text-sm opacity-70">
				{truncate_text(note, note_truncate)}
			</p>
		{/if}
		{#if extra_content}
			{@render extra_content()}
		{/if}
	</div>
{/if}
