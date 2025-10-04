<script lang="ts">
	import { login } from '../../auth.remote';
</script>

<h2 class="mb-6 card-title text-2xl">Login</h2>

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
			/>
		</label>
	</fieldset>

	<button class="btn mt-6 btn-block btn-primary" type="submit">
		Login
	</button>
</form>

<div class="divider">OR</div>

<p class="text-center">
	Don't have an account?
	<a href="/register" class="link link-primary">Register</a>
</p>
