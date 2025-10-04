<script lang="ts">
	import { format_date } from '$lib/utils/date-helpers';
	import {
		get_user_preferences,
		update_preferences,
	} from './settings.remote';

	let refresh_key = $state(0);
	const today = new Date();
</script>

<div class="mx-auto max-w-2xl">
	<div class="mb-8">
		<h1 class="text-3xl font-bold">Settings</h1>
		<p class="mt-2 text-sm opacity-70">
			Customize your Developer Hub CRM experience
		</p>
	</div>

	{#key refresh_key}
		{#await get_user_preferences()}
			<div class="flex justify-center">
				<span class="loading loading-lg loading-spinner"></span>
			</div>
		{:then preferences}
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title">Date Format</h2>
					<p class="text-sm opacity-70">
						Choose how dates are displayed throughout the application
					</p>

					<form {...update_preferences} class="mt-6 space-y-4">
						<div class="space-y-3">
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

						<div class="mt-6 flex gap-4">
							<button class="btn flex-1 btn-primary" type="submit">
								Save Settings
							</button>
						</div>
					</form>
				</div>
			</div>
		{:catch error}
			<div class="alert alert-error">
				<span>Failed to load settings: {error.message}</span>
			</div>
		{/await}
	{/key}
</div>
