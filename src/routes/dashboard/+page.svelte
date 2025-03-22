<script lang="ts">
	import type { PageData } from './$types';
	
	export let data: PageData;
</script>

<div class="min-h-screen bg-base-200 p-4">
	<div class="navbar bg-base-100 rounded-box shadow-md mb-6">
		<div class="flex-1">
			<a href="/dashboard" class="btn btn-ghost text-xl">Developer Hub CRM</a>
		</div>
		<div class="flex-none">
			<div class="dropdown dropdown-end">
				<label for="user-menu" class="btn btn-ghost btn-circle avatar placeholder">
					<div class="bg-neutral text-neutral-content rounded-full w-10">
						<span>{data.user.username.charAt(0).toUpperCase()}</span>
					</div>
				</label>
				<ul id="user-menu" class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
					<li><a href="/profile">Profile</a></li>
					<li>
						<form method="POST" action="/auth?/logout">
							<button type="submit" class="w-full text-left">Logout</button>
						</form>
					</li>
				</ul>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">Welcome, {data.user.username}!</h2>
				<p>Your Developer Hub CRM dashboard is ready.</p>
				<div class="card-actions justify-end">
					<a href="/contacts" class="btn btn-primary">Manage Contacts</a>
				</div>
			</div>
		</div>

		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">Recent Activity</h2>
				<div class="overflow-x-auto">
					<table class="table table-zebra">
						<thead>
							<tr>
								<th>Date</th>
								<th>Activity</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>Today</td>
								<td>Account created</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h2 class="card-title">Quick Stats</h2>
				<div class="stats stats-vertical shadow">
					<div class="stat">
						<div class="stat-title">Total Contacts</div>
						<div class="stat-value">0</div>
					</div>
					<div class="stat">
						<div class="stat-title">VIP Contacts</div>
						<div class="stat-value">0</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
