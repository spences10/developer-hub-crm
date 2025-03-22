<script lang="ts">
	import { Twitter, YouTube, Facebook } from '$lib/icons'
</script>

<footer class="bg-neutral text-neutral-content">
	<div class="container mx-auto px-4">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-10">
			<div>
				<h6 class="footer-title">Services</h6> 
				<ul class="space-y-2 mt-3">
					<li><a href="/services/contact-management" class="link link-hover">Developer Contact Management</a></li>
					<li><a href="/services/event-tracking" class="link link-hover">Event Tracking</a></li>
					<li><a href="/services/analytics" class="link link-hover">Analytics</a></li>
					<li><a href="/services/api-integration" class="link link-hover">API Integration</a></li>
				</ul>
			</div> 
			<div>
				<h6 class="footer-title">Company</h6> 
				<ul class="space-y-2 mt-3">
					<li><a href="/about" class="link link-hover">About us</a></li>
					<li><a href="/contact" class="link link-hover">Contact</a></li>
					<li><a href="/careers" class="link link-hover">Jobs</a></li>
					<li><a href="/press" class="link link-hover">Press kit</a></li>
				</ul>
			</div> 
			<div>
				<h6 class="footer-title">Legal</h6> 
				<ul class="space-y-2 mt-3">
					<li><a href="/terms" class="link link-hover">Terms of use</a></li>
					<li><a href="/privacy" class="link link-hover">Privacy policy</a></li>
					<li><a href="/cookies" class="link link-hover">Cookie policy</a></li>
				</ul>
			</div>
			<div>
				<h6 class="footer-title">Social</h6>
				<div class="flex gap-4 mt-3">
					<a href="https://twitter.com/devhubcrm" aria-label="Twitter">
						<Twitter class_names="fill-current" />
					</a>
					<a href="https://youtube.com/devhubcrm" aria-label="YouTube">
						<YouTube class_names="fill-current" />
					</a>
					<a href="https://facebook.com/devhubcrm" aria-label="Facebook">
						<Facebook class_names="fill-current" />
					</a>
				</div>
			</div>
		</div>
	</div>

	<div class="bg-base-300 py-4">
		<div class="container mx-auto px-4 text-center text-base-content">
			<p>Copyright 2025 - Developer Hub CRM. All rights reserved.</p>
		</div>
	</div>
</footer>
