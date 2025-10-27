<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Variant = 'default' | 'elevated' | 'plain';

	interface Props extends HTMLAttributes<HTMLElement> {
		href?: string | null;
		heading?: string | null;
		header?: Snippet;
		subheading?: string | null;
		metadata?: Snippet;
		body?: Snippet;
		note?: string | null;
		note_truncate?: number;
		footer?: Snippet;
		extra_content?: Snippet;
		variant?: Variant;
	}

	let {
		href,
		heading,
		header,
		subheading,
		metadata,
		body,
		note,
		note_truncate = 50,
		footer,
		extra_content,
		variant = 'default' as Variant,
		class: className = '',
		...restProps
	}: Props = $props();

	function truncate_text(
		text: string | null | undefined,
		length: number,
	): string {
		if (!text || text.length <= length) return text ?? '';
		return `${text.substring(0, length)}…`;
	}

	const variant_classes = $derived(
		{
			default: 'rounded-box bg-base-200',
			elevated: 'rounded-box bg-base-100 shadow-lg',
			plain: '',
		}[variant],
	);

	const base_classes = $derived(
		['block p-4', variant_classes, className]
			.filter(Boolean)
			.join(' '),
	);

	const hover_classes = $derived(
		href && variant !== 'plain' ? 'transition hover:bg-base-300' : '',
	);

	const element = $derived(href ? 'a' : 'div');
</script>

<svelte:element
	this={element}
	href={href || undefined}
	class={[base_classes, hover_classes].filter(Boolean).join(' ')}
	{...restProps}
>
	{#if header}
		<div class="mb-3 flex items-start justify-between gap-3">
			{@render header()}
		</div>
	{:else if heading}
		<div class="mb-3">
			<p class="font-semibold">{heading}</p>
			{#if subheading}
				<p class="text-sm opacity-70">{subheading}</p>
			{/if}
		</div>
	{/if}

	{#if metadata}
		<div class="mb-2">
			{@render metadata()}
		</div>
	{/if}

	{#if body}
		<div class="space-y-2">
			{@render body()}
		</div>
	{:else if note}
		<p class="text-sm opacity-70">
			{truncate_text(note, note_truncate)}
		</p>
	{/if}

	{#if extra_content}
		<div class="mt-2">
			{@render extra_content()}
		</div>
	{/if}

	{#if footer}
		<div class="mt-3 flex flex-wrap gap-2">
			{@render footer()}
		</div>
	{/if}
</svelte:element>
