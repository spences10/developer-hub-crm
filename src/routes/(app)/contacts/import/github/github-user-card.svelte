<script lang="ts">
	interface GitHubUser {
		login: string;
		name: string | null;
		avatar_url: string;
		bio: string | null;
		company: string | null;
		already_imported: boolean;
	}

	interface Props {
		user: GitHubUser;
		selected: boolean;
		on_toggle: (username: string) => void;
	}

	let { user, selected, on_toggle }: Props = $props();

	function get_initials(name: string | null | undefined): string {
		if (!name) return '?';
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}
</script>

<label
	class="card cursor-pointer bg-base-100 shadow transition-all hover:shadow-lg {user.already_imported
		? 'opacity-50'
		: ''}"
>
	<div class="card-body p-4">
		<div class="flex items-start gap-3">
			<input
				type="checkbox"
				class="checkbox"
				checked={selected}
				onchange={() => on_toggle(user.login)}
				disabled={user.already_imported}
			/>
			{#if user.avatar_url}
				<img
					src={user.avatar_url}
					alt="{user.name || user.login} avatar"
					class="size-12 rounded-full object-cover"
				/>
			{:else}
				<div
					class="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-bold text-primary-content"
				>
					{get_initials(user.name)}
				</div>
			{/if}
			<div class="flex-1 overflow-hidden">
				<div class="flex items-center gap-2">
					<span class="truncate font-medium">
						{user.name || user.login}
					</span>
					{#if user.already_imported}
						<span class="badge badge-sm"> Imported </span>
					{/if}
				</div>
				<a
					href="https://github.com/{user.login}"
					target="_blank"
					rel="noopener noreferrer"
					class="link text-xs link-primary"
					onclick={(e) => e.stopPropagation()}
				>
					@{user.login}
				</a>
				{#if user.bio}
					<p class="mt-1 line-clamp-2 text-xs text-base-content/70">
						{user.bio}
					</p>
				{/if}
				{#if user.company}
					<p class="mt-1 text-xs text-base-content/60">
						{user.company}
					</p>
				{/if}
			</div>
		</div>
	</div>
</label>
