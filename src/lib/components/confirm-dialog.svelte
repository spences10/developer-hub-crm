<script lang="ts">
	import { Check, Cross } from '$lib/icons';

	interface Props {
		message?: string;
		confirm_label?: string;
		cancel_label?: string;
		is_inline?: boolean;
		show_icons?: boolean;
		on_confirm?: () => void | Promise<void>;
		on_cancel?: () => void | Promise<void>;
	}

	let {
		message = 'Are you sure?',
		confirm_label = 'Confirm',
		cancel_label = 'Cancel',
		is_inline = false,
		show_icons = true,
		on_confirm = () => {},
		on_cancel = () => {},
	}: Props = $props();

	async function handle_confirm(event?: Event) {
		if (event) event.stopPropagation();
		await on_confirm();
	}

	async function handle_cancel(event?: Event) {
		if (event) event.stopPropagation();
		await on_cancel();
	}
</script>

{#if is_inline}
	<div class="flex items-center gap-2">
		<span class="mr-2 text-xs text-error">{message}</span>
		<button
			class="btn btn-ghost btn-xs btn-error"
			aria-label={confirm_label}
			onclick={handle_confirm}
		>
			{#if show_icons}
				<Check size="20px" />
			{:else}
				{confirm_label}
			{/if}
		</button>
		<button
			class="btn btn-ghost btn-xs"
			aria-label={cancel_label}
			onclick={handle_cancel}
		>
			{#if show_icons}
				<Cross size="20px" />
			{:else}
				{cancel_label}
			{/if}
		</button>
	</div>
{:else}
	<div class="flex items-center gap-2">
		<button
			class="btn btn-sm btn-error"
			aria-label={confirm_label}
			onclick={handle_confirm}
		>
			{#if show_icons}
				<Check size="20px" />
			{/if}
			{confirm_label}
		</button>
		<button
			class="btn btn-outline btn-sm"
			aria-label={cancel_label}
			onclick={handle_cancel}
		>
			{#if show_icons}
				<Cross size="20px" />
			{/if}
			{cancel_label}
		</button>
	</div>
{/if}
