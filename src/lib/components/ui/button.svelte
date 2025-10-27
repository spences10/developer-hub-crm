<script lang="ts">
	import type { Snippet } from 'svelte';
	import type {
		HTMLAnchorAttributes,
		HTMLButtonAttributes,
	} from 'svelte/elements';

	type ClickHandler = (event: MouseEvent) => void;

	interface BaseProps {
		variant?: 'primary' | 'outline' | 'ghost' | 'error' | 'success';
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'block';
		loading?: boolean;
		ref?: HTMLElement | null;
		children: Snippet;
		class?: string;
		onclick?: ClickHandler;
		disabled?: boolean;
		target?: string;
		rel?: string;
	}

	type AnchorProps = BaseProps &
		Omit<HTMLAnchorAttributes, 'onclick' | 'target' | 'rel'> & {
			href: string;
			onclick?: ClickHandler;
			type?: never;
		};

	type NativeButtonProps = BaseProps &
		Omit<HTMLButtonAttributes, 'onclick'> & {
			href?: undefined;
			onclick?: ClickHandler;
		};

	type Props = AnchorProps | NativeButtonProps;

	let {
		class: className = '',
		type = 'button',
		variant = 'primary',
		size = 'md',
		loading = false,
		disabled = false,
		href = undefined,
		target = undefined,
		rel = undefined,
		ref = $bindable(null),
		children,
		...restProps
	}: Props = $props();

	const base_classes = 'btn';

	const variant_classes = $derived(
		{
			primary: 'btn-primary',
			outline: 'btn-outline',
			ghost: 'btn-ghost',
			error: 'btn-error',
			success: 'btn-success',
		}[variant],
	);

	const size_classes = $derived(
		{
			xs: 'btn-xs',
			sm: 'btn-sm',
			md: '',
			lg: 'btn-lg',
			block: 'btn-block',
		}[size],
	);

	const computed_classes = $derived(
		[base_classes, variant_classes, size_classes, className]
			.filter(Boolean)
			.join(' '),
	);
</script>

{#if href}
	<a
		bind:this={ref as HTMLAnchorElement | null}
		href={disabled || loading ? undefined : href}
		{target}
		{rel}
		aria-disabled={disabled || loading}
		tabindex={disabled || loading ? -1 : undefined}
		class={computed_classes}
		{...restProps as Record<string, unknown>}
	>
		{#if loading}
			<span class="loading loading-sm loading-spinner"></span>
			Loading...
		{:else}
			{@render children()}
		{/if}
	</a>
{:else}
	<button
		bind:this={ref as HTMLButtonElement | null}
		{type}
		disabled={disabled || loading}
		class={computed_classes}
		{...restProps as Record<string, unknown>}
	>
		{#if loading}
			<span class="loading loading-sm loading-spinner"></span>
			Loading...
		{:else}
			{@render children()}
		{/if}
	</button>
{/if}
