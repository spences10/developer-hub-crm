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
	<path
		d="M4 20V16L17 3L21 7L8 20H4Z"
		stroke-width="1.5"
		stroke-miterlimit="10"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M14 6L18 10"
		stroke-width="1.5"
		stroke-miterlimit="10"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
