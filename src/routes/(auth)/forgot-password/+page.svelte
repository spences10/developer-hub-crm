<script lang="ts">
	import { Head } from 'svead';
	import Logo from '$lib/logo.svelte';
	import { seo_configs } from '$lib/seo';
	import { forgot_password } from '../../auth.remote';
</script>

<Head seo_config={seo_configs.forgotPassword} />

<div class="mb-8 flex justify-center">
	<Logo size="70px" />
</div>

<h2 class="mb-6 text-center text-2xl font-bold">
	Reset your password
</h2>

<p class="mb-6 text-center text-sm text-base-content/70">
	Enter your email address and we'll send you a link to reset your
	password.
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
				required
			/>
		</label>
	</fieldset>

	<button class="btn mt-6 btn-block btn-primary" type="submit">
		Send reset link
	</button>
</form>

<div class="divider">or</div>

<p class="text-center">
	Remember your password?
	<a href="/login" class="link link-primary">Sign in</a>
</p>
