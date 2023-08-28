<script>
	import '../app.postcss'
</script>

<form action="/logout" method="POST">
	<li>
		<button
			type="submit"
			class="btn-sm btn-warning text-warning-content"
		>
			Logout
		</button>
	</li>
</form>

<main class="container max-w-3xl mx-auto px-4 flex-grow">
	<slot />
</main>
