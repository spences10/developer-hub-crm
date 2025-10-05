<script lang="ts">
	interface Props {
		back_href: string;
		back_text: string;
		title: string;
	}

	let { back_href, back_text, title }: Props = $props();
</script>

<div class="mb-8">
	<a href={back_href} class="link link-hover">
		&larr; {back_text}
	</a>
	<h1 class="mt-4 text-3xl font-bold">{title}</h1>
</div>
