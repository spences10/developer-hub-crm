<script lang="ts">
	interface Props {
		size?: string;
		class_names?: string;
	}

	let { size = '24px', class_names }: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	class={class_names}
	fill="none"
	viewBox="0 0 24 24"
	stroke="currentColor"
	width={size}
	height={size}
>
	<g>
		<path
			d="M11.8737 13.5L11.8737 9.97894"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M10.8118 4.41764C11.2617 3.56283 12.4857 3.56283 12.9356 4.41764L20.4216 18.6411C20.8422 19.4402 20.2627 20.4 19.3597 20.4H4.38764C3.48462 20.4 2.90516 19.4402 3.32574 18.6411L10.8118 4.41764Z"
			stroke-width="1.5"
			stroke-miterlimit="10"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M11.8736 16.6105H11.8825"
			stroke-width="1.50"
			stroke-linecap="round"
		/>
	</g>
</svg>
