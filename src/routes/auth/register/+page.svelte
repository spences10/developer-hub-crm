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
			<h2 class="text-center text-xl font-semibold">
				Create Account
			</h2>

			<form
				method="POST"
				action="?/register"
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
					<div class="label">
						<span class="label-text-alt">
							3-31 characters, lowercase letters, numbers, hyphens,
							and underscores only
						</span>
					</div>
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
					<div class="label">
						<span class="label-text-alt">Minimum 6 characters</span>
					</div>
				</div>

				<div class="form-control">
					<label for="confirmPassword" class="label">
						<span class="label-text">Confirm Password</span>
					</label>
					<input
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						class="input input-bordered"
						required
					/>
				</div>

				<div class="form-control mt-6">
					<button type="submit" class="btn btn-primary">
						Register
					</button>
				</div>
			</form>

			<div class="divider">OR</div>

			<div class="text-center">
				<p class="text-sm">
					Already have an account?
					<a href="/auth/login" class="link link-primary">Log In</a>
				</p>
			</div>
		</div>
	</div>
</div>
