<!--
```
<custom-element-demo>
  <template>
    <script src="https://cdn.jsdelivr.net/npm/@aejkatappaja/phantom-ui/dist/phantom-ui.cdn.js"></script>
    <phantom-ui loading>
      <div style="background:#16213e;border-radius:12px;padding:20px;width:320px;color:#e0e0e0;font-family:system-ui">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
          <div style="width:48px;height:48px;border-radius:50%;background:#0f3460"></div>
          <div>
            <h3 style="margin:0 0 4px">Sarah Chen</h3>
            <p style="margin:0;font-size:13px;color:#8899aa">Senior Engineer</p>
          </div>
        </div>
        <p style="font-size:14px;line-height:1.5">Building scalable distributed systems and mentoring junior engineers.</p>
      </div>
    </phantom-ui>
  </template>
</custom-element-demo>
```
-->

<p align="center">
  <img src="logo-phantom.svg" alt="phantom-ui" width="200" />
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

---

<br />

<div align="center">
  <picture>
    <img src="preview.gif" alt="phantom-ui demo" width="400" />
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

Set `loading` to show the shimmer. Remove it to reveal the real content.

## Framework examples

### React

```tsx
import "@aejkatappaja/phantom-ui";

function ProfileCard({ user, isLoading }: Props) {
  return (
    <phantom-ui loading={isLoading || undefined}>
      <div className="card">
        <img src={user?.avatar ?? "/placeholder.png"} className="avatar" />
        <h3>{user?.name ?? "Placeholder Name"}</h3>
        <p>{user?.bio ?? "A few words about this person go here."}</p>
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
  <phantom-ui :loading="props.loading">
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

<phantom-ui {loading}>
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
    <phantom-ui [attr.loading]="loading() ? '' : null">
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
    <phantom-ui attr:loading={loading() || undefined}>
      <div class="card">
        <img src="/avatar.png" class="avatar" />
        <h3>Ada Lovelace</h3>
        <p>First computer programmer, probably.</p>
      </div>
    </phantom-ui>
  );
}
```

### SSR frameworks (Next.js, Nuxt, SvelteKit, Remix)

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

## TypeScript

The package ships full type definitions. A `postinstall` script automatically detects your framework and generates a `phantom-ui.d.ts` in your `src/` directory. No extra step needed.

Vue, Svelte, and Angular work out of the box without any type declaration.

If the postinstall did not run (CI, monorepos, `--ignore-scripts`), you can generate it manually:

```bash
npx @aejkatappaja/phantom-ui init    # npm
bunx @aejkatappaja/phantom-ui init   # bun
pnpx @aejkatappaja/phantom-ui init   # pnpm
yarn dlx @aejkatappaja/phantom-ui init  # yarn
```

<details>
<summary>Or create the file yourself:</summary>

**React**

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

## Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `loading` | `boolean` | `false` | Show shimmer overlay or real content |
| `shimmer-color` | `string` | `rgba(255,255,255,0.3)` | Color of the animated gradient sweep |
| `background-color` | `string` | `rgba(255,255,255,0.08)` | Background of each shimmer block |
| `duration` | `number` | `1.5` | Animation cycle in seconds |
| `fallback-radius` | `number` | `4` | Border radius (px) for flat elements like text |

## Fine-grained control

Two data attributes let you control which elements get shimmer treatment:

**`data-shimmer-ignore`** keeps an element and all its descendants visible during loading. Useful for logos, brand marks, or live indicators that should always be shown.

**`data-shimmer-no-children`** captures the element as one single shimmer block instead of recursing into its children. Useful for dense metric groups that should appear as a single placeholder.

```html
<phantom-ui loading>
  <div class="dashboard">
    <div class="logo" data-shimmer-ignore>ACME</div>
    <div class="kpi-row" data-shimmer-no-children>
      <span>$48.2k</span>
      <span>2,847 users</span>
      <span>42ms p99</span>
    </div>
    <div class="content">
      <p>Each leaf element here gets its own shimmer block.</p>
    </div>
  </div>
</phantom-ui>
```

## How it works

1. Your real content is rendered in the DOM with `color: transparent` and media elements hidden. Container backgrounds and borders stay visible, preserving the natural card/section outline.

2. The component walks the DOM tree and identifies "leaf" elements: text nodes, images, buttons, inputs, and anything without child elements. Container divs are recursed into, not captured.

3. Each leaf element is measured with `getBoundingClientRect()` relative to the host. Border radius is read from `getComputedStyle()`. Table cells get special handling to measure actual text width, not cell width.

4. An absolutely-positioned overlay renders one shimmer block per measured element, with a CSS gradient animation sweeping across each block.

5. A `ResizeObserver` and `MutationObserver` re-measure automatically when the layout changes (window resize, content injection, DOM mutations).

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
```

The `examples/` directory contains test apps for React, Vue, Solid, Angular, and Qwik, each wired to the local package.

## License

MIT
