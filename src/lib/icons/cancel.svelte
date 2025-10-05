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
		d="M15.5 8.5L8.5 15.5"
		stroke-width="1.5"
		stroke-miterlimit="10"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M15.5 15.5L8.5 8.5"
		stroke-width="1.5"
		stroke-miterlimit="10"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
		stroke-width="1.5"
		stroke-miterlimit="10"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
