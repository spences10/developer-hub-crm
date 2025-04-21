<script lang="ts">
	const scroll_to_section = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	};
</script>

<!-- Full-width hero section that breaks out of the container -->
<div class="full-width-section">
	<div
		class="hero min-h-screen"
		style="background-image: url(https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop);"
	>
		<div class="hero-overlay bg-opacity-70"></div>
		<div class="hero-content text-neutral-content text-center">
			<div class="max-w-md">
				<h1 class="mb-5 text-5xl font-bold">Developer Hub CRM</h1>
				<p class="mb-5">
					Streamline your developer relations with our powerful CRM
					designed specifically for technical teams and developer
					advocates.
				</p>
				<div class="flex flex-col justify-center gap-4 sm:flex-row">
					<button
						class="btn btn-primary"
						on:click={() => scroll_to_section('features')}
						>Explore Features</button
					>
					<a
						href="/auth/register"
						class="btn btn-outline btn-secondary">Get Started</a
					>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Style moved to global app.css -->
