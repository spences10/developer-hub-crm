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
	let gradient_id = `message-${Math.random().toString(36).substr(2, 9)}`;
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
			d="M20 5H4C3.44772 5 3 5.44772 3 6V17C3 17.5523 3.44772 18 4 18H9L12 21L15 18H20C20.5523 18 21 17.5523 21 17V6C21 5.44772 20.5523 5 20 5Z"
			stroke={gradient ? `url(#${gradient_id})` : 'currentColor'}
			stroke-width="1.5"
			stroke-miterlimit="10"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M12.9999 13.5H6.99994"
			stroke={gradient ? `url(#${gradient_id})` : 'currentColor'}
			stroke-width="1.5"
			stroke-miterlimit="10"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M17 9.5H6.99998"
			stroke={gradient ? `url(#${gradient_id})` : 'currentColor'}
			stroke-width="1.5"
			stroke-miterlimit="10"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</g>
</svg>
