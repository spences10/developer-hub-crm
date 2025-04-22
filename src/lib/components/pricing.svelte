<script lang="ts">
	import { Checkmark } from '$lib/icons';
</script>

<section id="pricing" class="full-width-section bg-base-200 py-24">
	<div class="container mx-auto px-4">
		<div class="mb-16 text-center">
			<h2 class="mb-4 text-4xl font-extrabold tracking-tight">
				Developer-Friendly Pricing
			</h2>
			<p class="mx-auto max-w-2xl text-lg opacity-80">
				Simple, transparent pricing that scales with your team. No
				hidden fees or complicated tiers.
			</p>
		</div>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			<!-- Starter Plan -->
			<div class="card bg-base-100 border-base-300 border shadow-sm">
				<div class="card-body p-8">
					<h3 class="mb-2 text-2xl font-bold">Starter</h3>
					<p class="mb-6 text-sm opacity-70">
						Perfect for individual developers
					</p>
					<div class="mb-6">
						<span class="text-5xl font-extrabold">$19</span>
						<span class="text-base opacity-70">/month</span>
					</div>

					<div class="divider"></div>

					<ul class="mb-8 space-y-4">
						<li class="flex items-start">
							<Checkmark
								height="20px"
								width="20px"
								class_names="text-success mt-1 mr-3 flex-shrink-0"
							/>
							<span>Up to 250 contacts</span>
						</li>
						<li class="flex items-start">
							<Checkmark
								height="20px"
								width="20px"
								class_names="text-success mt-1 mr-3 flex-shrink-0"
							/>
							<span>Basic networking analytics</span>
						</li>
						<li class="flex items-start">
							<Checkmark
								height="20px"
								width="20px"
								class_names="text-success mt-1 mr-3 flex-shrink-0"
							/>
							<span>Conference mode</span>
						</li>
						<li class="flex items-start">
							<Checkmark
								height="20px"
								width="20px"
								class_names="text-success mt-1 mr-3 flex-shrink-0"
							/>
							<span>GitHub integration</span>
						</li>
						<li class="flex items-start">
							<Checkmark
								height="20px"
								width="20px"
								class_names="text-success mt-1 mr-3 flex-shrink-0"
							/>
							<span>Email support</span>
						</li>
					</ul>

					<div class="card-actions mt-auto">
						<a
							href="/auth/register"
							class="btn btn-outline btn-block"
						>
							Get Started
						</a>
					</div>
				</div>
			</div>

			<!-- Pro Plan -->
			<div
				class="card bg-base-100 border-primary relative border-2 shadow-lg"
			>
				<div
					class="absolute -top-4 right-0 left-0 flex justify-center"
				>
					<div class="badge badge-primary">POPULAR</div>
				</div>
				<div class="card-body p-8">
					<h3 class="mb-2 text-2xl font-bold">Pro</h3>
					<p class="mb-6 text-sm opacity-70">
						For growing developer teams
					</p>
					<div class="mb-6">
						<span class="text-5xl font-extrabold">$49</span>
						<span class="text-base opacity-70">/month</span>
					</div>

					<div class="divider"></div>

					<ul class="mb-8 space-y-4">
						<li class="flex items-start">
							<Checkmark
								height="20px"
								width="20px"
								class_names="text-success mt-1 mr-3 flex-shrink-0"
							/>
							<span>Unlimited contacts</span>
						</li>
						<li class="flex items-start">
							<Checkmark
								height="20px"
								width="20px"
								class_names="text-success mt-1 mr-3 flex-shrink-0"
							/>
							<span>Advanced tech stack analytics</span>
						</li>
						<li class="flex items-start">
							<Checkmark
								height="20px"
								width="20px"
								class_names="text-success mt-1 mr-3 flex-shrink-0"
							/>
							<span>Team collaboration features</span>
						</li>
						<li class="flex items-start">
							<Checkmark
								height="20px"
								width="20px"
								class_names="text-success mt-1 mr-3 flex-shrink-0"
							/>
							<span>Quick Connect QR codes</span>
						</li>
						<li class="flex items-start">
							<Checkmark
								height="20px"
								width="20px"
								class_names="text-success mt-1 mr-3 flex-shrink-0"
							/>
							<span>API access</span>
						</li>
						<li class="flex items-start">
							<Checkmark
								height="20px"
								width="20px"
								class_names="text-success mt-1 mr-3 flex-shrink-0"
							/>
							<span>Priority support</span>
						</li>
					</ul>

					<div class="card-actions mt-auto">
						<a
							href="/auth/register"
							class="btn btn-primary btn-block"
						>
							Get Started
						</a>
					</div>
				</div>
			</div>

			<!-- Enterprise Plan -->
			<div class="card bg-base-100 border-base-300 border shadow-sm">
				<div class="card-body p-8">
					<h3 class="mb-2 text-2xl font-bold">Enterprise</h3>
					<p class="mb-6 text-sm opacity-70">
						For large developer ecosystems
					</p>
					<div class="mb-6">
						<span class="text-5xl font-extrabold">$199</span>
						<span class="text-base opacity-70">/month</span>
					</div>

					<div class="divider"></div>

					<ul class="mb-8 space-y-4">
						<li class="flex items-start">
							<Checkmark
								height="20px"
								width="20px"
								class_names="text-success mt-1 mr-3 flex-shrink-0"
							/>
							<span>Everything in Pro</span>
						</li>
						<li class="flex items-start">
							<Checkmark
								height="20px"
								width="20px"
								class_names="text-success mt-1 mr-3 flex-shrink-0"
							/>
							<span>Unlimited team members</span>
						</li>
						<li class="flex items-start">
							<Checkmark
								height="20px"
								width="20px"
								class_names="text-success mt-1 mr-3 flex-shrink-0"
							/>
							<span>Advanced security features</span>
						</li>
						<li class="flex items-start">
							<Checkmark
								height="20px"
								width="20px"
								class_names="text-success mt-1 mr-3 flex-shrink-0"
							/>
							<span>Custom integrations</span>
						</li>
						<li class="flex items-start">
							<Checkmark
								height="20px"
								width="20px"
								class_names="text-success mt-1 mr-3 flex-shrink-0"
							/>
							<span>Dedicated account manager</span>
						</li>
						<li class="flex items-start">
							<Checkmark
								height="20px"
								width="20px"
								class_names="text-success mt-1 mr-3 flex-shrink-0"
							/>
							<span>24/7 phone & email support</span>
						</li>
					</ul>

					<div class="card-actions mt-auto">
						<a
							href="/contact-sales"
							class="btn btn-outline btn-block"
						>
							Contact Sales
						</a>
					</div>
				</div>
			</div>
		</div>

		<!-- FAQ Section -->
		<div class="mt-20">
			<h3 class="mb-8 text-center text-2xl font-bold">
				Frequently Asked Questions
			</h3>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div class="collapse-plus bg-base-100 collapse">
					<input type="radio" name="pricing-faq" checked={true} />
					<div class="collapse-title text-lg font-medium">
						Can I change plans later?
					</div>
					<div class="collapse-content">
						<p>
							Yes, you can upgrade or downgrade your plan at any time.
							Changes take effect at the start of your next billing
							cycle.
						</p>
					</div>
				</div>

				<div class="collapse-plus bg-base-100 collapse">
					<input type="radio" name="pricing-faq" />
					<div class="collapse-title text-lg font-medium">
						Is there a free trial?
					</div>
					<div class="collapse-content">
						<p>
							Yes, all plans come with a 14-day free trial. No credit
							card required to start.
						</p>
					</div>
				</div>

				<div class="collapse-plus bg-base-100 collapse">
					<input type="radio" name="pricing-faq" />
					<div class="collapse-title text-lg font-medium">
						What payment methods do you accept?
					</div>
					<div class="collapse-content">
						<p>
							We accept all major credit cards, PayPal, and offer
							invoice payment options for Enterprise customers.
						</p>
					</div>
				</div>

				<div class="collapse-plus bg-base-100 collapse">
					<input type="radio" name="pricing-faq" />
					<div class="collapse-title text-lg font-medium">
						Do you offer discounts for startups?
					</div>
					<div class="collapse-content">
						<p>
							Yes, we offer special pricing for early-stage startups.
							Contact our sales team to learn more.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
