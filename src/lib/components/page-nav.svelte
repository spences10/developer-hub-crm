<script lang="ts">
	import { page } from '$app/stores';
	import {
		Calendar,
		Contacts,
		Dashboard,
		Message,
		Settings,
		User,
	} from '$lib/icons';

	const nav_items = [
		{ href: '/dashboard', label: 'Dashboard', icon: Dashboard },
		{ href: '/contacts', label: 'Contacts', icon: Contacts },
		{ href: '/interactions', label: 'Interactions', icon: Message },
		{ href: '/follow-ups', label: 'Follow-ups', icon: Calendar },
		{ href: '/profile', label: 'Profile', icon: User },
		{ href: '/settings', label: 'Settings', icon: Settings },
	];

	function is_active(path: string) {
		return (
			$page.url.pathname === path ||
			$page.url.pathname.startsWith(path + '/')
		);
	}
</script>

<div class="mb-6 flex flex-wrap items-center gap-2 text-sm">
	{#each nav_items as item, index}
		{#if index > 0}
			<span class="opacity-50">•</span>
		{/if}
		<a
			href={item.href}
			class="flex items-center gap-1.5 {is_active(item.href)
				? 'font-semibold text-primary'
				: 'link link-hover'}"
		>
			<item.icon size="16px" />
			{item.label}
		</a>
	{/each}
</div>
