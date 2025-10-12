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
		d="M12 3C8.13401 3 5 6.13401 5 10C5 15 12 21 12 21C12 21 19 15 19 10C19 6.13401 15.866 3 12 3Z"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-miterlimit="10"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<circle
		cx="12"
		cy="10"
		r="3"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-miterlimit="10"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
