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
	let gradient_id = `calendar-${Math.random().toString(36).substr(2, 9)}`;
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
		<IconGradient id={gradient_id} />
	{/if}
	<g>
		<path
			d="M4 6C4 5.44772 4.44772 5 5 5H19C19.5523 5 20 5.44772 20 6V19C20 19.5523 19.5523 20 19 20H5C4.44772 20 4 19.5523 4 19V6Z"
			stroke={gradient ? `url(#${gradient_id})` : 'currentColor'}
			stroke-width="1.5"
			stroke-miterlimit="10"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M9 7L9 3"
			stroke={gradient ? `url(#${gradient_id})` : 'currentColor'}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M3.99997 10L20 10"
			stroke={gradient ? `url(#${gradient_id})` : 'currentColor'}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M15 7L15 3"
			stroke={gradient ? `url(#${gradient_id})` : 'currentColor'}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<rect
			x="7.5"
			y="13.5"
			width="0.1"
			height="0.1"
			stroke={gradient ? `url(#${gradient_id})` : 'currentColor'}
			stroke-width="1.50"
		/>
		<rect
			x="7.5"
			y="16.5"
			width="0.1"
			height="0.1"
			stroke={gradient ? `url(#${gradient_id})` : 'currentColor'}
			stroke-width="1.50"
		/>
		<rect
			x="10.5"
			y="13.5"
			width="0.1"
			height="0.1"
			stroke={gradient ? `url(#${gradient_id})` : 'currentColor'}
			stroke-width="1.50"
		/>
		<rect
			x="10.5"
			y="16.5"
			width="0.1"
			height="0.1"
			stroke={gradient ? `url(#${gradient_id})` : 'currentColor'}
			stroke-width="1.50"
		/>
		<rect
			x="13.5"
			y="13.5"
			width="0.1"
			height="0.1"
			stroke={gradient ? `url(#${gradient_id})` : 'currentColor'}
			stroke-width="1.50"
		/>
		<rect
			x="13.5"
			y="16.5"
			width="0.1"
			height="0.1"
			stroke={gradient ? `url(#${gradient_id})` : 'currentColor'}
			stroke-width="1.50"
		/>
		<rect
			x="16.5"
			y="13.5"
			width="0.1"
			height="0.1"
			stroke={gradient ? `url(#${gradient_id})` : 'currentColor'}
			stroke-width="1.50"
		/>
		<rect
			x="16.5"
			y="16.5"
			width="0.1"
			height="0.1"
			stroke={gradient ? `url(#${gradient_id})` : 'currentColor'}
			stroke-width="1.50"
		/>
	</g>
</svg>
