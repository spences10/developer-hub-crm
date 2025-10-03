<script lang="ts">
	import { register } from '../../auth.remote';
</script>

<h2 class="card-title text-2xl">Register</h2>

<form {...register}>
	<div class="form-control">
		<label class="label" for="name">
			<span class="label-text">Name</span>
		</label>
		<input
			type="text"
			id="name"
			name="name"
			class="input-bordered input"
			required
		/>
	</div>

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
			placeholder="At least 8 characters"
			required
		/>
	</div>

	<div class="form-control mt-6">
		<button class="btn btn-primary" type="submit">Register</button>
	</div>
</form>

<div class="divider">OR</div>

<p class="text-center">
	Already have an account?
	<a href="/login" class="link link-primary">Login</a>
</p>
