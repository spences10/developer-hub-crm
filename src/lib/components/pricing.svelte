<script lang="ts">
	import { Checkmark } from '$lib/icons';
</script>

<section id="pricing" class="full-width-section bg-base-200 py-20">
	<div class="container mx-auto px-4">
		<h2 class="mb-16 text-center text-4xl font-bold">
			Developer-Friendly Pricing
		</h2>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h3 class="card-title justify-center text-2xl">
						Solo Developer
					</h3>
					<div class="my-4 text-center">
						<span class="text-4xl font-bold">$19</span>
						<span class="text-sm opacity-70">/month</span>
					</div>
					<ul class="space-y-2">
						<li class="flex items-center">
							<Checkmark
								height="20px"
								width="20px"
								class_names="text-success mr-2"
							/>
							Up to 250 contacts
						</li>
						<li class="flex items-center">
							<Checkmark
								height="20px"
								width="20px"
								class_names="text-success mr-2"
							/>
							Basic networking analytics
						</li>
						<li class="flex items-center">
							<Checkmark
								height="20px"
								width="20px"
								class_names="text-success mr-2"
							/>
							Conference mode
						</li>
						<li class="flex items-center">
							<Checkmark
								height="20px"
								width="20px"
								class_names="text-success mr-2"
							/>
							GitHub integration
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
					<h3 class="card-title justify-center text-2xl">Dev Team</h3>
					<div class="my-4 text-center">
						<span class="text-4xl font-bold">$49</span>
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
							Advanced tech stack analytics
						</li>
						<li class="flex items-center">
							<Checkmark
								height="20px"
								width="20px"
								class_names="mr-2"
							/>
							Team collaboration features
						</li>
						<li class="flex items-center">
							<Checkmark
								height="20px"
								width="20px"
								class_names="mr-2"
							/>
							Quick Connect QR codes
						</li>
						<li class="flex items-center">
							<Checkmark
								height="20px"
								width="20px"
								class_names="mr-2"
							/>
							API access
						</li>
						<li class="flex items-center">
							<Checkmark
								height="20px"
								width="20px"
								class_names="mr-2"
							/>
							Priority support
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
		</div>
	</div>
</section>
