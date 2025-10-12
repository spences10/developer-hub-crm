<script lang="ts">
	import IconGradient from './icon-gradient.svelte';

	interface Props {
		size?: string;
		class_names?: string;
		gradient?: boolean;
	}

	let {
		size = '24px',
		class_names,
		gradient = false,
	}: Props = $props();
	let gradientId = `target-${Math.random().toString(36).substr(2, 9)}`;
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	class={class_names}
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
>
	{#if gradient}
		<IconGradient id={gradientId} />
	{/if}
	<path
		d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
		stroke={gradient ? `url(#${gradientId})` : 'currentColor'}
		stroke-width="1.5"
		stroke-miterlimit="10"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M12 16.5L12 20.5"
		stroke={gradient ? `url(#${gradientId})` : 'currentColor'}
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M12 3.5L12 7.5"
		stroke={gradient ? `url(#${gradientId})` : 'currentColor'}
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M7.5 12L3.5 12"
		stroke={gradient ? `url(#${gradientId})` : 'currentColor'}
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M20.5 12L16.5 12"
		stroke={gradient ? `url(#${gradientId})` : 'currentColor'}
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
