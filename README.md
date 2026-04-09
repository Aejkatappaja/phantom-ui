<p align="center">
  <img src=".github/assets/logo-phantom.svg" alt="phantom-ui" width="200" />
  <br />
  <img src=".github/assets/phantom-ui-text.svg" alt="phantom-ui" width="320" />
</p>

<p align="center">
  <strong>Structure-aware skeleton loader. One Web Component. Every framework.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@aejkatappaja/phantom-ui"><img src="https://img.shields.io/npm/v/@aejkatappaja/phantom-ui.svg?style=flat-square" alt="npm version" /></a>
  <img src="https://img.shields.io/badge/minzipped-~8kb-blue?style=flat-square" alt="bundle size" />
  <a href="https://github.com/Aejkatappaja/phantom-ui/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@aejkatappaja/phantom-ui?style=flat-square" alt="license" /></a>
  <a href="https://www.webcomponents.org/element/@aejkatappaja/phantom-ui"><img src="https://img.shields.io/badge/webcomponents.org-published-blue.svg?style=flat-square" alt="Published on webcomponents.org" /></a>
</p>

<p align="center">
  <a href="https://aejkatappaja.github.io/phantom-ui/">Documentation</a> &middot;
  <a href="https://aejkatappaja.github.io/phantom-ui/demo/">Live Demo</a>
</p>

---

<br />

<div align="center">
  <picture>
    <img src=".github/assets/phantom-ui-preview.svg" alt="phantom-ui demo" width="640" />
  </picture>
</div>

<br />

Stop building skeleton screens by hand. Wrap your real UI in `<phantom-ui>` and it generates shimmer placeholders automatically by measuring your actual DOM at runtime.

No separate skeleton components to maintain. No copy-pasting layouts. The real component _is_ the skeleton template.

## Why

Traditional skeleton loaders require you to build and maintain a second version of every component, just for the loading state. When the real component changes, the skeleton drifts out of sync.

`phantom-ui` takes a different approach. It renders your real component with invisible text, measures the position and size of every leaf element (`getBoundingClientRect`), and overlays animated shimmer blocks at the exact same coordinates. Container backgrounds and borders stay visible, giving a natural card outline while loading.

Because it is a standard Web Component (built with Lit), it works in React, Vue, Svelte, Angular, Solid, Qwik, or plain HTML. No framework adapters needed.

## Install

```bash
bun add @aejkatappaja/phantom-ui     # bun
npm install @aejkatappaja/phantom-ui # npm
pnpm add @aejkatappaja/phantom-ui    # pnpm
yarn add @aejkatappaja/phantom-ui    # yarn
```

Or drop in a script tag with no build step:

```html
<script src="https://cdn.jsdelivr.net/npm/@aejkatappaja/phantom-ui/dist/phantom-ui.cdn.js"></script>
```

## Automatic setup

A `postinstall` script runs after installation and detects your project setup. It handles two things:

**JSX type declarations** — For React, Solid, and Qwik, it generates a `phantom-ui.d.ts` in your `src/` directory so `<phantom-ui>` is recognized in JSX. Vue, Svelte, and Angular work out of the box without any type declaration.

