<script lang="ts">
	export let value = ''
	export let placeholder = ''
	export let id = ''
	export let label = ''
	export let type: string | 'text' | 'password' | 'checkbox' = 'text'
	export let disabled = false
	export let required = false
	export let errors: string[] = []
	export let fontSize: string = 'text-base'
	export let inputClasses: string = ''
</script>

<div class="form-control w-full max-w-lg mb-2">
	<label for={id} class="label font-medium pb-1">
		<span class="label-text {fontSize}">{label}</span>
	</label>
	<input
		class="input rounded-lg w-full max-w-lg shadow-lg {fontSize} {inputClasses}"
		{type}
		{id}
		{placeholder}
		{required}
		{disabled}
		name={id}
		{value}
	/>
	{#if errors}
		{#each errors as error}
			<label for={id} class="label pb-0">
				<span class="label-text-alt text-warning">{error}</span>
			</label>
		{/each}
	{/if}
</div>
