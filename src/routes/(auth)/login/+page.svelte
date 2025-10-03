<script lang="ts">
	import { login } from '../../auth.remote';
</script>

<h2 class="card-title text-2xl">Login</h2>

<form {...login}>
	<div class="form-control">
		<label class="label" for="email">
			<span class="label-text">Email</span>
		</label>
		<input
			type="email"
			id="email"
			name="email"
			class="input-bordered input"
			required
		/>
	</div>

	<div class="form-control">
		<label class="label" for="password">
			<span class="label-text">Password</span>
		</label>
		<input
			type="password"
			id="password"
			name="password"
			class="input-bordered input"
			required
		/>
	</div>

	<div class="form-control mt-6">
		<button class="btn btn-primary" type="submit">Login</button>
	</div>
</form>

<div class="divider">OR</div>

<p class="text-center">
	Don't have an account?
	<a href="/register" class="link link-primary">Register</a>
</p>
