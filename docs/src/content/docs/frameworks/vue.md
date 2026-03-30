---
title: Vue
description: Using phantom-ui with Vue.
---

## Setup

```bash
bun add phantom-ui
```

No extra TypeScript setup needed. Vue picks up types from `HTMLElementTagNameMap` automatically.

## Usage

```vue
<script setup lang="ts">
import { ref, onMounted } from "vue";
import "phantom-ui";

const user = ref(null);
const loading = ref(true);

onMounted(async () => {
  user.value = await fetchUser();
  loading.value = false;
});
</script>

<template>
  <phantom-ui :loading="loading">
    <div class="card">
      <img :src="user?.avatar ?? '/placeholder.png'" class="avatar" />
      <h3>{{ user?.name ?? "Placeholder Name" }}</h3>
      <p>{{ user?.bio ?? "A short bio goes here." }}</p>
    </div>
  </phantom-ui>
</template>
```

Vue handles boolean attributes correctly. `:loading="true"` sets the attribute, `:loading="false"` removes it.
