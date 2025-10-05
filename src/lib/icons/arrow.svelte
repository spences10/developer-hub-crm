<script lang="ts">
	interface Props {
		size?: string;
		class_names?: string;
		direction?:
			| 'left'
			| 'right'
			| 'up'
			| 'down'
			| 'left-down'
			| 'right-down'
			| 'left-up'
			| 'right-up';
	}

	let {
		size = '24px',
		class_names,
		direction = 'left',
	}: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	class="{direction} {class_names}"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
>
	<path
		d="M5 12L19 12"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-miterlimit="10"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path
		d="M11 18L5 12L11 6"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-miterlimit="10"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>

<style>
	.left {
		transform: rotate(0deg);
	}
	.right {
		transform: rotate(180deg);
	}
	.up {
		transform: rotate(90deg);
	}
	.down {
		transform: rotate(-90deg);
	}
	.left-down {
		transform: rotate(-45deg);
	}
	.right-down {
		transform: rotate(-135deg);
	}
	.left-up {
		transform: rotate(45deg);
	}
	.right-up {
		transform: rotate(135deg);
	}
</style>
