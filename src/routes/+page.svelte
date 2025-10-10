<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		Balloon,
		Calendar,
		CheckCircleFill,
		ContactBook,
		Contacts,
		Dashboard,
		GitHub,
		Lightbulb,
		Monitor,
		Rocket,
		Sparkles,
		StarFill,
		Target,
		ThumbsUp,
	} from '$lib/icons';
	import Logo from '$lib/logo.svelte';
	import { seo_configs } from '$lib/seo';
	import { Head } from 'svead';
	import { demo_login, get_current_user } from './auth.remote';

	async function handle_demo_login() {
		const result = await demo_login();
		if (result.success) {
			goto('/dashboard');
		}
	}

	const features = [
		{
			icon: Contacts,
			title: 'Build Your Network',
			description:
				'Turn GitHub connections into real relationships. Import contacts and track every interaction that could lead to your next opportunity.',
		},
		{
			icon: Dashboard,
			title: 'Stay Top of Mind',
			description:
				'Log coffees, conference chats, and DMs. When hiring managers think of candidates, make sure they think of you.',
		},
		{
			icon: Calendar,
			title: 'Never Ghost Again',
			description:
				'Smart reminders ensure you follow up on time. That "let\'s grab coffee" becomes an actual coffee—and maybe a referral.',
		},
		{
			icon: GitHub,
			title: 'GitHub-First CRM',
			description:
				'Import your GitHub network instantly. See who works where, track contributions, and identify warm introductions to companies you want.',
		},
	];

	const benefits = [
		'Turn GitHub followers into job referrals',
		'Track who works where and when to reach out',
		'Never miss a follow-up with hiring managers',
		'Build relationships before you need them',
		'CLI tool for quick logging between commits',
		'QR code profiles for conference networking',
	];

	// Floating party elements for logged-in view
	const floating_elements = [
		{
			icon: Rocket,
			size: '64px',
			opacity: 'opacity-30',
			animation: 'animate-float-medium',
			position: 'top-[10%] left-[5%]',
		},
		{
			icon: StarFill,
			size: '56px',
			opacity: 'opacity-30',
			animation: 'animate-float-medium',
			position: 'top-[15%] right-[8%]',
		},
		{
			icon: Monitor,
			size: '64px',
			opacity: 'opacity-30',
			animation: 'animate-float-medium',
			position: 'top-[70%] left-[15%]',
		},
		{
			icon: Sparkles,
			size: '56px',
			opacity: 'opacity-30',
			animation: 'animate-float-medium',
			position: 'top-[60%] right-[12%]',
		},
		{
			icon: Target,
			size: '48px',
			opacity: 'opacity-20',
			animation: 'animate-float-medium',
			position: 'top-[5%] left-[50%]',
		},
		{
			icon: Balloon,
			size: '56px',
			opacity: 'opacity-30',
			animation: 'animate-float-medium',
			position: 'right-[20%] bottom-[15%]',
		},
		{
			icon: ThumbsUp,
			size: '48px',
			opacity: 'opacity-20',
			animation: 'animate-float-medium',
			position: 'bottom-[20%] left-[25%]',
		},
		{
			icon: Lightbulb,
			size: '56px',
			opacity: 'opacity-30',
			animation: 'animate-float-medium',
			position: 'right-[40%] bottom-[10%]',
		},
	];

	const gradient_orbs = [
		{
			size: 'size-64',
			color: 'from-primary/20',
			animation: 'animate-float-slow',
			position: 'top-[30%] left-[20%]',
		},
		{
			size: 'size-72',
			color: 'from-secondary/20',
			animation: 'animate-float-medium',
			position: 'top-[40%] right-[20%]',
		},
		{
			size: 'size-56',
			color: 'from-accent/20',
			animation: 'animate-float-fast',
			position: 'bottom-[20%] left-[30%]',
		},
	];
</script>

<Head seo_config={seo_configs.home} />

