<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div
	class="relative hidden w-1/2 flex-col justify-center overflow-hidden bg-gradient-to-br from-primary to-primary p-12 lg:flex"
>
	<!-- Decorative background pattern -->
	<div
		class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_50%)]"
	></div>
	<div
		class="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,0,0,0.15),transparent_50%)]"
	></div>

	<div class="relative z-10 mx-auto max-w-lg">
		{@render children()}
	</div>
</div>

<style>
	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes scaleIn {
		from {
			opacity: 0;
			transform: scale(0.5);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	:global(.animate-fade-in-up) {
		animation: fadeInUp 0.6s ease-out forwards;
	}

	:global(.animate-fade-in) {
		animation: fadeIn 0.8s ease-out forwards;
	}

	:global(.animate-scale-in) {
		animation: scaleIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)
			forwards;
	}

	:global(.animate-float) {
		animation: float 3s ease-in-out infinite;
	}

	:global(.stagger-1) {
		animation-delay: 0.1s;
	}

	:global(.stagger-2) {
		animation-delay: 0.2s;
	}

	:global(.stagger-3) {
		animation-delay: 0.3s;
	}

	:global(.stagger-4) {
		animation-delay: 0.4s;
	}

	:global(.stagger-5) {
		animation-delay: 0.5s;
	}
</style>
