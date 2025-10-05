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
		d="M13.7142 10.6226L20.4162 3H18.8286L13.0068 9.61729L8.3604 3H3L10.0278 13.0075L3 21H4.5876L10.7316 14.0104L15.6396 21H21M5.1606 4.17142H7.5996L18.8274 19.8861H16.3878"
		fill="currentColor"
	/>
</svg>
