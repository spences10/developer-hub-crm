<script lang="ts">
	interface Props {
		value: string;
		placeholder: string;
		on_change: (value: string) => void;
	}

	let {
		value = $bindable(),
		placeholder,
		on_change,
	}: Props = $props();
</script>

<div class="mb-6">
	<fieldset class="fieldset">
		<legend class="fieldset-legend">Search</legend>
		<label class="input w-full">
			<input
				type="text"
				bind:value
				{placeholder}
				class="grow"
				oninput={() => on_change(value)}
			/>
		</label>
	</fieldset>
</div>