**SSR pre-hydration CSS** — For Next.js, Nuxt, SvelteKit, Remix, and Qwik, it adds `import "@aejkatappaja/phantom-ui/ssr.css"` to your layout file to prevent content flash before hydration (see [Pre-hydration CSS](#pre-hydration-css)).

If the postinstall did not run (CI, monorepos, `--ignore-scripts`), you can trigger it manually:

```bash
npx @aejkatappaja/phantom-ui init    # npm
bunx @aejkatappaja/phantom-ui init   # bun
pnpx @aejkatappaja/phantom-ui init   # pnpm
yarn dlx @aejkatappaja/phantom-ui init  # yarn
```

<details>
<summary>Manual JSX type declarations</summary>

**React / Next.js / Remix**

```typescript
import type { PhantomUiAttributes } from "@aejkatappaja/phantom-ui";

declare module "react/jsx-runtime" {
  export namespace JSX {
    interface IntrinsicElements {
      "phantom-ui": PhantomUiAttributes;
    }
  }
}
```

**Solid**

```typescript
import type { SolidPhantomUiAttributes } from "@aejkatappaja/phantom-ui";

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      "phantom-ui": SolidPhantomUiAttributes;
    }
  }
}
```

**Qwik**

```typescript
import type { PhantomUiAttributes } from "@aejkatappaja/phantom-ui";

declare module "@builder.io/qwik" {
  namespace QwikJSX {
    interface IntrinsicElements {
      "phantom-ui": PhantomUiAttributes & Record<string, unknown>;
    }
  }
}
```

</details>

<details>
<summary>Manual SSR CSS import</summary>

Add this import to your root layout file:

```js
import "@aejkatappaja/phantom-ui/ssr.css";
```

| Framework | Layout file |
| --- | --- |
| Next.js (App Router) | `app/layout.tsx` |
| Next.js (Pages) | `pages/_app.tsx` |
| Nuxt | `app.vue` |
| SvelteKit | `src/routes/+layout.svelte` |
| Remix | `app/root.tsx` |
| Qwik | `src/root.tsx` |

</details>

## Quick start

```html
<phantom-ui loading>
  <div class="card">
    <img src="avatar.png" width="48" height="48" style="border-radius: 50%" />
    <h3>Ada Lovelace</h3>
    <p>First computer programmer, probably.</p>
  </div>
</phantom-ui>
```

Set `loading` to show the shimmer. Remove it to reveal the real content. All child elements (including deeply nested images and media) are automatically hidden during loading.

## Data fetching

phantom-ui works with any data fetching approach. The pattern: render placeholder content while loading, real content when done. The placeholder text is invisible (CSS transparent) and only used to generate the skeleton shape.

### TanStack Query

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

While `isLoading` is true, the placeholder text (`"Placeholder Name"`, `"A short bio goes here."`) is rendered invisibly and phantom-ui generates shimmer blocks matching their exact position and size. When the query resolves, `loading` is removed and the real content appears.

### SWR

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

### Lists

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

## Framework examples

### React

```tsx
import "@aejkatappaja/phantom-ui";

function ProfileCard({ user, isLoading }: Props) {
  return (
    <phantom-ui loading={isLoading || undefined} animation="pulse" reveal={0.3}>
      <div className="card">
        <img src={user?.avatar ?? "/placeholder.png"} className="avatar" />
        <h3>{user?.name ?? "Placeholder Name"}</h3>
        <p>{user?.bio ?? "A few words about this person go here."}</p>
      </div>
    </phantom-ui>
  );
}

// List with repeat mode
function UserList({ users, isLoading }: Props) {
  return (
    <phantom-ui loading={isLoading || undefined} count={5} count-gap={8}>
      <div className="row">
        <img src="/placeholder.png" width="32" height="32" />
        <span>Placeholder Name</span>
      </div>
    </phantom-ui>
  );
}
```

### Vue

```vue
<script setup lang="ts">
import "@aejkatappaja/phantom-ui";

const props = defineProps<{ loading: boolean }>();
</script>

<template>
  <phantom-ui :loading="props.loading" animation="breathe" stagger="0.05">
    <div class="card">
      <img src="/avatar.png" class="avatar" />
      <h3>Ada Lovelace</h3>
      <p>First computer programmer, probably.</p>
    </div>
  </phantom-ui>
</template>
```

### Svelte

```svelte
<script lang="ts">
  import "@aejkatappaja/phantom-ui";

  export let loading = true;
</script>

<phantom-ui {loading} reveal={0.4} stagger={0.03}>
  <div class="card">
    <img src="/avatar.png" alt="avatar" class="avatar" />
    <h3>Ada Lovelace</h3>
    <p>First computer programmer, probably.</p>
  </div>
</phantom-ui>
```

### Angular

```typescript
import { Component, signal, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import "@aejkatappaja/phantom-ui";

@Component({
  selector: "app-profile",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <phantom-ui [attr.loading]="loading() ? '' : null" animation="pulse">
      <div class="card">
        <img src="/avatar.png" class="avatar" />
        <h3>Ada Lovelace</h3>
        <p>First computer programmer, probably.</p>
      </div>
    </phantom-ui>
  `,
})
export class ProfileComponent {
  loading = signal(true);
}
```

### Solid

```tsx
import { createSignal } from "solid-js";
import "@aejkatappaja/phantom-ui";

