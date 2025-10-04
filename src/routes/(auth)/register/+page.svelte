<script lang="ts">
	import Logo from '$lib/logo.svelte';
	import { register } from '../../auth.remote';
</script>

<div class="fixed inset-0 flex min-h-screen">
	<!-- Left Panel - Branding -->
	<div
		class="to-primary-focus hidden w-1/2 flex-col justify-center bg-gradient-to-br from-primary p-12 lg:flex"
	>
		<div class="mx-auto max-w-lg">
			<Logo size="90px" class_names="mb-8 -ml-4" />

			<h1 class="mb-4 text-4xl font-bold text-primary-content">
				Create your free account
			</h1>

			<p class="mb-8 text-lg text-primary-content/90">
				Explore Devhub CRM's core features for managing your developer
				relationships.
			</p>

			<div class="space-y-4 text-primary-content/90">
				<div class="flex items-start gap-3">
					<svg
						class="mt-1 h-5 w-5 flex-shrink-0"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clip-rule="evenodd"
						/>
					</svg>
					<div>
						<h3 class="font-semibold">Unlimited contacts</h3>
						<p class="text-sm text-primary-content/75">
							Manage all your developer relationships in one place
						</p>
					</div>
				</div>

				<div class="flex items-start gap-3">
					<svg
						class="mt-1 h-5 w-5 flex-shrink-0"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clip-rule="evenodd"
						/>
					</svg>
					<div>
						<h3 class="font-semibold">Track interactions</h3>
						<p class="text-sm text-primary-content/75">
							Log meetings, calls, and conversations effortlessly
						</p>
					</div>
				</div>

				<div class="flex items-start gap-3">
					<svg
						class="mt-1 h-5 w-5 flex-shrink-0"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clip-rule="evenodd"
						/>
					</svg>
					<div>
						<h3 class="font-semibold">Never miss follow-ups</h3>
						<p class="text-sm text-primary-content/75">
							Automated reminders keep you connected
						</p>
					</div>
				</div>

				<div class="flex items-start gap-3">
					<svg
						class="mt-1 h-5 w-5 flex-shrink-0"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clip-rule="evenodd"
						/>
					</svg>
					<div>
						<h3 class="font-semibold">GitHub integration</h3>
						<p class="text-sm text-primary-content/75">
							Import contacts directly from your GitHub network
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Right Panel - Form -->
	<div
		class="flex w-full items-center justify-center bg-base-100 p-8 lg:w-1/2"
	>
		<div class="w-full max-w-md">
			<!-- Mobile logo -->
			<div class="mb-8 lg:hidden">
				<Logo size="60px" class_names="mx-auto" />
			</div>

			<h2 class="mb-6 text-2xl font-bold">Register</h2>

			<form {...register} class="space-y-4">
				<fieldset class="fieldset">
					<legend class="fieldset-legend">Name</legend>
					<label class="validator input w-full">
						<input
							type="text"
							name="name"
							placeholder="Name"
							class="grow"
							required
						/>
					</label>
				</fieldset>

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Email</legend>
					<label class="validator input w-full">
						<input
							type="email"
							name="email"
							placeholder="Email"
							class="grow"
							required
						/>
					</label>
				</fieldset>

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Password</legend>
					<label class="validator input w-full">
						<input
							type="password"
							name="password"
							placeholder="Password"
							class="grow"
							required
							minlength="8"
						/>
					</label>
					<p class="label">Must be at least 8 characters</p>
				</fieldset>

				<button class="btn mt-6 btn-block btn-primary" type="submit">
					Register
				</button>
			</form>

			<div class="divider">or</div>

			<p class="text-center">
				Already have an account?
				<a href="/login" class="link link-primary">Login</a>
			</p>
		</div>
	</div>
</div>
