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
		d="M19.9999 3H3.99988C2.89531 3 1.99988 3.89543 1.99988 5V15C1.99988 16.1046 2.89531 17 3.99988 17H19.9999C21.1044 17 21.9999 16.1046 21.9999 15V5C21.9999 3.89543 21.1044 3 19.9999 3Z"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M7.99988 21H15.9999"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M11.9999 17V21"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
