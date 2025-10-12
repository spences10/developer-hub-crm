<script lang="ts">
	import type { Component } from 'svelte';

	type Feature = {
		icon: Component;
		title: string;
		description: string;
	};

	type Props = {
		features: Feature[];
	};

	let { features }: Props = $props();
</script>

<section class="section-padding bg-base-100">
	<div class="mx-auto max-w-6xl">
		<div class="mb-12 text-center sm:mb-14 md:mb-16">
			<h2 class="section-title mb-3 text-base-content sm:mb-4">
				Everything You Need
			</h2>
			<p class="section-text text-base-content/70">
				Built specifically for how developers work and network
			</p>
		</div>

		<div class="grid gap-4 sm:gap-5 md:grid-cols-2 md:gap-6 lg:gap-8">
			{#each features as feature, i}
				<div
					class="animate-fade-in-up stagger-{i +
						1} group rounded-box border border-base-300 bg-base-200 p-6 opacity-0 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-primary/40 hover:shadow-2xl md:p-8"
				>
					<div
						class="mb-3 inline-block rounded-box bg-primary/10 p-3 transition-all duration-300 group-hover:bg-primary/20 sm:mb-4 sm:p-4"
					>
						<feature.icon
							size="28px"
							class_names="text-primary sm:w-[30px] sm:h-[30px] lg:w-[32px] lg:h-[32px]"
						/>
					</div>
					<h3
						class="mb-2 text-xl font-bold text-base-content sm:mb-3 sm:text-2xl"
					>
						{feature.title}
					</h3>
					<p
						class="text-sm leading-relaxed text-base-content/80 sm:text-base"
					>
						{feature.description}
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>
