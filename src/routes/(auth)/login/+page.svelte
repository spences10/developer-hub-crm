<script lang="ts">
	import Logo from '$lib/logo.svelte';
	import { login } from '../../auth.remote';
	import { page } from '$app/state';

	const reset_success = $derived(
		page.url.searchParams.get('reset') === 'success',
	);
</script>

<div class="mb-8 flex justify-center">
	<Logo size="70px" />
</div>

<h2 class="mb-6 text-center text-2xl font-bold">Sign in to DevHub</h2>

{#if reset_success}
	<div class="mb-4 alert alert-success">
		<span>
			Your password has been reset successfully. Please sign in with
			your new password.
		</span>
	</div>
{/if}

<form {...login} class="space-y-4">
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
	</fieldset>

	<button class="btn mt-6 btn-block btn-primary" type="submit">
		Login
	</button>
</form>

<div class="divider">or</div>

<p class="mb-2 text-center">
	Don't have an account?
	<a href="/register" class="link link-primary">Register</a>
</p>

<p class="text-center">
	Forgot your password?
	<a href="/forgot-password" class="link link-primary">
		Reset it here
	</a>
</p>
