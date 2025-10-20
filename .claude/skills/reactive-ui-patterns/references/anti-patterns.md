# Anti-Patterns to Avoid

## 1. Manual Refresh Keys

❌ **DON'T:**
```svelte
let refresh_key = $state(0);

{#key refresh_key}
  {#await get_data() then data}
    <!-- Forces full re-render -->
  {/await}
{/key}
```

✅ **DO:** Let remote functions handle refresh automatically

## 2. Using `{#await}` for Inline Editing

❌ **DON'T:**
```svelte
{#await get_data() then items}
  <!-- Re-renders entire block, causes page jump -->
{/await}
```

✅ **DO:** Use `.current` property pattern

## 3. Hiding Content During Refresh

❌ **DON'T:**
```svelte
{#if data_query.loading}
  <p>Loading...</p>  <!-- Hides on every refresh -->
{/if}
```

✅ **DO:** Only hide when `.current === undefined`

## 4. Manual Refresh Callbacks

❌ **DON'T:**
```svelte
<Component on_change={() => query.refresh()} />
```

✅ **DO:** Remote functions refresh automatically

## 5. Using `window.location.reload()`

❌ **DON'T:** Force page reload - defeats reactivity

✅ **DO:** Use `query.refresh()` for surgical updates
