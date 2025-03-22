<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<div
	class="bg-base-200 flex min-h-screen items-center justify-center"
>
	<div class="card bg-base-100 w-full max-w-md shadow-xl">
		<div class="card-body">
			<h1 class="card-title justify-center text-2xl">
				Developer Hub CRM
			</h1>
			<p class="text-center">Redirecting...</p>

			<div class="divider"></div>

			<form method="POST" action="?/logout" use:enhance>
				<button type="submit" class="btn btn-error w-full">
					Log Out
				</button>
			</form>
		</div>
	</div>
</div>
