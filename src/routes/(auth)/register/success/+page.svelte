<script lang="ts">
	import {
		CheckCircleFill,
		Email,
		InformationCircle,
	} from '$lib/icons';
	import Logo from '$lib/logo.svelte';
</script>

<div class="fixed inset-0 flex min-h-screen">
	<!-- Left Panel - Email Illustration -->
	<div
		class="to-primary-focus hidden w-1/2 flex-col justify-center bg-gradient-to-br from-primary p-12 lg:flex"
	>
		<div class="mx-auto max-w-lg">
			<div class="mb-8 text-center">
				<Email
					size="128px"
					class_names="mx-auto text-primary-content"
				/>
			</div>

			<h1
				class="mb-4 text-center text-4xl font-bold text-primary-content"
			>
				You're Almost There!
			</h1>
			<p class="mb-8 text-center text-lg text-primary-content/90">
				We've sent a verification link to your email. Click it to
				activate your account and start managing your developer
				relationships.
			</p>

			<div class="space-y-3 text-primary-content/90">
				<div class="flex items-center gap-3">
					<CheckCircleFill size="20px" class_names="flex-shrink-0" />
					<span>Check your inbox (and spam folder)</span>
				</div>
				<div class="flex items-center gap-3">
					<CheckCircleFill size="20px" class_names="flex-shrink-0" />
					<span>Click the verification link</span>
				</div>
				<div class="flex items-center gap-3">
					<CheckCircleFill size="20px" class_names="flex-shrink-0" />
					<span>Start building your CRM</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Right Panel - Instructions -->
	<div
		class="flex w-full items-center justify-center bg-base-100 p-8 lg:w-1/2"
	>
		<div class="w-full max-w-md">
			<!-- Mobile logo -->
			<div class="mb-8 lg:hidden">
				<Logo size="60px" class_names="mx-auto" />
			</div>

			<div class="text-center">
				<div class="mb-6 inline-block rounded-full bg-primary/10 p-4">
					<CheckCircleFill size="48px" class_names="text-primary" />
				</div>

				<h2 class="mb-4 text-2xl font-bold">Check Your Email</h2>

				<p class="mb-6 text-base-content/70">
					We've sent a verification link to your email address. Click
					the link to verify your account and get started.
				</p>

				<div class="mb-6 rounded-lg bg-info/10 p-4 text-left">
					<div class="flex gap-3">
						<InformationCircle
							size="20px"
							class_names="mt-0.5 flex-shrink-0 text-info"
						/>
						<div class="text-sm">
							<p class="font-semibold text-info">
								Didn't receive the email?
							</p>
							<p class="text-base-content/70">
								Check your spam or junk folder. The email should
								arrive within a few minutes.
							</p>
						</div>
					</div>
				</div>

				<a href="/login" class="btn mb-4 btn-block btn-primary">
					Back to Login
				</a>

				<p class="text-sm text-base-content/60">
					The verification link will expire in 24 hours
				</p>
			</div>
		</div>
	</div>
</div>
