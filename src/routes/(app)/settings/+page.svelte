<script lang="ts">
	import { format_date } from '$lib/utils/date-helpers';
	import {
		get_user_preferences,
		update_preferences,
	} from './settings.remote';

	const today = new Date();
	const preferences = get_user_preferences();
</script>

<div class="mx-auto max-w-2xl">
	<div class="mb-8">
		<h1 class="text-3xl font-bold">Settings</h1>
		<p class="mt-2 text-sm opacity-70">
			Customize your Developer Hub CRM experience
		</p>
	</div>

	{#await preferences}
		<div class="flex justify-center">
			<span class="loading loading-lg loading-spinner"></span>
		</div>
	{:then preferences}
		<form {...update_preferences} class="space-y-6">
			<!-- Date Format -->
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title">Date Format</h2>
					<p class="text-sm opacity-70">
						Choose how dates are displayed throughout the application
					</p>

					<div class="mt-4 space-y-3">
						<label class="flex cursor-pointer items-center gap-3">
							<input
								type="radio"
								name="date_format"
								value="YYYY-MM-DD"
								class="radio radio-primary"
								checked={preferences.date_format === 'YYYY-MM-DD'}
							/>
							<div class="flex flex-col">
								<span class="font-medium">YYYY-MM-DD</span>
								<span class="text-sm opacity-60">
									Example: {format_date(today, 'YYYY-MM-DD')} (ISO 8601)
								</span>
							</div>
						</label>

						<label class="flex cursor-pointer items-center gap-3">
							<input
								type="radio"
								name="date_format"
								value="MM/DD/YYYY"
								class="radio radio-primary"
								checked={preferences.date_format === 'MM/DD/YYYY'}
							/>
							<div class="flex flex-col">
								<span class="font-medium">MM/DD/YYYY</span>
								<span class="text-sm opacity-60">
									Example: {format_date(today, 'MM/DD/YYYY')} (US format)
								</span>
							</div>
						</label>

						<label class="flex cursor-pointer items-center gap-3">
							<input
								type="radio"
								name="date_format"
								value="DD/MM/YYYY"
								class="radio radio-primary"
								checked={preferences.date_format === 'DD/MM/YYYY'}
							/>
							<div class="flex flex-col">
								<span class="font-medium">DD/MM/YYYY</span>
								<span class="text-sm opacity-60">
									Example: {format_date(today, 'DD/MM/YYYY')} (European
									format)
								</span>
							</div>
						</label>
					</div>
				</div>
			</div>

			<!-- Time Format -->
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title">Time Format</h2>
					<p class="text-sm opacity-70">
						Choose how times are displayed
					</p>

					<div class="mt-4 space-y-3">
						<label class="flex cursor-pointer items-center gap-3">
							<input
								type="radio"
								name="time_format"
								value="24h"
								class="radio radio-primary"
								checked={preferences.time_format === '24h'}
							/>
							<div class="flex flex-col">
								<span class="font-medium">24-hour</span>
								<span class="text-sm opacity-60">
									Example: 14:30
								</span>
							</div>
						</label>

						<label class="flex cursor-pointer items-center gap-3">
							<input
								type="radio"
								name="time_format"
								value="12h"
								class="radio radio-primary"
								checked={preferences.time_format === '12h'}
							/>
							<div class="flex flex-col">
								<span class="font-medium">12-hour</span>
								<span class="text-sm opacity-60">
									Example: 2:30 PM
								</span>
							</div>
						</label>
					</div>
				</div>
			</div>

			<!-- Default Contact Sort -->
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title">Default Contact Sort</h2>
					<p class="text-sm opacity-70">
						How contacts are sorted by default
					</p>

					<div class="mt-4 space-y-3">
						<label class="flex cursor-pointer items-center gap-3">
							<input
								type="radio"
								name="default_contact_sort"
								value="name"
								class="radio radio-primary"
								checked={preferences.default_contact_sort === 'name'}
							/>
							<span class="font-medium">Name (A-Z)</span>
						</label>

						<label class="flex cursor-pointer items-center gap-3">
							<input
								type="radio"
								name="default_contact_sort"
								value="last_contacted"
								class="radio radio-primary"
								checked={preferences.default_contact_sort ===
									'last_contacted'}
							/>
							<span class="font-medium">Last Contacted</span>
						</label>

						<label class="flex cursor-pointer items-center gap-3">
							<input
								type="radio"
								name="default_contact_sort"
								value="recently_added"
								class="radio radio-primary"
								checked={preferences.default_contact_sort ===
									'recently_added'}
							/>
							<span class="font-medium">Recently Added</span>
						</label>

						<label class="flex cursor-pointer items-center gap-3">
							<input
								type="radio"
								name="default_contact_sort"
								value="company"
								class="radio radio-primary"
								checked={preferences.default_contact_sort ===
									'company'}
							/>
							<span class="font-medium">Company (A-Z)</span>
						</label>
					</div>
				</div>
			</div>

			<!-- Default Follow-up Offset -->
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title">Default Follow-up Offset</h2>
					<p class="text-sm opacity-70">
						When creating follow-ups, auto-set due date to this many
						days from today
					</p>

					<label class="label mt-4">
						<input
							type="number"
							name="default_follow_up_days"
							min="1"
							max="90"
							value={preferences.default_follow_up_days}
							class="input-bordered input w-full max-w-xs"
						/>
						<span class="label-text-alt ml-2">days</span>
					</label>
				</div>
			</div>

			<!-- Default Interaction Type -->
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title">Default Interaction Type</h2>
					<p class="text-sm opacity-70">
						Pre-select this interaction type when logging new
						interactions
					</p>

					<label class="label mt-4">
						<select
							name="default_interaction_type"
							class="select-bordered select w-full max-w-xs"
							value={preferences.default_interaction_type || ''}
						>
							<option value="">None (no default)</option>
							<option value="meeting">Meeting</option>
							<option value="call">Call</option>
							<option value="email">Email</option>
							<option value="message">Message</option>
						</select>
					</label>
				</div>
			</div>

			<!-- Submit Button -->
			<div class="flex justify-end">
				<button class="btn btn-primary" type="submit">
					Save All Settings
				</button>
			</div>
		</form>
	{:catch error}
		<div class="alert alert-error">
			<span>Failed to load settings: {error.message}</span>
		</div>
	{/await}
</div>
