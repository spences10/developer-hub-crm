<script lang="ts">
	import { Head } from 'svead';
	import { CheckCircleFill } from '$lib/icons';
	import AuthFeatureCard from '$lib/components/auth-feature-card.svelte';
	import AuthHeroPanel from '$lib/components/auth-hero-panel.svelte';
	import Logo from '$lib/logo.svelte';
	import { register } from '../../auth.remote';
	import { seo_configs } from '$lib/seo';

	const features = [
		{
			title: 'Unlimited contacts',
			description:
				'Manage all your developer relationships in one place',
			stagger: '3',
		},
		{
			title: 'Track interactions',
			description:
				'Log meetings, calls, and conversations effortlessly',
			stagger: '4',
		},
		{
			title: 'Never miss follow-ups',
			description: 'Automated reminders keep you connected',
			stagger: '4',
		},
		{
			title: 'GitHub integration',
			description:
				'Import contacts directly from your GitHub network',
			stagger: '4',
		},
	];
</script>

<Head seo_config={seo_configs.register} />

<div class="fixed inset-0 flex min-h-screen">
	<!-- Left Panel - Branding -->
	<AuthHeroPanel>
		<div class="animate-fade-in mb-10 opacity-0">
			<Logo size="90px" class_names="-ml-4 drop-shadow-lg" />
		</div>

		<h1
			class="animate-fade-in-up stagger-1 mb-6 text-5xl leading-tight font-extrabold text-primary-content opacity-0 drop-shadow-md"
		>
			Create your free account
		</h1>

		<p
			class="animate-fade-in-up stagger-2 mb-12 text-xl leading-relaxed font-medium text-primary-content opacity-0 drop-shadow"
		>
			Explore Devhub CRM's core features for managing your developer
			relationships.
		</p>

		<div class="space-y-5">
			{#each features as feature}
				<AuthFeatureCard
					icon={CheckCircleFill}
					title={feature.title}
					description={feature.description}
					stagger={feature.stagger}
				/>
			{/each}
		</div>
	</AuthHeroPanel>

	<!-- Right Panel - Form -->
	<div
		class="flex w-full items-center justify-center bg-base-100 p-8 lg:w-1/2"
	>
		<div class="w-full max-w-md">
			<!-- Mobile logo -->
			<div class="animate-fade-in mb-8 opacity-0 lg:hidden">
				<Logo size="60px" class_names="mx-auto" />
			</div>

			<div class="animate-fade-in-up stagger-1 mb-8 opacity-0">
				<h2 class="mb-2 text-3xl font-bold text-base-content">
					Get started
				</h2>
				<p class="text-base-content/60">
					Create your account to begin
				</p>
			</div>

			{#snippet formField(
				label: string,
				type: string,
				name: string,
				placeholder: string,
				hint?: string,
			)}
				<fieldset class="fieldset">
					<legend class="fieldset-legend font-semibold"
						>{label}</legend
					>
					<label
						class="input-bordered validator input w-full shadow-sm transition-all duration-300 focus-within:scale-[1.02] focus-within:shadow-md focus-within:ring-2 focus-within:ring-primary/20"
					>
						<input
							{type}
							{name}
							{placeholder}
							class="grow"
							required
							minlength={type === 'password' ? 8 : undefined}
						/>
					</label>
					{#if hint}
						<p class="label text-base-content/60">{hint}</p>
					{/if}
				</fieldset>
			{/snippet}

			<form
				{...register}
				class="animate-fade-in-up stagger-2 space-y-5 opacity-0"
			>
				{@render formField('Name', 'text', 'name', 'Enter your name')}
				{@render formField(
					'Email',
					'email',
					'email',
					'you@example.com',
				)}
				{@render formField(
					'Password',
					'password',
					'password',
					'Create a secure password',
					'Must be at least 8 characters',
				)}

				<button
					class="btn mt-8 btn-block shadow-lg transition-all duration-300 btn-lg btn-primary hover:scale-105 hover:shadow-xl active:scale-95"
					type="submit"
				>
					Create Account
				</button>
			</form>

			<div
				class="animate-fade-in stagger-3 divider text-base-content/40 opacity-0"
			>
				or
			</div>

			<p
				class="animate-fade-in stagger-4 text-center text-base-content/70 opacity-0"
			>
				Already have an account?
				<a
					href="/login"
					class="inline-block link font-semibold link-primary transition-transform duration-200 hover:scale-105"
					>Sign in</a
				>
			</p>
		</div>
	</div>
</div>
