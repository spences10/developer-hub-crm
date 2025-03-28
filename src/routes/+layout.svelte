<script lang="ts">
	import { page } from '$app/state';
	import { Nav } from '$lib/components';
	import '../app.css';

	let { children } = $props();

	// Determine if we're on a contact detail page
	const is_contact_detail_page = $derived(
		page.url.pathname.startsWith('/contacts/') &&
			page.url.pathname !== '/contacts',
	);

	// Determine if we're on an auth page
	const is_auth_page = $derived(
		page.url.pathname.startsWith('/auth'),
	);
</script>

<div class="app">
	<Nav
		show_back_button={is_contact_detail_page}
		rounded={!page.url.pathname.startsWith('/')}
		fixed={page.url.pathname === '/'}
		user={page.data.user}
	/>

	<div class="content">
		{@render children()}
	</div>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.content {
		flex: 1;
	}
</style>
