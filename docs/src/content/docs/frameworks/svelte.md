---
title: Svelte
description: Using phantom-ui with Svelte.
---

## Setup

```bash
bun add phantom-ui
```

No extra TypeScript setup needed. Svelte picks up types from `HTMLElementTagNameMap` automatically.

## Usage

```svelte
<script lang="ts">
  import "phantom-ui";
  import { onMount } from "svelte";

  let user = $state(null);
  let loading = $state(true);

  onMount(async () => {
    user = await fetchUser();
    loading = false;
  });
</script>

<phantom-ui {loading}>
  <div class="card">
    <img src={user?.avatar ?? "/placeholder.png"} alt="avatar" class="avatar" />
    <h3>{user?.name ?? "Placeholder Name"}</h3>
    <p>{user?.bio ?? "A short bio goes here."}</p>
  </div>
</phantom-ui>
```

Svelte handles boolean attributes natively. `{loading}` is shorthand for `loading={loading}`, and Svelte removes the attribute when the value is falsy.
