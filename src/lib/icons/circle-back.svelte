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
	<circle cx="12" cy="12" r="9" stroke-width="1.5" />
	<path
		d="M10 12L8 10M8 10L10 8M8 10L13 10C14.6569 10 16 11.3431 16 13C16 14.6569 14.6569 16 13 16L12 16"
		stroke-width="1.5"
		stroke-miterlimit="10"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
