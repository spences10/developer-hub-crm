<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<div class="flex min-h-screen items-center justify-center bg-base-200">
	<div class="card w-full max-w-md bg-base-100 shadow-xl">
		<div class="card-body">
			<h1 class="card-title text-2xl justify-center">Developer Hub CRM</h1>
			<p class="text-center">Redirecting...</p>
			
			<div class="divider"></div>
			
			<form method="POST" action="?/logout" use:enhance>
				<button
					type="submit"
					class="btn btn-error w-full"
				>
					Log Out
				</button>
			</form>
		</div>
	</div>
</div>
