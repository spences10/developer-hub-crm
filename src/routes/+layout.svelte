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

	// Determine if the current page needs a full-width layout
	// Currently only the home page with hero sections needs full width
	const is_full_width_page = $derived(page.url.pathname === '/');
</script>

<div class="app">
	<Nav
		show_back_button={is_contact_detail_page}
		rounded={!page.url.pathname.startsWith('/')}
		fixed={page.url.pathname === '/'}
		user={page.data.user}
	/>

	<div class="content">
		{#if is_auth_page}
			<!-- Auth pages have their own container -->
			{@render children()}
		{:else if is_full_width_page}
			<!-- Full-width pages render content directly -->
			{@render children()}
		{:else}
			<!-- Standard container for all other pages -->
			<div class="container mx-auto px-4 pt-20">
				{@render children()}
			</div>
		{/if}
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