{#await get_current_user() then user}
	{#if user}
		<!-- Logged in user view - Easter egg delight! -->
		<div
			class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10"
		>
			<!-- Floating party elements -->
			{#each floating_elements as element}
				<div
					class="absolute {element.position} {element.opacity} {element.animation}"
				>
					<element.icon
						size={element.size}
						class_names="text-base-content/50"
					/>
				</div>
			{/each}

			<!-- Animated gradient orbs -->
			{#each gradient_orbs as orb}
				<div
					class="absolute rounded-full bg-gradient-to-br to-transparent blur-3xl {orb.position} {orb.size} {orb.color} {orb.animation}"
				></div>
			{/each}

			<div class="relative z-10 text-center">
				<!-- Logo with pulse animation -->
				<div class="animate-fade-in mb-8 opacity-0">
					<div class="animate-pulse-gentle">
						<Logo
							size="120px"
							class_names="mx-auto drop-shadow-2xl"
						/>
					</div>
				</div>

				<!-- Greeting with gradient text -->
				<h1
					class="animate-fade-in-up stagger-1 mb-4 text-6xl font-extrabold opacity-0 lg:text-7xl"
				>
					<span
						class="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent drop-shadow-lg"
					>
						Welcome back, {user.name}!
					</span>
				</h1>

				<!-- Animated message -->
				<div class="animate-fade-in-up stagger-2 mb-8 opacity-0">
					<p class="mb-2 text-2xl font-medium text-base-content/80">
						Ready to level up your network?
					</p>
					<p class="text-sm font-medium text-base-content/50">
						(We didn't need to make this page special, but here we are
						😊)
					</p>
				</div>

				<!-- CTA with hover effects -->
				<a
					href="/dashboard"
					class="animate-fade-in-up stagger-3 group btn relative overflow-hidden opacity-0 shadow-2xl transition-all duration-300 btn-lg btn-primary hover:scale-110 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]"
				>
					<span class="relative z-10 flex items-center gap-2">
						<Dashboard size="24px" />
						Go to Dashboard
					</span>
					<!-- Animated shine effect -->
					<div
						class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
					></div>
				</a>

				<!-- Fun stats or Easter egg message -->
				<div class="animate-fade-in stagger-4 mt-12 opacity-0">
					<div
						class="inline-block rounded-box border border-base-300 bg-base-100/80 px-8 py-4 shadow-xl backdrop-blur-sm"
					>
						<p class="text-sm font-semibold text-base-content/70">
							You found the secret welcome screen! 🎊
						</p>
						<p class="mt-1 text-xs text-base-content/50">
							Most users never see this because they go straight to
							the dashboard.
						</p>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<!-- Landing page for non-logged in users -->
		<div class="min-h-screen bg-base-100">
			<!-- Hero Section -->
			<section
				class="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent px-6 py-20 lg:py-32"
			>
				<!-- Decorative background pattern -->
				<div
					class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"
				></div>
				<div
					class="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,0,0,0.15),transparent_50%)]"
				></div>

				<!-- Floating animated shapes -->
				<div
					class="animate-float-slow absolute top-[20%] left-[10%] size-32 rounded-full bg-accent/30 blur-2xl"
				></div>
				<div
					class="animate-float-medium absolute top-[30%] right-[15%] size-40 rounded-full bg-info/30 blur-2xl"
				></div>
				<div
					class="animate-float-fast absolute bottom-[20%] left-[20%] size-36 rounded-full bg-secondary/30 blur-2xl"
				></div>
				<div
					class="animate-float-slow absolute right-[10%] bottom-[30%] size-28 rounded-full bg-success/30 blur-2xl"
				></div>

				<div
					class="relative z-10 mx-auto max-w-6xl text-center text-primary-content"
				>
					<div class="animate-fade-in mb-12 opacity-0">
						<Logo size="180px" class_names="mx-auto drop-shadow-lg" />
					</div>

					<h1
						class="animate-fade-in-up stagger-1 mb-6 text-5xl leading-tight font-extrabold opacity-0 drop-shadow-md lg:text-7xl"
					>
						Network Your Way to Your Next Role
					</h1>

					<p
						class="animate-fade-in-up stagger-2 mx-auto mb-12 max-w-3xl text-xl leading-relaxed font-medium opacity-0 drop-shadow lg:text-2xl"
					>
						Land your next developer job by nurturing authentic
						relationships. Track every conversation, stay top-of-mind
						with key contacts, and turn your GitHub network into real
						opportunities.
					</p>

					<div
						class="animate-fade-in-up stagger-3 flex flex-col gap-4 opacity-0 sm:flex-row sm:justify-center"
					>
						<a
							href="/register"
							class="btn gap-2 shadow-2xl transition-all duration-300 btn-lg btn-neutral hover:scale-105 hover:shadow-xl"
						>
							<Rocket size="24px" />
							Get Started Free
						</a>
						<button
							onclick={handle_demo_login}
							class="btn gap-2 border-2 border-accent-content bg-accent text-accent-content shadow-2xl transition-all duration-300 btn-lg hover:scale-105 hover:shadow-xl"
						>
							<Sparkles size="24px" />
							Try Demo - No Signup
						</button>
						<a
							href="/login"
							class="btn gap-2 border-2 border-primary-content text-primary-content shadow-lg transition-all duration-300 btn-outline btn-lg hover:scale-105 hover:bg-primary-content/10"
						>
							Sign In
						</a>
					</div>

					<p
						class="animate-fade-in stagger-4 mt-6 text-sm text-primary-content/80 opacity-0"
					>
						No credit card required. Try the demo instantly or create
						a free account.
					</p>
				</div>
			</section>

			<!-- Features Section -->
			<section class="px-6 py-20">
				<div class="mx-auto max-w-6xl">
					<div class="mb-16 text-center">
						<h2
							class="mb-4 text-4xl font-extrabold text-base-content lg:text-5xl"
						>
							Everything You Need
						</h2>
						<p class="text-xl text-base-content/70">
							Built specifically for how developers work and network
						</p>
					</div>

					<div
						class="grid gap-6 md:grid-cols-2 lg:grid-cols-2 lg:gap-8"
					>
						{#each features as feature, i}
							<div
								class="animate-fade-in-up stagger-{i +
									1} group rounded-box border border-base-300 bg-base-200 p-8 opacity-0 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-primary/40 hover:shadow-2xl"
							>
								<div
									class="mb-4 inline-block rounded-box bg-primary/10 p-4 transition-all duration-300 group-hover:bg-primary/20"
								>
									<feature.icon
										size="32px"
										class_names="text-primary"
									/>
								</div>
								<h3 class="mb-3 text-2xl font-bold text-base-content">
									{feature.title}
								</h3>
								<p class="leading-relaxed text-base-content/80">
									{feature.description}
								</p>
							</div>
						{/each}
					</div>
				</div>
			</section>

			<!-- Developer Benefits Section -->
			<section
				class="border-y border-base-300 bg-base-200 px-6 py-20 shadow-inner"
			>
				<div class="mx-auto max-w-6xl">
					<div class="grid items-center gap-12 lg:grid-cols-2">
						<div>
							<div
								class="mb-6 inline-block rounded-full bg-primary/10 p-4"
							>
								<ContactBook size="48px" class_names="text-primary" />
							</div>
							<h2
								class="mb-6 text-4xl font-extrabold text-base-content lg:text-5xl"
							>
								The Best Jobs Come From People, Not Job Boards
							</h2>
							<p
								class="mb-8 text-xl leading-relaxed text-base-content/70"
							>
								Most developer jobs are filled through referrals.
								Devhub helps you build and maintain the relationships
								that land you those opportunities.
							</p>

							<div class="space-y-4">
								{#each benefits as benefit}
									<div class="flex items-start gap-4">
										<CheckCircleFill
											size="24px"
											class_names="mt-1 flex-shrink-0 text-success"
										/>
										<p class="text-lg text-base-content/90">
											{benefit}
										</p>
									</div>
								{/each}
							</div>
						</div>

						<div
							class="rounded-box border border-base-300 bg-base-100 p-8 shadow-2xl lg:p-12"
						>
							<div class="space-y-6">
								<div
									class="rounded-box border border-base-300 bg-base-200/50 p-6"
								>
									<div class="mb-3 flex items-center gap-3">
										<GitHub
											size="32px"
											class_names="text-base-content"
										/>
										<h3 class="text-xl font-bold text-base-content">
											GitHub Integration
										</h3>
									</div>
									<p class="text-base-content/70">
										Import your network in seconds. Track
										contributions, stars, and collaborations
										automatically.
									</p>
								</div>

								<div
									class="rounded-box border border-base-300 bg-base-200/50 p-6"
								>
									<h3
										class="mb-3 text-xl font-bold text-base-content"
									>
										CLI Tool (Coming Soon)
									</h3>
									<code
										class="block rounded bg-base-300 p-3 font-mono text-sm text-base-content/90"
									>
										$ devhub log @username "met at conf"
									</code>
								</div>

								<div
									class="rounded-box border border-base-300 bg-base-200/50 p-6"
								>
									<h3
										class="mb-3 text-xl font-bold text-base-content"
									>
										Your Data, Your Control
									</h3>
									<p class="text-base-content/70">
										SQLite database. Full export anytime. Self-host if
										you want. Zero lock-in.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- Final CTA Section -->
			<section class="px-6 py-20">
				<div
					class="mx-auto max-w-4xl rounded-box border border-primary/20 bg-gradient-to-br from-primary to-primary/80 p-12 text-center shadow-2xl lg:p-16"
				>
					<!-- Decorative background -->
					<div
						class="absolute inset-0 rounded-box bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),transparent_70%)]"
					></div>

					<div class="relative z-10">
						<h2
							class="mb-6 text-4xl leading-tight font-extrabold text-primary-content drop-shadow-md lg:text-5xl"
						>
							Your Next Job Starts With Better Relationships
						</h2>
						<p
							class="mb-10 text-xl leading-relaxed font-medium text-primary-content/90 drop-shadow"
						>
							Stop mass-applying on job boards. Build genuine
							connections that lead to referrals, introductions, and
							opportunities you won't find anywhere else.
						</p>

						<div
							class="flex flex-col gap-4 sm:flex-row sm:justify-center"
						>
							<a
								href="/register"
								class="btn gap-2 shadow-2xl transition-all duration-300 btn-lg btn-neutral hover:scale-105 hover:shadow-xl"
							>
								<Rocket size="24px" />
								Create Free Account
							</a>
							<button
								onclick={handle_demo_login}
								class="btn gap-2 border-2 border-base-100 text-base-100 shadow-2xl transition-all duration-300 btn-outline btn-lg hover:scale-105 hover:bg-base-100/10"
							>
								<Sparkles size="24px" />
								Try Demo Now
							</button>
							<a
								href="/login"
								class="btn border-2 border-primary-content text-primary-content shadow-lg transition-all duration-300 btn-outline btn-lg hover:scale-105 hover:bg-primary-content/10"
							>
								Sign In
							</a>
						</div>

						<p
							class="mt-8 text-sm font-medium text-primary-content/80"
						>
							Free forever for core features. Premium features coming
							soon.
						</p>
					</div>
				</div>
			</section>

			<!-- Footer -->
			<footer class="border-t border-base-300 px-6 py-8">
				<div
					class="mx-auto max-w-6xl text-center text-sm text-base-content/60"
				>
					<p>
						&copy; {new Date().getFullYear()} Devhub CRM. Built for developers,
						by developers.
					</p>
				</div>
			</footer>
		</div>
	{/if}
{/await}
