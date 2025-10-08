<script lang="ts">
	import { Head } from 'svead';
	import Logo from '$lib/logo.svelte';
	import Github from '$lib/icons/github.svelte';
	import { login } from '../../auth.remote';
	import { auth_client } from '$lib/client/auth';
	import { page } from '$app/state';
	import { seo_configs } from '$lib/seo';

	const reset_success = $derived(
		page.url.searchParams.get('reset') === 'success',
	);

	async function handle_github_signin() {
		await auth_client.signIn.social({
			provider: 'github',
			callbackURL: '/dashboard',
		});
	}
</script>

<Head seo_config={seo_configs.login} />

<div class="mb-8 flex justify-center">
	<Logo size="70px" />
</div>

<h2 class="mb-6 text-center text-2xl font-bold">Sign in to Devhub</h2>

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

<button
	onclick={handle_github_signin}
	class="btn btn-block gap-2 btn-outline"
	type="button"
>
	<Github size="20px" />
	Continue with GitHub
</button>

<div class="divider"></div>

<p class="mb-2 text-center">
	Don't have an account?
	<a href="/register" class="link link-info">Register</a>
</p>

<p class="text-center">
	Forgot your password?
	<a href="/forgot-password" class="link link-info">
		Reset it here
	</a>
</p>
