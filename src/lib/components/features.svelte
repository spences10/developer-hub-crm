<script lang="ts">
	import {
		Analytics,
		ContactManagement,
		EventTracking,
	} from '$lib/icons';
</script>

<section id="features" class="full-width-section bg-base-200 py-20">
	<div class="container mx-auto px-4">
		<h2 class="mb-16 text-center text-4xl font-bold">
			Powerful Features
		</h2>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			<div class="card bg-base-100 shadow-xl">
				<figure class="px-10 pt-10">
					<ContactManagement
						height="80px"
						width="80px"
						class_names="text-primary"
					/>
				</figure>
				<div class="card-body items-center text-center">
					<h3 class="card-title">Developer Contact Management</h3>
					<p>
						Keep track of all your developer contacts, their
						interests, and engagement history in one centralized
						location.
					</p>
				</div>
			</div>

			<div class="card bg-base-100 shadow-xl">
				<figure class="px-10 pt-10">
					<EventTracking
						height="80px"
						width="80px"
						class_names="text-primary"
					/>
				</figure>
				<div class="card-body items-center text-center">
					<h3 class="card-title">Event Tracking</h3>
					<p>
						Manage developer events, track attendance, and measure
						engagement metrics to optimize your developer relations
						strategy.
					</p>
				</div>
			</div>

			<div class="card bg-base-100 shadow-xl">
				<figure class="px-10 pt-10">
					<Analytics
						height="80px"
						width="80px"
						class_names="text-primary"
					/>
				</figure>
				<div class="card-body items-center text-center">
					<h3 class="card-title">Analytics Dashboard</h3>
					<p>
						Gain insights into developer engagement with comprehensive
						analytics and customizable reports.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>
