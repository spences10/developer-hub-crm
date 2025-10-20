---
name: form-patterns
description: DaisyUI v5 form patterns. Use for inputs, selects, textareas, validation, and form structure with fieldset/legend.
---

# Form Patterns

## Quick Start

```svelte
<script lang="ts">
  import { my_form } from './my.remote';
</script>

<form {...my_form} class="space-y-4">
  <fieldset class="fieldset">
    <legend class="fieldset-legend">Name</legend>
    <label class="validator input w-full">
      <input type="text" name="name" placeholder="Your name" class="grow" required />
    </label>
  </fieldset>

  <fieldset class="fieldset">
    <legend class="fieldset-legend">Email</legend>
    <label class="validator input w-full">
      <input type="email" name="email" placeholder="Email" class="grow" required />
    </label>
  </fieldset>

  {#if my_form.error}
    <div class="alert alert-error">
      <span>{my_form.error}</span>
    </div>
  {/if}

  <button class="btn btn-block btn-primary" type="submit">Submit</button>
</form>
```

## Core Principles

- v5 uses `fieldset`/`fieldset-legend` (NOT `form-control`/`label-text`)
- Input wrapper: `<label class="input w-full">` contains the `<input>`
- Actual input gets `class="grow"`
- Always add `w-full` to label for full-width inputs
- Use `validator` class for automatic validation UI
- Selects and textareas apply classes directly (no wrapper)

## Common Patterns

### Input with Validation

```svelte
<fieldset class="fieldset">
  <legend class="fieldset-legend">Password</legend>
  <label class="validator input w-full">
    <input
      type="password"
      name="password"
      class="grow"
      required
      minlength="8"
    />
  </label>
  <p class="label">Must be at least 8 characters</p>
</fieldset>
```

### Select (v5 Pattern)

```svelte
<fieldset class="fieldset">
  <legend class="fieldset-legend">Type</legend>
  <select name="type" class="select w-full" required>
    <option value="" disabled selected>Choose type</option>
    <option value="meeting">Meeting</option>
    <option value="call">Call</option>
  </select>
</fieldset>
```

### Textarea (v5 Pattern)

```svelte
<fieldset class="fieldset">
  <legend class="fieldset-legend">Notes</legend>
  <textarea
    name="notes"
    class="textarea w-full"
    rows="4"
    placeholder="Enter notes..."
  ></textarea>
  <p class="label">Helper text here</p>
</fieldset>
```

## Reference Files

- [references/forms-guide.md](references/forms-guide.md) - Complete DaisyUI v5 form patterns and examples

## Notes

- **Critical:** v5 changed from v4 - don't use old `form-control` pattern
- Don't wrap selects in `<label>` - apply `select` class directly
- No `-bordered` suffix in v5 (borders are default)
- Use `space-y-4` on forms for consistent spacing
- Remote functions provide automatic error states via `my_form.error`
