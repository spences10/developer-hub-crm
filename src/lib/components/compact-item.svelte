<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLElement> {
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
		// Variant controls default styling
		variant?: 'default' | 'elevated' | 'plain';
	}

	let {
		href,
		heading,
		metadata,
		note,
		note_truncate = 50,
		extra_content,
		variant = 'default',
		class: className = '',
		...restProps
	}: Props = $props();

	function truncate_text(text: string, length: number): string {
		if (text.length <= length) return text;
		return text.substring(0, length) + '...';
	}

	const variant_classes = $derived(
		{
			default: 'rounded-box bg-base-200',
			elevated: 'rounded-box bg-base-100 shadow',
			plain: '',
		}[variant],
	);

	const base_classes = $derived(
		['block p-3', variant_classes, className]
			.filter(Boolean)
			.join(' '),
	);

	const link_classes = $derived(
		href
			? `${base_classes} transition hover:bg-base-300`
			: base_classes,
	);
</script>

<svelte:element
	this={href ? 'a' : 'div'}
	href={href || undefined}
	class={link_classes}
	{...restProps}
>
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
</svelte:element>
