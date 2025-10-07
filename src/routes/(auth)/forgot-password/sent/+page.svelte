<script lang="ts">
	import Logo from '$lib/logo.svelte';
</script>

<div class="mb-8 flex justify-center">
	<Logo size="70px" />
</div>

<h2 class="mb-6 text-center text-2xl font-bold">Check your email</h2>

<div class="mb-6 alert alert-success">
	<span>
		If an account exists with that email address, you will receive a
		password reset link shortly.
	</span>
</div>

<p class="mb-6 text-center text-sm text-base-content/70">
	Please check your inbox and click the link to reset your password.
	The link will expire in 1 hour.
</p>

<div class="space-y-4">
	<a href="/login" class="btn btn-block btn-primary">
		Back to login
	</a>

	<a href="/forgot-password" class="btn btn-block btn-ghost">
		Didn't receive email? Try again
	</a>
</div>
