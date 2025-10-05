<script lang="ts">
	interface Props {
		title: string;
		value: number | string;
		subtitle?: string;
		badge?: {
			text: string;
			class: string;
		};
		link: string;
		link_text: string;
	}

	let { title, value, subtitle, badge, link, link_text }: Props =
		$props();
</script>

<div class="card bg-base-100 shadow-xl">
	<div class="card-body">
		<h2 class="card-title text-lg">{title}</h2>
		{#if subtitle}
			<div class="flex items-baseline gap-3">
				<p class="text-4xl font-bold">{value}</p>
				<p class="text-sm opacity-70">{subtitle}</p>
			</div>
		{:else}
			<p class="text-4xl font-bold">{value}</p>
		{/if}
		{#if badge}
			<div class="badge {badge.class}">
				{badge.text}
			</div>
		{/if}
		<div class="card-actions justify-end">
			<a href={link} class="link text-sm link-primary">
				{link_text}
			</a>
		</div>
	</div>
</div>
