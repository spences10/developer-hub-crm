<script lang="ts">
	const scroll_to_section = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	};
</script>

<!-- Modern hero section with gradient background and animated elements -->
<div class="full-width-section">
	<div class="hero bg-base-200 min-h-screen">
		<div class="absolute inset-0 overflow-hidden">
			<div
				class="from-primary/20 via-base-200 to-secondary/20 absolute -inset-[10px] bg-gradient-to-br opacity-50"
			></div>
			<!-- Decorative elements -->
			<div
				class="bg-primary/10 absolute top-20 left-10 h-64 w-64 rounded-full blur-3xl"
			></div>
			<div
				class="bg-secondary/10 absolute right-10 bottom-20 h-64 w-64 rounded-full blur-3xl"
			></div>
		</div>

		<div
			class="hero-content flex-col gap-8 text-center lg:flex-row-reverse lg:gap-12 lg:text-left"
		>
			<!-- Illustration/Image side -->
			<div class="relative max-w-md">
				<div class="mockup-code bg-base-300 shadow-lg">
					<pre data-prefix="$" class="text-success"><code
							>npm install developer-hub-crm</code
						></pre>
					<pre data-prefix=">" class="text-warning"><code
							>Installing dependencies...</code
						></pre>
					<pre data-prefix=">" class="text-success"><code
							>Developer Hub CRM ready!</code
						></pre>
				</div>
				<div class="badge badge-primary absolute -top-2 -right-2">
					New
				</div>
			</div>

			<!-- Text content side -->
			<div class="max-w-md">
				<h1
					class="mb-5 text-4xl font-extrabold tracking-tight sm:text-5xl"
				>
					<span class="text-primary">Developer</span> Hub CRM
				</h1>
				<p class="mb-8 text-lg">
					Streamline your developer relations with our powerful CRM
					designed specifically for technical teams and developer
					advocates.
				</p>
				<div class="flex flex-col gap-4 sm:flex-row">
					<button
						class="btn btn-primary"
						on:click={() => scroll_to_section('features')}
					>
						Explore Features
					</button>
					<a href="/auth/register" class="btn btn-outline">
						Get Started
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
