---
title: Data Fetching
description: How phantom-ui works with TanStack Query, SWR, and other data fetching libraries.
---

phantom-ui generates skeletons by measuring real DOM elements at runtime. You don't need to fetch your data first. Instead, render placeholder content while loading. The placeholder text is invisible (CSS transparent) and only serves as the skeleton template.

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
    <phantom-ui loading={isLoading || undefined}>
      <div className="card">
        <img src={user?.avatar ?? "/placeholder.png"} width="48" height="48" />
        <h3>{user?.name ?? "Placeholder Name"}</h3>
        <p>{user?.bio ?? "A short bio goes here."}</p>
      </div>
    </phantom-ui>
  );
}
```

While `isLoading` is true:

1. `user` is undefined, so the `??` fallbacks render placeholder text
2. phantom-ui makes the text invisible and measures its position/size
3. Shimmer blocks are overlayed at the exact same coordinates

When the query resolves, `isLoading` becomes false, `loading` is removed, and the real content appears.

## SWR

```tsx
import useSWR from "swr";
import "@aejkatappaja/phantom-ui";

function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading } = useSWR(`/api/users/${userId}`);

  return (
    <phantom-ui loading={isLoading || undefined}>
      <div className="card">
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
  <phantom-ui loading={isLoading || undefined} count={5} count-gap={8}>
    {isLoading ? (
      <div className="row">
        <img src="/placeholder.png" width="32" height="32" />
        <span>Placeholder Name</span>
        <span>placeholder@email.com</span>
      </div>
    ) : (
      users?.map((u) => (
        <div key={u.id} className="row">
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

## Why placeholder content?

Unlike build-time approaches that capture skeletons via a headless browser, phantom-ui measures the DOM at runtime. This means:

- No build step or CLI required
- Skeletons are always in sync with your layout (responsive, dynamic content, DOM mutations)
- Works with any framework, including vanilla HTML and CDN usage
- No `.json` files to keep in sync when your components change

The tradeoff is that you provide placeholder content as a template. In practice, this is the same `??` fallback pattern you already use for conditional rendering.
