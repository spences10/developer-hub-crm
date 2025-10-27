<script lang="ts">
	import { Field, Input } from './ui';

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
	<Field legend="Search">
		<Input
			type="text"
			name="search"
			bind:value
			{placeholder}
			oninput={() => on_change(value)}
		/>
	</Field>
</div>
