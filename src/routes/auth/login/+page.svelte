<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<div
	class="bg-base-200 flex min-h-screen items-center justify-center"
>
	<div class="card bg-base-100 w-full max-w-md shadow-xl">
		<div class="card-body">
			<h1 class="card-title justify-center text-2xl">
				Developer Hub CRM
			</h1>
			<h2 class="text-center text-xl font-semibold">Log In</h2>

			<form
				method="POST"
				action="?/login"
				use:enhance
				class="space-y-4"
			>
				{#if form?.message}
					<div class="alert alert-error">
						{form.message}
					</div>
				{/if}

				<div class="form-control">
					<label for="username" class="label">
						<span class="label-text">Username</span>
					</label>
					<input
						type="text"
						id="username"
						name="username"
						class="input input-bordered"
						required
					/>
				</div>

				<div class="form-control">
					<label for="password" class="label">
						<span class="label-text">Password</span>
					</label>
					<input
						type="password"
						id="password"
						name="password"
						class="input input-bordered"
						required
					/>
				</div>

				<div class="form-control mt-6">
					<button type="submit" class="btn btn-primary">
						Log In
					</button>
				</div>
			</form>

			<div class="divider">OR</div>

			<div class="text-center">
				<p class="text-sm">
					Don't have an account?
					<a href="/auth/register" class="link link-primary">
						Register
					</a>
				</p>
			</div>
		</div>
	</div>
</div>
