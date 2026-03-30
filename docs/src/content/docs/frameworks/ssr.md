---
title: SSR Frameworks
description: Using phantom-ui with Next.js, Nuxt, SvelteKit, and Remix.
---

phantom-ui uses browser APIs (`getBoundingClientRect`, `ResizeObserver`, `customElements`) to measure the DOM. The import must happen client-side only.

The `<phantom-ui>` HTML tag can safely exist in server-rendered markup. The browser treats it as an unknown element until hydration, then the Web Component activates. Content renders normally on the server, which is good for SEO.

## Next.js

```tsx
"use client";
import { useState, useEffect } from "react";

export default function UserCard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    import("@aejkatappaja/phantom-ui");
    fetchUser().then(setUser);
  }, []);

  return (
    <phantom-ui loading={!user || undefined}>
      <div className="card">
        <h3>{user?.name ?? "Placeholder Name"}</h3>
        <p>{user?.bio ?? "A short bio goes here."}</p>
      </div>
    </phantom-ui>
  );
}
```

The `"use client"` directive is required. The dynamic `import("@aejkatappaja/phantom-ui")` ensures the Web Component only registers in the browser.

## Nuxt

```vue
<script setup>
import { ref, onMounted } from "vue";

const user = ref(null);
const loading = ref(true);

onMounted(async () => {
  import("@aejkatappaja/phantom-ui");
  user.value = await fetchUser();
  loading.value = false;
});
</script>

<template>
  <ClientOnly>
    <phantom-ui :loading="loading">
      <div class="card">
        <h3>{{ user?.name ?? "Placeholder Name" }}</h3>
        <p>{{ user?.bio ?? "A short bio goes here." }}</p>
      </div>
    </phantom-ui>
  </ClientOnly>
</template>
```

Wrap in `<ClientOnly>` and import in `onMounted`.

## SvelteKit

```svelte
<script>
  import { onMount } from "svelte";

  let user = $state(null);
  let loading = $state(true);

  onMount(async () => {
    import("@aejkatappaja/phantom-ui");
    user = await fetchUser();
    loading = false;
  });
</script>

<phantom-ui {loading}>
  <div class="card">
    <h3>{user?.name ?? "Placeholder Name"}</h3>
    <p>{user?.bio ?? "A short bio goes here."}</p>
  </div>
</phantom-ui>
```

## Remix

```tsx
import { useEffect, useState } from "react";
import { useLoaderData } from "@remix-run/react";

export default function UserCard() {
  const [ready, setReady] = useState(false);
  const data = useLoaderData();

  useEffect(() => {
    import("@aejkatappaja/phantom-ui").then(() => setReady(true));
  }, []);

  return (
    <phantom-ui loading={!ready || undefined}>
      <div className="card">
        <h3>{data.name}</h3>
        <p>{data.bio}</p>
      </div>
    </phantom-ui>
  );
}
```
