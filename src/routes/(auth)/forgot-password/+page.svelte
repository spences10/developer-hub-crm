<script lang="ts">
	import { page } from '$app/state';
	import Logo from '$lib/logo.svelte';
	import { seo_configs } from '$lib/seo';
	import { Head } from 'svead';
	import { forgot_password } from '../../auth.remote';

	const mode = page.url.searchParams.get('mode');
	const is_setup = mode === 'setup';
	const prefilled_email = page.url.searchParams.get('email') || '';
</script>

<Head seo_config={seo_configs.forgotPassword} />

<div class="mb-8 flex justify-center">
	<a href="/">
		<Logo size="70px" />
	</a>
</div>

<h2 class="mb-6 text-center text-2xl font-bold">
	{is_setup ? 'Set up your password' : 'Reset your password'}
</h2>

<p class="mb-6 text-center text-sm text-base-content/70">
	{is_setup
		? "Enter your email address and we'll send you a link to set up password authentication."
		: "Enter your email address and we'll send you a link to reset your password."}
</p>

<form {...forgot_password} class="space-y-4">
	<fieldset class="fieldset">
		<legend class="fieldset-legend">Email</legend>
		<label class="validator input w-full">
			<input
				type="email"
				name="email"
				placeholder="Email"
				class="grow"
				value={prefilled_email}
				readonly={is_setup && !!prefilled_email}
				required
			/>
		</label>
		{#if is_setup && prefilled_email}
			<p class="mt-1 text-xs opacity-60">
				To use a different email, update it in your profile settings
				first.
			</p>
		{/if}
	</fieldset>

	<button class="btn mt-6 btn-block btn-primary" type="submit">
		{is_setup ? 'Send setup link' : 'Send reset link'}
	</button>
</form>

<div class="divider">or</div>

<p class="text-center">
	Remember your password?
	<a href="/login" class="link link-primary">Sign in</a>
</p>
