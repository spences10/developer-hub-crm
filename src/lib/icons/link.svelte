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
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
>
	<path
		d="M14 7H16C18.8 7 21 9.2 21 12C21 14.8 18.8 17 16 17H14"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-miterlimit="10"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M10 17H8C5.2 17 3 14.8 3 12C3 9.2 5.2 7 8 7H10"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-miterlimit="10"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M8 12H16"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-miterlimit="10"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
