<script lang="ts">
	import { page } from '$app/state';
	import { Menu } from '$lib/icons';

	// Props to control navigation behavior
	const {
		fixed = true,
		show_landing_links = false,
		show_back_button = false,
		back_url = '/contacts',
		back_text = 'Back to Contacts',
		rounded = false,
		user = null,
	} = $props();

	// Determine if we're on the landing page
	const is_landing_page = $derived(page.url.pathname === '/');

	// Determine if we're on an authenticated page
	const is_auth_page = $derived(
		page.url.pathname.startsWith('/auth'),
	);

	// Determine if we're on a dashboard or contacts page
	const is_dashboard_page = $derived(
		page.url.pathname.startsWith('/dashboard'),
	);
	const is_contacts_page = $derived(
		page.url.pathname.startsWith('/contacts') &&
			!page.url.pathname.includes('/contacts/'),
	);
	const is_contact_detail_page = $derived(
		page.url.pathname.startsWith('/contacts/') &&
			page.url.pathname !== '/contacts',
	);

	// Get user initial for avatar
	function get_user_initial() {
		if (!user || !user.username) return '?';
		return user.username.charAt(0).toUpperCase();
	}
</script>

{#if !is_auth_page}
	<div
		class="navbar bg-base-100 {fixed
			? 'fixed top-0 z-50'
			: ''} {rounded ? 'rounded-box' : ''} shadow-md {rounded
			? 'mb-6'
			: ''}"
	>
		<div class="navbar-start">
			{#if show_back_button}
				<a href={back_url} class="btn btn-ghost">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 19l-7-7m0 0l7-7m-7 7h18"
						/>
					</svg>
					{back_text}
				</a>
			{:else if show_landing_links || is_landing_page}
				<div class="dropdown">
					<label for="mobile-menu" class="btn btn-ghost lg:hidden">
						<Menu class_names="h-5 w-5" />
					</label>
					<ul
						id="mobile-menu"
						class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
					>
						<li><a href="#features">Features</a></li>
						<li><a href="#testimonials">Testimonials</a></li>
						<li><a href="#pricing">Pricing</a></li>
					</ul>
				</div>
			{/if}
			<a
				href={is_dashboard_page ||
				is_contacts_page ||
				is_contact_detail_page
					? '/dashboard'
					: '/'}
				class="btn btn-ghost text-xl">Developer Hub CRM</a
			>
		</div>

		{#if show_landing_links || is_landing_page}
			<div class="navbar-center hidden lg:flex">
				<ul class="menu menu-horizontal px-1">
					<li><a href="#features">Features</a></li>
					<li><a href="#testimonials">Testimonials</a></li>
					<li><a href="#pricing">Pricing</a></li>
				</ul>
			</div>
		{/if}

		<div class="navbar-end">
			{#if is_dashboard_page}
				<a href="/contacts" class="btn btn-ghost btn-sm">Contacts</a>
				<a href="/analytics" class="btn btn-ghost btn-sm">Analytics</a
				>
			{/if}

			{#if is_dashboard_page || is_contacts_page}
				<div class="dropdown dropdown-end">
					<label
						for="user-menu"
						class="btn btn-ghost btn-circle avatar placeholder"
					>
						<div
							class="bg-neutral text-neutral-content w-10 rounded-full"
						>
							<span>{get_user_initial()}</span>
						</div>
					</label>
					<ul
						id="user-menu"
						class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
					>
						<li><a href="/profile">Profile</a></li>
						<li>
							<form method="POST" action="/auth?/logout">
								<button type="submit" class="w-full text-left">
									Logout
								</button>
							</form>
						</li>
					</ul>
				</div>
			{:else if !is_auth_page && !is_contact_detail_page}
				<a href="/auth/login" class="btn btn-ghost">Login</a>
				<a href="/auth/register" class="btn btn-primary">Register</a>
			{/if}
		</div>
	</div>
{/if}
