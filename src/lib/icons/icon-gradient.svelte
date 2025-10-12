<script lang="ts">
	interface Props {
		id: string;
	}

	let { id }: Props = $props();
</script>

<defs>
	<linearGradient {id} x1="0%" y1="0%" x2="100%" y2="100%">
		<stop
			offset="0%"
			style="stop-color: var(--color-primary); stop-opacity: 1"
		/>
		<stop
			offset="50%"
			style="stop-color: var(--color-secondary); stop-opacity: 1"
		/>
		<stop
			offset="100%"
			style="stop-color: var(--color-accent); stop-opacity: 1"
		/>
	</linearGradient>
</defs>
