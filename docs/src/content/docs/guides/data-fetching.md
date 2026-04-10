---
title: Data Fetching
description: How phantom-ui works with TanStack Query, SWR, and other data fetching libraries.
---

phantom-ui generates skeletons by measuring real DOM elements at runtime. You don't need to build separate skeleton components — your existing layout **is** the template.

The only requirement is that your elements have dimensions during loading. In most cases, your markup already provides this via headings, paragraphs (which have `line-height`), and images with `width`/`height`. When content is fully conditional (e.g. `user?.name`), provide a short fallback so the element has a size to measure — the text itself is invisible during loading.

## TanStack Query

```tsx
import { useQuery } from "@tanstack/react-query";
import "@aejkatappaja/phantom-ui";

function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetch(`/api/users/${userId}`).then((r) => r.json()),
  });

  return (
    <phantom-ui loading={isLoading}>
      <div class="card">
        <img src={user?.avatar ?? "/placeholder.png"} width="48" height="48" />
        <h3>{user?.name ?? "Placeholder Name"}</h3>
        <p>{user?.bio ?? "A short bio goes here."}</p>
      </div>
    </phantom-ui>
  );
}
```

While `isLoading` is true:

1. `user` is undefined — the `??` fallbacks ensure each element has a size in the DOM
2. phantom-ui hides the text (CSS `transparent`) and measures element positions
3. Shimmer blocks are drawn at the exact same coordinates

The fallback text doesn't matter — `"x"` would work just as well as `"Placeholder Name"`. It only exists so the element isn't empty and has dimensions to measure.

When the query resolves, `isLoading` becomes false, `loading` is removed, and the real content appears.

## SWR

```tsx
import useSWR from "swr";
import "@aejkatappaja/phantom-ui";

function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading } = useSWR(`/api/users/${userId}`);

  return (
    <phantom-ui loading={isLoading}>
      <div class="card">
        <img src={user?.avatar ?? "/placeholder.png"} width="48" height="48" />
        <h3>{user?.name ?? "Placeholder Name"}</h3>
        <p>{user?.bio ?? "A short bio goes here."}</p>
      </div>
    </phantom-ui>
  );
}
```

## Vue + composables

```vue
<script setup lang="ts">
import { ref, onMounted } from "vue";
import "@aejkatappaja/phantom-ui";

const user = ref(null);
const loading = ref(true);

onMounted(async () => {
  const res = await fetch("/api/user/1");
  user.value = await res.json();
  loading.value = false;
});
</script>

<template>
  <phantom-ui :loading="loading">
    <div class="card">
      <img :src="user?.avatar ?? '/placeholder.png'" width="48" height="48" />
      <h3>{{ user?.name ?? "Placeholder Name" }}</h3>
      <p>{{ user?.bio ?? "A short bio goes here." }}</p>
    </div>
  </phantom-ui>
</template>
```

## Lists

For dynamic lists where the data hasn't loaded yet, use `count` to repeat a single template row:

```tsx
const { data: users, isLoading } = useQuery({
  queryKey: ["users"],
  queryFn: () => fetch("/api/users").then((r) => r.json()),
});

return (
  <phantom-ui loading={isLoading} count={5} count-gap={8}>
    {isLoading ? (
      <div class="row">
        <img src="/placeholder.png" width="32" height="32" />
        <span>Placeholder Name</span>
        <span>placeholder@email.com</span>
      </div>
    ) : (
      users?.map((u) => (
        <div key={u.id} class="row">
          <img src={u.avatar} width="32" height="32" />
          <span>{u.name}</span>
          <span>{u.email}</span>
        </div>
      ))
    )}
  </phantom-ui>
);
```

phantom-ui measures the single template row and duplicates the skeleton blocks vertically for each `count`. When loading is done, only the real list items are shown.

## Why does this work?

Unlike build-time approaches that capture skeletons via a headless browser, phantom-ui measures the DOM at runtime. This means:

- No build step or CLI required
- Skeletons are always in sync with your layout (responsive, dynamic content, DOM mutations)
- Works with any framework, including vanilla HTML and CDN usage
- No separate skeleton components to maintain

The only requirement is that elements have dimensions during loading. Static markup (headings, labels, containers with CSS sizing) works out of the box. For conditional content like `user?.name`, a simple `??` fallback gives the element a size — the text itself is never visible.
