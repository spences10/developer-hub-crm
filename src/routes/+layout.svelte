<script>
	import '../app.postcss'
</script>

<main class="container max-w-3xl mx-auto px-4 flex-grow">
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

	<ul>
		<li><a href="/contacts">Contacts</a></li>
		<li><a href="/contacts/add">Add contact</a></li>
	</ul>

	<slot />
</main>