function ProfileCard() {
  const [loading, setLoading] = createSignal(true);

  return (
    <phantom-ui attr:loading={loading() || undefined} animation="shimmer" stagger={0.05}>
      <div class="card">
        <img src="/avatar.png" class="avatar" />
        <h3>Ada Lovelace</h3>
        <p>First computer programmer, probably.</p>
      </div>
    </phantom-ui>
  );
}
```

### SSR frameworks (Next.js, Nuxt, SvelteKit, Remix, Qwik)

The component needs browser APIs to measure the DOM. Import it client-side only:

```tsx
// Next.js
"use client";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => { import("@aejkatappaja/phantom-ui"); }, []);
  return <phantom-ui loading>...</phantom-ui>;
}
```

```vue
<!-- Nuxt -->
<script setup>
onMounted(() => import("@aejkatappaja/phantom-ui"));
</script>

<template>
  <ClientOnly>
    <phantom-ui loading>...</phantom-ui>
  </ClientOnly>
</template>
```

```svelte
<!-- SvelteKit -->
<script>
  import { onMount } from "svelte";
  onMount(() => import("@aejkatappaja/phantom-ui"));
</script>
```

The `<phantom-ui>` tag can exist in server-rendered HTML. The browser treats it as an unknown element until hydration, then the Web Component activates and measures the DOM. Content renders normally on the server, which is good for SEO.

#### Pre-hydration CSS

Before JavaScript loads, content inside `<phantom-ui loading>` can briefly flash as visible text. The package ships a small CSS file that hides this content immediately, with no JS needed:

```css
import "@aejkatappaja/phantom-ui/ssr.css";
```

The `postinstall` script automatically detects SSR frameworks and adds this import to your layout file (e.g. `app/layout.tsx` for Next.js, `app.vue` for Nuxt, `+layout.svelte` for SvelteKit). If you use the CDN build, add the rules directly in your `<head>`:

```html
<style>
  phantom-ui[loading] * {
    -webkit-text-fill-color: transparent !important;
    pointer-events: none;
    user-select: none;
  }
  phantom-ui[loading] img, phantom-ui[loading] svg,
  phantom-ui[loading] video, phantom-ui[loading] canvas,
  phantom-ui[loading] button, phantom-ui[loading] [role="button"] {
    opacity: 0 !important;
  }
</style>
```

## Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `loading` | `boolean` | `false` | Show shimmer overlay or real content |
| `animation` | `string` | `shimmer` | Animation mode: `shimmer`, `pulse`, `breathe`, or `solid` |
| `shimmer-color` | `string` | `rgba(255,255,255,0.3)` | Color of the animated gradient sweep |
| `background-color` | `string` | `rgba(255,255,255,0.08)` | Background of each shimmer block |
| `duration` | `number` | `1.5` | Animation cycle in seconds |
| `stagger` | `number` | `0` | Delay in seconds between each block's animation start |
| `reveal` | `number` | `0` | Fade-out duration in seconds when loading ends |
| `count` | `number` | `1` | Number of skeleton rows to repeat from a single template |
| `count-gap` | `number` | `0` | Gap in pixels between repeated rows |
| `fallback-radius` | `number` | `4` | Border radius (px) for flat elements like text |

## Fine-grained control

Data attributes let you control which elements get shimmer treatment and how they are measured:

**`data-shimmer-ignore`** keeps an element and all its descendants visible during loading. Useful for logos, brand marks, or live indicators that should always be shown.

**`data-shimmer-no-children`** captures the element as one single shimmer block instead of recursing into its children. Useful for dense metric groups that should appear as a single placeholder.

**`data-shimmer-width`** / **`data-shimmer-height`** override the measured dimensions (in pixels) of an element. Useful for dynamically sized elements that have no dimensions yet when the skeleton is generated (e.g. images without explicit `width`/`height`, containers filled by JS). Elements with zero dimensions are normally skipped — these attributes let you force a skeleton block.

```html
<phantom-ui loading>
  <div class="dashboard">
    <div class="logo" data-shimmer-ignore>ACME</div>
    <div class="kpi-row" data-shimmer-no-children>
      <span>$48.2k</span>
      <span>2,847 users</span>
      <span>42ms p99</span>
    </div>
    <img src="/hero.jpg" data-shimmer-width="600" data-shimmer-height="400" />
    <div class="content">
      <p>Each leaf element here gets its own shimmer block.</p>
    </div>
  </div>
