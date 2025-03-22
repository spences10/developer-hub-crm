<script lang="ts">
	import { ContactManagement, EventTracking, Analytics } from '$lib/icons'
</script>

<section id="features" class="py-20 bg-base-200">
	<div class="container mx-auto px-4">
		<h2 class="text-4xl font-bold text-center mb-16">Powerful Features</h2>
		
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<div class="card bg-base-100 shadow-xl">
				<figure class="px-10 pt-10">
					<ContactManagement height="80px" width="80px" class_names="text-primary" />
				</figure>
				<div class="card-body items-center text-center">
					<h3 class="card-title">Developer Contact Management</h3>
					<p>Keep track of all your developer contacts, their interests, and engagement history in one centralized location.</p>
				</div>
			</div>
			
			<div class="card bg-base-100 shadow-xl">
				<figure class="px-10 pt-10">
					<EventTracking height="80px" width="80px" class_names="text-primary" />
				</figure>
				<div class="card-body items-center text-center">
					<h3 class="card-title">Event Tracking</h3>
					<p>Manage developer events, track attendance, and measure engagement metrics to optimize your developer relations strategy.</p>
				</div>
			</div>
			
			<div class="card bg-base-100 shadow-xl">
				<figure class="px-10 pt-10">
					<Analytics height="80px" width="80px" class_names="text-primary" />
				</figure>
				<div class="card-body items-center text-center">
					<h3 class="card-title">Analytics Dashboard</h3>
					<p>Gain insights into developer engagement with comprehensive analytics and customizable reports.</p>
				</div>
			</div>
		</div>
	</div>
</section>
