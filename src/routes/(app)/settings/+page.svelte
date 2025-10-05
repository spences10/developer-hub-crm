<script lang="ts">
	import { themes } from '$lib/themes';
	import { format_date } from '$lib/utils/date-helpers';
	import {
		get_user_preferences,
		update_date_format,
		update_default_contact_sort,
		update_default_follow_up_days,
		update_default_interaction_type,
		update_time_format,
	} from './settings.remote';

	const today = new Date();
	const preferences = get_user_preferences();

	let saving = $state(false);
	let current_theme = $state('');

	$effect(() => {
		if (typeof window !== 'undefined') {
			const theme = window.localStorage.getItem('theme');
			if (theme && themes.includes(theme)) {
				document.documentElement.setAttribute('data-theme', theme);
				current_theme = theme;
			}
		}
	});

	async function save_with_indicator(fn: () => Promise<void>) {
		saving = true;
		await fn();
		setTimeout(() => (saving = false), 500); // Show "Saved" briefly
	}

	function set_theme(event: Event) {
		const select = event.target as HTMLSelectElement;
		const theme = select.value;
		if (themes.includes(theme)) {
			const one_year = 60 * 60 * 24 * 365;
			window.localStorage.setItem('theme', theme);
			document.cookie = `theme=${theme}; max-age=${one_year}; path=/; SameSite=Lax`;
			document.documentElement.setAttribute('data-theme', theme);
			current_theme = theme;
		}
	}

	// Define options
	const date_formats = [
		{
			value: 'YYYY-MM-DD',
			label: 'YYYY-MM-DD',
			example: () => format_date(today, 'YYYY-MM-DD') + ' (ISO 8601)',
		},
		{
			value: 'MM/DD/YYYY',
			label: 'MM/DD/YYYY',
			example: () =>
				format_date(today, 'MM/DD/YYYY') + ' (US format)',
		},
		{
			value: 'DD/MM/YYYY',
			label: 'DD/MM/YYYY',
			example: () =>
				format_date(today, 'DD/MM/YYYY') + ' (European format)',
		},
	];

	const time_formats = [
		{ value: '24h', label: '24-hour', example: 'Example: 14:30' },
		{ value: '12h', label: '12-hour', example: 'Example: 2:30 PM' },
	];

	const contact_sort_options = [
		{ value: 'name', label: 'Name (A-Z)' },
		{ value: 'last_contacted', label: 'Last Contacted' },
		{ value: 'recently_added', label: 'Recently Added' },
		{ value: 'company', label: 'Company (A-Z)' },
	];
</script>

{#snippet radio_group(
	title: string,
	description: string,
	name: string,
	options: Array<{
		value: string;
		label: string;
		example?: string | (() => string);
	}>,
	current: string,
	onchange: (value: string) => Promise<void>,
)}
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title">{title}</h2>
			<p class="text-sm opacity-70">{description}</p>

			<div class="mt-4 space-y-3">
				{#each options as option}
					<label class="flex cursor-pointer items-center gap-3">
						<input
							type="radio"
							{name}
							value={option.value}
							class="radio radio-primary"
							checked={current === option.value}
							onchange={() =>
								save_with_indicator(() => onchange(option.value))}
						/>
						<div class="flex flex-col">
							<span class="font-medium">{option.label}</span>
							{#if option.example}
								<span class="text-sm opacity-60">
									{typeof option.example === 'function'
										? option.example()
										: option.example}
								</span>
							{/if}
						</div>
					</label>
				{/each}
			</div>
		</div>
	</div>
{/snippet}

<div class="mx-auto max-w-2xl">
	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold">Settings</h1>
			<p class="mt-2 text-sm opacity-70">
				Customize your Developer Hub CRM experience
			</p>
		</div>
		{#if saving}
			<span class="badge badge-lg badge-success">Saving...</span>
		{/if}
	</div>

	{#await preferences}
		<div class="flex justify-center">
			<span class="loading loading-lg loading-spinner"></span>
		</div>
	{:then preferences}
		<div class="space-y-6">
			<!-- Theme Selector -->
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title">Theme</h2>
					<p class="text-sm opacity-70">
						Choose a color theme for the application
					</p>

					<label class="label mt-4">
						<select
							bind:value={current_theme}
							class="select-bordered select w-full max-w-xs capitalize"
							onchange={set_theme}
						>
							<option value="" disabled={current_theme !== ''}>
								Choose a theme
							</option>
							{#each themes as theme}
								<option value={theme} class="capitalize"
									>{theme}</option
								>
							{/each}
						</select>
					</label>
				</div>
			</div>

			{@render radio_group(
				'Date Format',
				'Choose how dates are displayed throughout the application',
				'date_format',
				date_formats,
				preferences.date_format,
				update_date_format,
			)}

			{@render radio_group(
				'Time Format',
				'Choose how times are displayed',
				'time_format',
				time_formats,
				preferences.time_format,
				update_time_format,
			)}

			{@render radio_group(
				'Default Contact Sort',
				'How contacts are sorted by default',
				'default_contact_sort',
				contact_sort_options,
				preferences.default_contact_sort,
				update_default_contact_sort,
			)}

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
							onchange={(e) =>
								save_with_indicator(() =>
									update_default_follow_up_days(
										Number(e.currentTarget.value),
									),
								)}
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
							onchange={(e) =>
								save_with_indicator(() =>
									update_default_interaction_type(
										e.currentTarget.value || '',
									),
								)}
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
		</div>
	{:catch error}
		<div class="alert alert-error">
			<span>Failed to load settings: {error.message}</span>
		</div>
	{/await}
</div>
