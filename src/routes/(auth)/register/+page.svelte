<script lang="ts">
	import { register } from '../../auth.remote';
</script>

<h2 class="card-title mb-6 text-2xl">Register</h2>

<form {...register} class="space-y-4">
	<fieldset class="fieldset">
		<legend class="fieldset-legend">Name</legend>
		<label class="input validator w-full">
			<input
				type="text"
				name="name"
				placeholder="Your name"
				class="grow"
				required
			/>
		</label>
	</fieldset>

	<fieldset class="fieldset">
		<legend class="fieldset-legend">Email</legend>
		<label class="input validator w-full">
			<input
				type="email"
				name="email"
				placeholder="[email protected]"
				class="grow"
				required
			/>
		</label>
	</fieldset>

	<fieldset class="fieldset">
		<legend class="fieldset-legend">Password</legend>
		<label class="input validator w-full">
			<input
				type="password"
				name="password"
				placeholder="At least 8 characters"
				class="grow"
				required
			/>
		</label>
		<p class="label">Must be at least 8 characters</p>
	</fieldset>

	<button class="btn btn-primary btn-block mt-6" type="submit">
		Register
	</button>
</form>

<div class="divider">OR</div>

<p class="text-center">
	Already have an account?
	<a href="/login" class="link link-primary">Login</a>
</p>
