<script lang="ts">
	import { enhance } from '$app/forms'
</script>

<h1>Sign up</h1>
<form method="post" use:enhance action="?/sign_up">
	<label for="email">
		<span>Email</span>
		<input class="input" type="email" name="email" id="email" />
	</label>
	<label for="username">
		<span>Username</span>
		<input class="input" name="username" id="username" />
	</label>
	<label for="password">
		<span>Password</span>
		<input
			class="input"
			type="password"
			name="password"
			id="password"
		/>
	</label>
	<button type="submit">Sign up</button>
</form>

<p>Already have an account? <a href="/login">Log in</a>.</p>
