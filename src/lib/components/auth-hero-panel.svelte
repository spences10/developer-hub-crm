<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div
	class="relative hidden w-1/2 flex-col justify-center overflow-hidden bg-gradient-to-br from-primary to-primary p-12 lg:flex"
>
	<!-- Decorative background pattern -->
	<div
		class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_50%)]"
	></div>
	<div
		class="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,0,0,0.15),transparent_50%)]"
	></div>

	<div class="relative z-10 mx-auto max-w-lg">
		{@render children()}
	</div>
</div>
