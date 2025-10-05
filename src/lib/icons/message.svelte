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
	<g>
		<path
			d="M20 5H4C3.44772 5 3 5.44772 3 6V17C3 17.5523 3.44772 18 4 18H9L12 21L15 18H20C20.5523 18 21 17.5523 21 17V6C21 5.44772 20.5523 5 20 5Z"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-miterlimit="10"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M12.9999 13.5H6.99994"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-miterlimit="10"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
		<path
			d="M17 9.5H6.99998"
			stroke="currentColor"
			stroke-width="1.5"
			stroke-miterlimit="10"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</g>
</svg>
