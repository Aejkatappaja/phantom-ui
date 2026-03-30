---
title: Quick Start
description: Get shimmer loading in 30 seconds.
---

## 1. Install

```bash
bun add @aejkatappaja/phantom-ui
```

## 2. Import

```js
import "@aejkatappaja/phantom-ui";
```

Or use the CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@aejkatappaja/phantom-ui/dist/phantom-ui.cdn.js"></script>
```

## 3. Wrap your content

```html
<phantom-ui loading>
  <div class="card">
    <img src="avatar.png" width="48" height="48" style="border-radius: 50%" />
    <h3>Ada Lovelace</h3>
    <p>First computer programmer, probably.</p>
  </div>
</phantom-ui>
```

Set the `loading` attribute to show shimmer. Remove it to reveal content.

## 4. Toggle loading state

In your application code, toggle the `loading` attribute based on your data fetching state:

```js
const skeleton = document.querySelector("phantom-ui");

// Show loading
skeleton.setAttribute("loading", "");

// Fetch data...
const data = await fetchUser();

// Reveal content
skeleton.removeAttribute("loading");
```

That's it. The component measures your real DOM and generates shimmer blocks automatically. No skeleton layout to build or maintain.
