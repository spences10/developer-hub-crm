<script lang="ts">
	interface Props {
		size?: string;
		class_names?: string;
		type?: 'add' | 'close';
	}

	let {
		size = '24px',
		class_names,
		type = 'close',
	}: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	class="{type} {class_names}"
	fill="none"
	viewBox="0 0 24 24"
	stroke="currentColor"
	height={size}
	width={size}
>
	<path
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="2"
		d="M6 18L18 6M6 6l12 12"
	/>
</svg>

<style>
	.add {
		transform: rotate(45deg);
	}
	.close {
		transform: rotate(0deg);
	}
</style>
