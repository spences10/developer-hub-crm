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
		d="M16 2.5H8C6.89543 2.5 6 3.39543 6 4.5V19.5C6 20.6046 6.89543 21.5 8 21.5H16C17.1046 21.5 18 20.6046 18 19.5V4.5C18 3.39543 17.1046 2.5 16 2.5Z"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-miterlimit="10"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M12 18H12.012"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
	/>
</svg>
