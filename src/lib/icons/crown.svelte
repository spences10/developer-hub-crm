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
		d="M18.5676 16H4.94595L3 6L8 10L12 3L16 10L21 6L18.5676 16Z"
		stroke-width="1.5"
		stroke-linecap="round"
	/>
	<path d="M5 20H19" stroke-width="1.5" stroke-linecap="round" />
</svg>
