# The `.current` Property

The `.current` property retains previous data during refresh, enabling
smooth in-place updates without page jumps.

## Query Object Properties

```typescript
const query = get_data();

query.loading; // boolean - true when fetching
query.error; // Error | null - error state
query.current; // T | undefined - persists during refresh!
```

## The Three States

1. **Initial load**: `.current === undefined` + `.loading === true` -
   Show spinner
2. **During refresh**: `.current` has data + `.loading === true` -
   Keep showing data with optional opacity
3. **After refresh**: `.current` updated + `.loading === false` - Show
   fresh data

## Example

```svelte
<script>
	const data_query = get_data();
</script>

{#if data_query.error}
	<p>Error</p>
{:else if data_query.loading && data_query.current === undefined}
	<p>Loading...</p>
{:else}
	{@const data = data_query.current ?? []}
	<div class:opacity-60={data_query.loading}>
		<!-- Content stays visible during refresh -->
	</div>
{/if}
```
