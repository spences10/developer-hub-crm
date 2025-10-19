<script lang="ts">
	import PageNav from '$lib/components/page-nav.svelte';
	import { seo_configs } from '$lib/seo';
	import { themes } from '$lib/themes';
	import { format_date } from '$lib/utils/date-helpers';
	import {
		get_available_icons,
		get_color_name,
		get_icon_component,
		AVAILABLE_THEME_COLORS,
	} from '$lib/utils/interaction-type-helpers';
	import { Head } from 'svead';
	import { onMount } from 'svelte';
	import {
		get_user_preferences,
		update_date_format,
		update_default_contact_sort,
		update_default_follow_up_days,
		update_default_interaction_type,
		update_time_format,
	} from './settings.remote';
	import {
		get_interaction_types,
		create_interaction_type,
		update_interaction_type,
		delete_interaction_type,
	} from './interaction-types.remote';
	import type { InteractionType } from '$lib/types/interaction-type';

	const today = new Date();
	const preferences = get_user_preferences();
	const interaction_types = get_interaction_types();

	let saving = $state(false);
	let current_theme = $state('');

	// Interaction type management
	let show_type_modal = $state(false);
	let editing_type: InteractionType | null = $state(null);
	let form_value = $state('');
	let form_label = $state('');
	let form_icon = $state('Calendar');
	let form_color = $state('bg-primary text-primary-content');
	let form_loading = $state(false);
	let form_error = $state('');

	async function open_type_modal(type?: InteractionType) {
		if (type) {
			editing_type = type;
			form_value = type.value;
			form_label = type.label;
			form_icon = type.icon;
			form_color = type.color;
		} else {
			editing_type = null;
			form_value = '';
			form_label = '';
			form_icon = 'Calendar';
			form_color = 'bg-primary text-primary-content';
		}
		form_error = '';
		show_type_modal = true;
	}

	function close_type_modal() {
		show_type_modal = false;
		editing_type = null;
	}

	async function save_interaction_type() {
		form_loading = true;
		form_error = '';

		try {
			let result;
			if (editing_type) {
				result = await update_interaction_type({
					id: editing_type.id,
					label: form_label,
					icon: form_icon,
					color: form_color,
					display_order: editing_type.display_order,
				});
			} else {
				result = await create_interaction_type({
					value: form_value.toLowerCase().replace(/\s+/g, '_'),
					label: form_label,
					icon: form_icon,
					color: form_color,
				});
			}

			if (result.error) {
				form_error = result.error;
			} else {
				close_type_modal();
				await interaction_types.refresh();
			}
		} catch (error) {
			form_error = 'Failed to save type';
		} finally {
			form_loading = false;
		}
	}

	async function delete_type(type: InteractionType) {
		if (!confirm(`Delete "${type.label}"? This cannot be undone.`)) {
			return;
		}

		try {
			const result = await delete_interaction_type(type.id);
			if (result.error) {
				alert(`Error: ${result.error}`);
			} else {
				await interaction_types.refresh();
			}
		} catch (error) {
			alert('Failed to delete type');
		}
	}

	onMount(async () => {
		// Load theme from localStorage
		const theme = window.localStorage.getItem('theme');
		if (theme && themes.includes(theme)) {
			document.documentElement.setAttribute('data-theme', theme);
			current_theme = theme;
		}
	});

	async function save_with_indicator(fn: () => Promise<void>) {
		saving = true;
		await fn();
		await preferences.refresh();
		setTimeout(() => (saving = false), 500);
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

	const theme_colors = [
		{ class: 'bg-primary', label: 'Primary' },
		{ class: 'bg-secondary', label: 'Secondary' },
		{ class: 'bg-accent', label: 'Accent' },
		{ class: 'bg-neutral', label: 'Neutral' },
		{ class: 'bg-base-100', label: 'Background' },
	];
</script>

<Head seo_config={seo_configs.settings} />

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

<div class="mb-8 flex items-center justify-between">
	<div>
		<h1 class="text-3xl font-bold">Settings</h1>
	</div>
	{#if saving}
		<span class="badge badge-lg badge-success">Saving...</span>
	{/if}
</div>
<PageNav />

{#await preferences}
	<div class="flex justify-center">
		<span class="loading loading-lg loading-spinner"></span>
	</div>
{:then preferences_data}
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
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
						class="select w-full max-w-xs capitalize"
						onchange={set_theme}
					>
						<option value="" disabled={current_theme !== ''}>
							Choose a theme
						</option>
						{#each themes as theme}
							<option value={theme} class="capitalize">{theme}</option
							>
						{/each}
					</select>
				</label>

				<!-- Color Preview -->
				{#if current_theme}
					<div class="mt-6">
						<p class="mb-3 text-sm font-medium">Theme Colors</p>
						<div class="flex flex-wrap gap-4">
							{#each theme_colors as color}
								<div class="flex flex-col items-center gap-2">
									<div
										class="h-12 w-12 rounded-full border-2 border-base-300 {color.class}"
									></div>
									<span class="text-xs">{color.label}</span>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>

		{@render radio_group(
			'Date Format',
			'Choose how dates are displayed throughout the application',
			'date_format',
			date_formats,
			preferences_data.date_format,
			update_date_format,
		)}

		{@render radio_group(
			'Time Format',
			'Choose how times are displayed',
			'time_format',
			time_formats,
			preferences_data.time_format,
			update_time_format,
		)}

		{@render radio_group(
			'Default Contact Sort',
			'How contacts are sorted by default',
			'default_contact_sort',
			contact_sort_options,
			preferences_data.default_contact_sort,
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
						value={preferences_data.default_follow_up_days}
						class="input w-full max-w-xs"
						onchange={(e) =>
							save_with_indicator(() =>
								update_default_follow_up_days(
									Number(e.currentTarget.value),
								),
							)}
					/>
					<span class="ml-2 text-sm opacity-60">days</span>
				</label>
			</div>
		</div>

		<!-- Manage Interaction Types -->
		<div class="col-span-full card bg-base-100 shadow-xl">
			<div class="card-body">
				<div class="flex items-center justify-between">
					<div>
						<h2 class="card-title">Manage Interaction Types</h2>
						<p class="text-sm opacity-70">
							Create custom interaction types or edit existing ones
						</p>
					</div>
					<button
						type="button"
						class="btn btn-primary btn-sm"
						onclick={() => open_type_modal()}
					>
						Add New Type
					</button>
				</div>

				{#await interaction_types}
					<div class="flex justify-center py-8">
						<span class="loading loading-spinner loading-lg"></span>
					</div>
				{:then types}
					<!-- Desktop table view -->
					<div class="mt-4 hidden overflow-x-auto sm:block">
						<table class="table w-full">
							<thead>
								<tr>
									<th>Label</th>
									<th>Value</th>
									<th>Icon</th>
									<th>Color</th>
									<th>Type</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{#each types as type (type.id)}
									<tr class="hover">
										<td>
											<span class="font-medium">{type.label}</span>
										</td>
										<td>
											<code class="bg-base-200 px-2 py-1 rounded text-sm"
												>{type.value}</code
											>
										</td>
										<td>
											<div class="flex items-center gap-2">
												<svelte:component
													this={get_icon_component(type.icon)}
													class="w-5 h-5"
												/>
												<span class="text-sm">{type.icon}</span>
											</div>
										</td>
										<td>
											<div
												class="badge {type.color} w-24 text-center"
											>
												{get_color_name(type.color)}
											</div>
										</td>
										<td>
											{#if type.user_id}
												<span class="badge badge-secondary">Custom</span>
											{:else}
												<span class="badge">System</span>
											{/if}
										</td>
										<td>
											<div class="flex gap-2">
												{#if type.user_id}
													<button
														type="button"
														class="btn btn-ghost btn-xs"
														onclick={() => open_type_modal(type)}
													>
														Edit
													</button>
													<button
														type="button"
														class="btn btn-ghost btn-xs text-error"
														onclick={() => delete_type(type)}
													>
														Delete
													</button>
												{/if}
											</div>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					<!-- Mobile card view -->
					<div class="mt-4 space-y-3 sm:hidden">
						{#each types as type (type.id)}
							<div class="card bg-base-200">
								<div class="card-body p-4">
									<div class="flex items-start justify-between gap-2">
										<div class="flex-1">
											<h3 class="font-bold">{type.label}</h3>
											<p class="text-xs opacity-70">
												<code>{type.value}</code>
											</p>
										</div>
										<div>
											{#if type.user_id}
												<span class="badge badge-secondary badge-sm"
													>Custom</span
												>
											{:else}
												<span class="badge badge-sm">System</span>
											{/if}
										</div>
									</div>

									<div class="divider my-2"></div>

									<div class="space-y-2 text-sm">
										<div class="flex items-center gap-2">
											<span class="font-medium">Icon:</span>
											<svelte:component
												this={get_icon_component(type.icon)}
												class="w-5 h-5"
											/>
											<span>{type.icon}</span>
										</div>
										<div class="flex items-center gap-2">
											<span class="font-medium">Color:</span>
											<div
												class="badge {type.color} text-xs"
											>
												{get_color_name(type.color)}
											</div>
										</div>
									</div>

									{#if type.user_id}
										<div class="card-actions justify-end gap-2 mt-3">
											<button
												type="button"
												class="btn btn-ghost btn-sm"
												onclick={() => open_type_modal(type)}
											>
												Edit
											</button>
											<button
												type="button"
												class="btn btn-ghost btn-sm text-error"
												onclick={() => delete_type(type)}
											>
												Delete
											</button>
										</div>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{:catch error}
					<div class="alert alert-error">
						<span>Failed to load interaction types</span>
					</div>
				{/await}
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
					{#await interaction_types}
						<select disabled class="select w-full max-w-xs">
							<option>Loading...</option>
						</select>
					{:then types}
						<select
							name="default_interaction_type"
							class="select w-full max-w-xs"
							value={preferences_data.default_interaction_type || ''}
							onchange={(e) =>
								save_with_indicator(() =>
									update_default_interaction_type(
										e.currentTarget.value || '',
									),
								)}
						>
							<option value="">None (no default)</option>
							{#each types as type}
								<option value={type.value}>{type.label}</option>
							{/each}
						</select>
					{/await}
				</label>
			</div>
		</div>
	</div>
{:catch error}
	<div class="alert alert-error">
		<span>Failed to load settings: {error.message}</span>
	</div>
{/await}

<!-- Interaction Type Modal -->
{#if show_type_modal}
	<div class="modal modal-open">
		<div class="modal-box w-full max-w-md">
			<h3 class="font-bold text-lg">
				{editing_type ? 'Edit' : 'Create'} Interaction Type
			</h3>

			{#if form_error}
				<div class="alert alert-error mt-4">
					<span>{form_error}</span>
				</div>
			{/if}

			<div class="form-control mt-4">
				{#if !editing_type}
					<label class="label">
						<span class="label-text">Value (identifier)</span>
					</label>
					<input
						type="text"
						placeholder="my_type"
						class="input input-bordered"
						bind:value={form_value}
						disabled={form_loading}
					/>
					<span class="label-text-alt mt-1">
						Lowercase letters, numbers, underscores only
					</span>
				{/if}
			</div>

			<div class="form-control mt-4">
				<label class="label">
					<span class="label-text">Label (display name)</span>
				</label>
				<input
					type="text"
					placeholder="My Type"
					class="input input-bordered"
					bind:value={form_label}
					disabled={form_loading}
				/>
			</div>

			<div class="form-control mt-4">
				<label class="label">
					<span class="label-text">Icon</span>
				</label>
				<select
					class="select select-bordered"
					bind:value={form_icon}
					disabled={form_loading}
				>
					{#each get_available_icons() as icon}
						<option value={icon}>{icon}</option>
					{/each}
				</select>
				<div class="mt-2 flex items-center gap-2">
					<span class="text-sm">Preview:</span>
					<svelte:component
						this={get_icon_component(form_icon)}
						class="w-6 h-6"
					/>
				</div>
			</div>

			<div class="form-control mt-4">
				<label class="label">
					<span class="label-text">Color</span>
				</label>
				<select
					class="select select-bordered"
					bind:value={form_color}
					disabled={form_loading}
				>
					{#each AVAILABLE_THEME_COLORS as color}
						<option value={color.value}>{color.name}</option>
					{/each}
				</select>
				<div class="mt-2">
					<span class="text-sm">Preview:</span>
					<div class="badge {form_color} mt-2 py-4">
						{get_color_name(form_color)}
					</div>
				</div>
			</div>

			<div class="modal-action mt-6">
				<button
					type="button"
					class="btn btn-ghost"
					onclick={close_type_modal}
					disabled={form_loading}
				>
					Cancel
				</button>
				<button
					type="button"
					class="btn btn-primary"
					onclick={save_interaction_type}
					disabled={form_loading || !form_label}
				>
					{#if form_loading}
						<span class="loading loading-spinner loading-sm"></span>
					{:else}
						{editing_type ? 'Update' : 'Create'}
					{/if}
				</button>
			</div>
		</div>
		<div class="modal-backdrop" onclick={close_type_modal}></div>
	</div>
{/if}
