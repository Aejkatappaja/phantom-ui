---
title: Content Security Policy
description: How phantom-ui delivers its hiding styles under a strict CSP, and what to expect on older Safari.
---

phantom-ui hides your real content while loading with a stylesheet it applies at runtime. Under a Content Security Policy that omits `unsafe-inline`, how that stylesheet reaches the page matters.

## What works out of the box

Nothing to configure. A policy like this is enough:

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'
```

The hiding rules are delivered as a [constructed stylesheet](https://developer.mozilla.org/en-US/docs/Web/API/Document/adoptedStyleSheets), which `style-src` does not block. The positioned shimmer blocks are written through the CSSOM, which is also allowed.

## Older Safari

Constructed stylesheets landed in Safari 16.4 (March 2023). Below that, phantom-ui falls back to a `<style>` element, the same delivery it used before, which a strict `style-src` **does** block.

On that combination, Safari older than 16.4 **and** a policy without `unsafe-inline`, your content stays visible behind the skeleton instead of being hidden. Everything else still works: the blocks render and animate.

Two ways to cover it if you support those browsers:

- add a [nonce](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/style-src#unsafe_inline_styles) to your policy and set `window.litNonce` to the same value before phantom-ui loads. The fallback element carries it, and so do Lit's own stylesheets
- or ship [`ssr.css`](/phantom-ui/frameworks/ssr/#pre-hydration-css) as a real stylesheet, which no policy blocks

## Inside another component's shadow root

If you render `<phantom-ui>` inside a shadow root of your own, the rules are scoped to that root rather than the document, since document styles do not cross a shadow boundary. This is automatic and needs no configuration.
