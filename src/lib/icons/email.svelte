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
	let gradient_id = `email-${Math.random().toString(36).substr(2, 9)}`;
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
			d="M3 6C3 5.44772 3.44772 5 4 5H20C20.5523 5 21 5.44772 21 6V18C21 18.5523 20.5523 19 20 19H4C3.44772 19 3 18.5523 3 18V6Z"
			stroke={gradient ? `url(#${gradient_id})` : 'currentColor'}
			stroke-width="1.5"
			stroke-miterlimit="10"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M4 6L12 13L20 6"
			stroke={gradient ? `url(#${gradient_id})` : 'currentColor'}
			stroke-width="1.5"
			stroke-miterlimit="10"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</g>
</svg>
