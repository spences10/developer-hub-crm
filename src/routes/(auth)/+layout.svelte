<script lang="ts">
	let { children } = $props();
</script>

<div
	class="flex min-h-screen items-center justify-center bg-base-300"
>
	<div class="w-full max-w-md px-8">
		{@render children()}
	</div>
</div>
