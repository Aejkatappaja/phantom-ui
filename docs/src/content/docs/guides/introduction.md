---
title: Introduction
description: What phantom-ui is and why it exists.
---

Traditional skeleton loaders require you to build and maintain a second version of every component, just for the loading state. When the real component changes, the skeleton drifts out of sync. You end up maintaining two layouts instead of one.

**phantom-ui** takes a different approach. It renders your real component with invisible text, measures the position and size of every leaf element using `getBoundingClientRect()`, and overlays animated shimmer blocks at the exact same coordinates. Container backgrounds and borders stay visible, giving a natural card outline while loading.

Because it is a standard Web Component built with [Lit](https://lit.dev), it works in React, Vue, Svelte, Angular, Solid, Qwik, or plain HTML. No framework adapters needed.

## How it looks

When `loading` is set, your content is rendered but invisible. The component scans the DOM and creates shimmer placeholders that match the exact layout:

- Text blocks become horizontal shimmer bars
- Avatars become circular shimmer blocks
- Buttons, inputs, and images become rectangles matching their size
- Border radius is preserved (circular avatars stay circular)

When `loading` is removed, the shimmer disappears and real content is revealed instantly.

## Key features

- **Zero layout duplication** -- the real component _is_ the skeleton template
- **Runtime DOM measurement** -- always in sync with the actual layout
- **Framework-agnostic** -- one Web Component, every framework
- **Responsive** -- re-measures on resize and DOM mutations
- **Fine-grained control** -- `data-shimmer-ignore` and `data-shimmer-no-children` attributes
- **Dark mode friendly** -- default semi-transparent white colors work on any background
- **~8kb gzipped** -- CDN bundle with Lit included
