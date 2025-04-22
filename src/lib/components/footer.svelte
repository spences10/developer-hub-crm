<script lang="ts">
	import { Facebook, Twitter, YouTube } from '$lib/icons';
</script>

<footer class="full-width-section bg-neutral text-neutral-content">
	<div class="container mx-auto px-4">
		<!-- Logo and newsletter section -->
		<div class="mx-auto max-w-4xl py-12 text-center">
			<a
				href="/"
				class="mb-6 inline-block text-2xl font-bold tracking-tight"
			>
				<span class="text-primary">Dev</span>Hub CRM
			</a>
			<p class="mb-8 text-lg opacity-80">
				The ultimate CRM for developer relations teams
			</p>

			<div class="join mx-auto max-w-md">
				<input
					class="input join-item bg-neutral-focus w-full"
					placeholder="Your email address"
				/>
				<button class="btn btn-primary join-item">Subscribe</button>
			</div>
		</div>

		<div class="divider opacity-20"></div>

		<!-- Links section -->
		<div class="footer py-10">
			<div>
				<span class="footer-title">Services</span>
				<a href="/services/contact-management" class="link link-hover"
					>Developer Contact Management</a
				>
				<a href="/services/event-tracking" class="link link-hover"
					>Event Tracking</a
				>
				<a href="/services/analytics" class="link link-hover"
					>Analytics</a
				>
				<a href="/services/api-integration" class="link link-hover"
					>API Integration</a
				>
			</div>
			<div>
				<span class="footer-title">Company</span>
				<a href="/about" class="link link-hover">About us</a>
				<a href="/contact" class="link link-hover">Contact</a>
				<a href="/careers" class="link link-hover">Jobs</a>
				<a href="/press" class="link link-hover">Press kit</a>
			</div>
			<div>
				<span class="footer-title">Legal</span>
				<a href="/terms" class="link link-hover">Terms of use</a>
				<a href="/privacy" class="link link-hover">Privacy policy</a>
				<a href="/cookies" class="link link-hover">Cookie policy</a>
			</div>
			<div>
				<span class="footer-title">Social</span>
				<div class="flex gap-4">
					<a
						href="https://twitter.com/devhubcrm"
						class="btn btn-circle btn-ghost btn-sm"
						aria-label="Twitter"
					>
						<Twitter class_names="h-5 w-5 fill-current" />
					</a>
					<a
						href="https://youtube.com/devhubcrm"
						class="btn btn-circle btn-ghost btn-sm"
						aria-label="YouTube"
					>
						<YouTube class_names="h-5 w-5 fill-current" />
					</a>
					<a
						href="https://facebook.com/devhubcrm"
						class="btn btn-circle btn-ghost btn-sm"
						aria-label="Facebook"
					>
						<Facebook class_names="h-5 w-5 fill-current" />
					</a>
				</div>
			</div>
		</div>
	</div>

	<div class="bg-neutral-focus py-6">
		<div
			class="container mx-auto px-4 text-center text-sm opacity-60"
		>
			<p>© 2025 Developer Hub CRM. All rights reserved.</p>
		</div>
	</div>
</footer>
