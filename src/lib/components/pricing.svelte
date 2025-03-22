<script lang="ts">
	import { Checkmark } from '$lib/icons';
</script>

<section id="pricing" class="bg-base-200 py-20">
	<div class="container mx-auto px-4">
		<h2 class="mb-16 text-center text-4xl font-bold">
			Simple, Transparent Pricing
		</h2>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h3 class="card-title justify-center text-2xl">Starter</h3>
					<div class="my-4 text-center">
						<span class="text-4xl font-bold">$29</span>
						<span class="text-sm opacity-70">/month</span>
					</div>
					<ul class="space-y-2">
						<li class="flex items-center">
							<Checkmark
								height="20px"
								width="20px"
								class_names="text-success mr-2"
							/>
							Up to 500 contacts
						</li>
						<li class="flex items-center">
							<Checkmark
								height="20px"
								width="20px"
								class_names="text-success mr-2"
							/>
							Basic analytics
						</li>
						<li class="flex items-center">
							<Checkmark
								height="20px"
								width="20px"
								class_names="text-success mr-2"
							/>
							Email support
						</li>
					</ul>
					<div class="card-actions mt-6 justify-center">
						<a href="/auth/register" class="btn btn-primary btn-block"
							>Get Started</a
						>
					</div>
				</div>
			</div>

			<div class="card bg-primary text-primary-content shadow-xl">
				<div class="card-body">
					<div
						class="absolute -top-4 right-0 left-0 flex justify-center"
					>
						<div class="badge badge-secondary">POPULAR</div>
					</div>
					<h3 class="card-title justify-center text-2xl">
						Professional
					</h3>
					<div class="my-4 text-center">
						<span class="text-4xl font-bold">$79</span>
						<span class="text-sm opacity-70">/month</span>
					</div>
					<ul class="space-y-2">
						<li class="flex items-center">
							<Checkmark
								height="20px"
								width="20px"
								class_names="mr-2"
							/>
							Unlimited contacts
						</li>
						<li class="flex items-center">
							<Checkmark
								height="20px"
								width="20px"
								class_names="mr-2"
							/>
							Advanced analytics
						</li>
						<li class="flex items-center">
							<Checkmark
								height="20px"
								width="20px"
								class_names="mr-2"
							/>
							Priority support
						</li>
						<li class="flex items-center">
							<Checkmark
								height="20px"
								width="20px"
								class_names="mr-2"
							/>
							API access
						</li>
					</ul>
					<div class="card-actions mt-6 justify-center">
						<a
							href="/auth/register"
							class="btn btn-secondary btn-block">Get Started</a
						>
					</div>
				</div>
			</div>

			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h3 class="card-title justify-center text-2xl">
						Enterprise
					</h3>
					<div class="my-4 text-center">
						<span class="text-4xl font-bold">$199</span>
						<span class="text-sm opacity-70">/month</span>
					</div>
					<ul class="space-y-2">
						<li class="flex items-center">
							<Checkmark
								height="20px"
								width="20px"
								class_names="text-success mr-2"
							/>
							Unlimited everything
						</li>
						<li class="flex items-center">
							<Checkmark
								height="20px"
								width="20px"
								class_names="text-success mr-2"
							/>
							Custom reporting
						</li>
						<li class="flex items-center">
							<Checkmark
								height="20px"
								width="20px"
								class_names="text-success mr-2"
							/>
							Dedicated account manager
						</li>
						<li class="flex items-center">
							<Checkmark
								height="20px"
								width="20px"
								class_names="text-success mr-2"
							/>
							White-labeling options
						</li>
					</ul>
					<div class="card-actions mt-6 justify-center">
						<a href="/auth/register" class="btn btn-primary btn-block"
							>Contact Sales</a
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
