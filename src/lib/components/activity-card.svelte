<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import ConfirmDialog from './confirm-dialog.svelte';

	interface Props {
		// Icon configuration
		icon: Component;
		icon_color_classes: string;
		// Contact information
		contact_id: string;
		contact_name: string;
		// Metadata line
		metadata: string;
		metadata_classes?: string;
		// Content
		note?: string | null;
		footer_text?: string | null;
		// Delete confirmation
		show_delete_confirmation: boolean;
		on_confirm_delete: () => void;
		on_cancel_delete: () => void;
		// Action buttons (via snippet)
		action_buttons: Snippet;
	}

	let {
		icon: Icon,
		icon_color_classes,
		contact_id,
		contact_name,
		metadata,
		metadata_classes = 'opacity-60',
		note,
		footer_text,
		show_delete_confirmation,
		on_confirm_delete,
		on_cancel_delete,
		action_buttons,
	}: Props = $props();
</script>

<div
	class="card bg-base-100 shadow-md transition-shadow hover:shadow-lg"
>
	<div class="card-body p-4">
		<div class="flex h-full flex-col">
			<!-- Header -->
			<div class="mb-3 flex items-start gap-3">
				<div class="flex-shrink-0">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-box {icon_color_classes}"
					>
						<Icon size="20px" />
					</div>
				</div>
				<div class="min-w-0 flex-1">
					<div class="mb-1 flex items-center gap-2">
						<a
							href="/contacts/{contact_id}"
							class="link truncate text-base font-semibold link-hover"
						>
							{contact_name}
						</a>
					</div>
					<div class="flex flex-wrap items-center gap-2 text-sm">
						<span class={metadata_classes}>
							{@html metadata}
						</span>
					</div>
				</div>
			</div>

			<!-- Note Content -->
			{#if note}
				<div class="mb-3 flex-1">
					<p
						class="line-clamp-3 text-sm whitespace-pre-wrap opacity-80"
					>
						{note}
					</p>
				</div>
			{/if}

			<!-- Footer Text (like completed date) -->
			{#if footer_text}
				<div class="mb-2 text-xs opacity-60">
					{footer_text}
				</div>
			{/if}

			<!-- Actions Footer -->
			<div
				class="flex items-center justify-end gap-1 border-t border-base-300 pt-2 lg:gap-2"
			>
				{#if show_delete_confirmation}
					<ConfirmDialog
						is_inline={true}
						message="Delete?"
						on_confirm={on_confirm_delete}
						on_cancel={on_cancel_delete}
					/>
				{:else}
					{@render action_buttons()}
				{/if}
			</div>
		</div>
	</div>
</div>
