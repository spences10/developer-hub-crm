<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<div
	class="bg-base-200 flex min-h-screen items-center justify-center p-4"
>
	<div
		class="card bg-base-100 border-base-300 w-full max-w-md border shadow-sm"
	>
		<div class="card-body p-8">
			<h1 class="mb-2 text-center text-3xl font-extrabold">
				<span class="text-primary">Dev</span>Hub CRM
			</h1>
			<h2 class="mb-6 text-center text-xl font-bold">Log In</h2>

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
						<span class="label-text font-medium">Username</span>
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
						<span class="label-text font-medium">Password</span>
					</label>
					<input
						type="password"
						id="password"
						name="password"
						class="input input-bordered"
						required
					/>
				</div>

				<div class="form-control mt-8">
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
