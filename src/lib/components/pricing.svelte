<script lang="ts">
	import { Checkmark } from '$lib/icons'
</script>

<section id="pricing" class="py-20 bg-base-200">
	<div class="container mx-auto px-4">
		<h2 class="text-4xl font-bold text-center mb-16">Simple, Transparent Pricing</h2>
		
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h3 class="card-title text-2xl justify-center">Starter</h3>
					<div class="text-center my-4">
						<span class="text-4xl font-bold">$29</span>
						<span class="text-sm opacity-70">/month</span>
					</div>
					<ul class="space-y-2">
						<li class="flex items-center">
							<Checkmark height="20px" width="20px" class_names="text-success mr-2" />
							Up to 500 contacts
						</li>
						<li class="flex items-center">
							<Checkmark height="20px" width="20px" class_names="text-success mr-2" />
							Basic analytics
						</li>
						<li class="flex items-center">
							<Checkmark height="20px" width="20px" class_names="text-success mr-2" />
							Email support
						</li>
					</ul>
					<div class="card-actions justify-center mt-6">
						<a href="/auth/register" class="btn btn-primary btn-block">Get Started</a>
					</div>
				</div>
			</div>
			
			<div class="card bg-primary text-primary-content shadow-xl">
				<div class="card-body">
					<div class="absolute -top-4 left-0 right-0 flex justify-center">
						<div class="badge badge-secondary">POPULAR</div>
					</div>
					<h3 class="card-title text-2xl justify-center">Professional</h3>
					<div class="text-center my-4">
						<span class="text-4xl font-bold">$79</span>
						<span class="text-sm opacity-70">/month</span>
					</div>
					<ul class="space-y-2">
						<li class="flex items-center">
							<Checkmark height="20px" width="20px" class_names="mr-2" />
							Unlimited contacts
						</li>
						<li class="flex items-center">
							<Checkmark height="20px" width="20px" class_names="mr-2" />
							Advanced analytics
						</li>
						<li class="flex items-center">
							<Checkmark height="20px" width="20px" class_names="mr-2" />
							Priority support
						</li>
						<li class="flex items-center">
							<Checkmark height="20px" width="20px" class_names="mr-2" />
							API access
						</li>
					</ul>
					<div class="card-actions justify-center mt-6">
						<a href="/auth/register" class="btn btn-secondary btn-block">Get Started</a>
					</div>
				</div>
			</div>
			
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h3 class="card-title text-2xl justify-center">Enterprise</h3>
					<div class="text-center my-4">
						<span class="text-4xl font-bold">$199</span>
						<span class="text-sm opacity-70">/month</span>
					</div>
					<ul class="space-y-2">
						<li class="flex items-center">
							<Checkmark height="20px" width="20px" class_names="text-success mr-2" />
							Unlimited everything
						</li>
						<li class="flex items-center">
							<Checkmark height="20px" width="20px" class_names="text-success mr-2" />
							Custom reporting
						</li>
						<li class="flex items-center">
							<Checkmark height="20px" width="20px" class_names="text-success mr-2" />
							Dedicated account manager
						</li>
						<li class="flex items-center">
							<Checkmark height="20px" width="20px" class_names="text-success mr-2" />
							White-labeling options
						</li>
					</ul>
					<div class="card-actions justify-center mt-6">
						<a href="/auth/register" class="btn btn-primary btn-block">Contact Sales</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
