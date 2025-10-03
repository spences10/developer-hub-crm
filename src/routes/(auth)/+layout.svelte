<script lang="ts">
	let { children } = $props();
</script>

<div
	class="flex min-h-screen items-center justify-center bg-base-200"
>
	<div class="card w-full max-w-md bg-base-100 shadow-xl">
		<div class="card-body">
			{@render children()}
		</div>
	</div>
</div>
