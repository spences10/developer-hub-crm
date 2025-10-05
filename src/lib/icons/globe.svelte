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
	<circle
		cx="12"
		cy="12"
		r="9"
		stroke="currentColor"
		stroke-width="1.5"
	/>
	<ellipse
		cx="12"
		cy="12"
		rx="4"
		ry="9"
		stroke="currentColor"
		stroke-width="1.5"
	/>
	<path d="M3 12H21" stroke="currentColor" stroke-width="1.5" />
</svg>