</phantom-ui>
```

## Repeat mode

When loading a dynamic list or table, you often don't have the data yet to render N rows. The `count` attribute lets you define a single template element and generate multiple skeleton rows from it:

```html
<phantom-ui loading count="5" count-gap="8">
  <div class="user-row">
    <img src="avatar.png" width="32" height="32" />
    <span>John Doe</span>
    <span>john@acme.io</span>
  </div>
</phantom-ui>
```

The component measures the template once, then duplicates the skeleton blocks vertically for each count. `count-gap` adds spacing (in pixels) between repeated rows. When `loading` is removed, only the real template element is shown.

This is useful with framework loops where the list is empty before data loads:

```tsx
// React
<phantom-ui loading={!users} count={5} count-gap={8}>
  <div className="row-template">
    <img src="/placeholder.png" width="32" height="32" />
    <span>Placeholder Name</span>
    <span>placeholder@email.com</span>
  </div>
</phantom-ui>
```

## How it works

1. Your real content is rendered in the DOM with `color: transparent` and media elements hidden. Container backgrounds and borders stay visible, preserving the natural card/section outline.

2. The component walks the DOM tree and identifies "leaf" elements: text nodes, images, buttons, inputs, and anything without child elements. Container divs are recursed into, not captured.

3. Each leaf element is measured with `getBoundingClientRect()` relative to the host. Border radius is read from `getComputedStyle()`. Table cells get special handling to measure actual text width, not cell width.

4. An absolutely-positioned overlay renders one shimmer block per measured element, with a CSS gradient animation sweeping across each block.

5. A `ResizeObserver`, `MutationObserver`, and media `load` listener re-measure automatically when the layout changes (window resize, content injection, DOM mutations, or images/videos finishing loading).

6. When `loading` is removed, the overlay is destroyed and real content is revealed.

## CSS custom properties

You can style the component from the outside using CSS custom properties instead of (or in addition to) attributes:

```css
phantom-ui {
  --shimmer-color: rgba(100, 200, 255, 0.3);
  --shimmer-duration: 2s;
  --shimmer-bg: rgba(100, 200, 255, 0.08);
}
```

## Custom Elements Manifest

The package ships a `custom-elements.json` manifest, which gives IDE autocomplete, Storybook autodocs, and framework tooling the full picture of attributes, properties, slots, and types.

## Bundle size

The CDN build (Lit included) is ~22kb / ~8kb gzipped.

When used as an ES module with a bundler, Lit is likely already in your dependency tree, bringing the component cost down to under 2kb.

## Development

```bash
bun install
bun run storybook       # dev server on :6006
bun run build           # tsc + custom elements manifest + CDN bundle
bun run lint            # biome check
bun run lint:fix        # biome auto-fix
bun run test            # browser tests (Chromium)
bun run test:all        # browser tests (Chromium + Firefox + WebKit)
bun run playground      # local server to test the component
```

The `examples/` directory contains test apps for React, Vue, Solid, Angular, and Qwik, each wired to the local package.

## Acknowledgements

The structure-aware approach is inspired by [shimmer-from-structure](https://github.com/darula-hpp/shimmer-from-structure), which pioneered the idea of measuring real DOM to generate skeleton placeholders. phantom-ui reimagines this concept as a single universal Web Component instead of framework-specific adapters.

## License

MIT
