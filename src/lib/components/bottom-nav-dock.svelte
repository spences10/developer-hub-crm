<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import {
		Calendar,
		Contacts,
		Dashboard,
		Message,
		User,
	} from '$lib/icons';

	const nav_items = [
		{ href: '/dashboard', label: 'Dashboard', icon: Dashboard },
		{ href: '/contacts', label: 'Contacts', icon: Contacts },
		{ href: '/follow-ups', label: 'Follow-ups', icon: Calendar },
		{ href: '/interactions', label: 'Activity', icon: Message },
		{ href: '/profile', label: 'Profile', icon: User },
	];

	function is_active(path: string) {
		return (
			page.url.pathname === path ||
			page.url.pathname.startsWith(path + '/')
		);
	}

	function navigate(href: string) {
		goto(href);
	}
</script>

<!-- Bottom navigation dock - only visible on mobile -->
<div class="dock z-40 lg:hidden">
	{#each nav_items as item}
		<button
			onclick={() => navigate(item.href)}
			class={is_active(item.href) ? 'dock-active' : ''}
		>
			<item.icon size="24px" />
			<span class="dock-label">{item.label}</span>
		</button>
	{/each}
</div>
