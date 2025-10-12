<script lang="ts">
	import { ContactBook } from '$lib/icons';
	import SocialLinkIcon from '$lib/components/social-link.svelte';
	import type { DateFormat } from '$lib/utils/date-helpers';
	import { format_date } from '$lib/utils/date-helpers';

	interface SocialLink {
		platform: string;
		url: string;
	}

	interface Props {
		email: string | null;
		phone: string | null;
		birthday: string | null;
		company: string | null;
		title: string | null;
		social_links: SocialLink[] | null;
		date_format: DateFormat;
	}

	let {
		email,
		phone,
		birthday,
		company,
		title,
		social_links,
		date_format,
	}: Props = $props();
</script>

{#snippet detail_field( label: string, value: string | null, is_link: boolean = false, link_prefix: string = '', )}
	{#if value}
		<div>
			<p class="mb-1 text-xs font-semibold uppercase opacity-60">
				{label}
			</p>
			{#if is_link}
				<a href="{link_prefix}{value}" class="link text-sm link-primary">
					{value}
				</a>
			{:else}
				<p class="text-sm">{value}</p>
			{/if}
		</div>
	{/if}
{/snippet}

<div class="card bg-base-100 shadow-xl">
	<div class="card-body">
		<h2 class="mb-4 card-title flex items-center gap-2">
			<ContactBook size="24px" />
			Contact Details
		</h2>

		<div class="space-y-4">
			{@render detail_field('Email', email, true, 'mailto:')}
			{@render detail_field('Phone', phone, true, 'tel:')}
			{@render detail_field(
				'Birthday',
				birthday ? format_date(new Date(birthday), date_format) : null,
			)}
			{@render detail_field('Company', company)}
			{@render detail_field('Title', title)}

			{#if social_links && social_links.length > 0}
				<div>
					<p class="mb-2 text-xs font-semibold uppercase opacity-60">
						Social Links
					</p>
					<div class="flex flex-wrap gap-2">
						{#each social_links as link}
							<a
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								class="badge gap-1 badge-outline"
							>
								<SocialLinkIcon platform={link.platform} />
								{link.platform}
							</a>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
