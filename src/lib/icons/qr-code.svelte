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
	let gradient_id = `qr-code-${Math.random().toString(36).substr(2, 9)}`;
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
			d="M9 3H4.0001C3.44782 3 3.00011 3.4477 3.0001 3.99998L3 9M15.0001 3H20.0001C20.5524 3 21.0001 3.44772 21.0001 4V9M3.00006 15L3.00011 20C3.00012 20.5523 3.44783 21 4.00011 21H9M15.0001 21H20.0001C20.5524 21 21.0001 20.5523 21.0001 20V15"
			stroke={gradient ? `url(#${gradient_id})` : 'currentColor'}
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<rect
			x="7"
			y="7"
			width="3"
			height="3"
			stroke={gradient ? `url(#${gradient_id})` : 'currentColor'}
			stroke-width="1.5"
			stroke-linejoin="round"
		/>
		<rect
			x="14"
			y="7"
			width="3"
			height="3"
			stroke={gradient ? `url(#${gradient_id})` : 'currentColor'}
			stroke-width="1.5"
			stroke-linejoin="round"
		/>
		<rect
			x="7"
			y="14"
			width="3"
			height="3"
			stroke={gradient ? `url(#${gradient_id})` : 'currentColor'}
			stroke-width="1.5"
			stroke-linejoin="round"
		/>
		<rect
			x="14"
			y="14"
			width="0.1"
			height="0.1"
			stroke={gradient ? `url(#${gradient_id})` : 'currentColor'}
			stroke-width="1.50"
		/>
		<rect
			x="14"
			y="17"
			width="0.1"
			height="0.1"
			stroke={gradient ? `url(#${gradient_id})` : 'currentColor'}
			stroke-width="1.50"
		/>
		<rect
			x="17"
			y="14"
			width="0.1"
			height="0.1"
			stroke={gradient ? `url(#${gradient_id})` : 'currentColor'}
			stroke-width="1.50"
		/>
		<rect
			x="17"
			y="17"
			width="0.1"
			height="0.1"
			stroke={gradient ? `url(#${gradient_id})` : 'currentColor'}
			stroke-width="1.50"
		/>
		<rect
			x="15.45"
			y="15.5"
			width="0.1"
			height="0.1"
			stroke={gradient ? `url(#${gradient_id})` : 'currentColor'}
			stroke-width="1.50"
		/>
	</g>
</svg>
