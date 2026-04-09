---
title: Data Attributes
description: Fine-grained control over which elements get shimmer treatment.
---

These attributes go on **child elements** inside `<phantom-ui>`, not on the component itself.

## `data-shimmer-ignore`

Excludes an element and all its descendants from shimmer. The element stays fully visible during loading.

Use this for logos, brand marks, live indicators, or anything that should always be shown.

```html
<phantom-ui loading>
  <div class="dashboard">
    <div class="logo" data-shimmer-ignore>ACME</div>
    <div class="content">
      <p>This gets a shimmer block.</p>
    </div>
  </div>
</phantom-ui>
```

The logo stays visible. The paragraph gets a shimmer block.

## `data-shimmer-no-children`

Captures the element as a single shimmer block without recursing into its children. The entire element becomes one placeholder instead of generating blocks for each child.

Use this for dense metric groups, icon rows, or compact UI clusters that should appear as one loading block.

```html
<phantom-ui loading>
  <div class="dashboard">
    <div class="kpi-row" data-shimmer-no-children>
      <span>$48.2k</span>
      <span>2,847 users</span>
      <span>42ms p99</span>
    </div>
  </div>
</phantom-ui>
```

Without `data-shimmer-no-children`, each `<span>` would get its own shimmer block. With it, the entire `kpi-row` becomes one block.

## `data-shimmer-width` / `data-shimmer-height`

Override the measured dimensions (in pixels) of an element. By default, phantom-ui uses `getBoundingClientRect()` and skips elements with zero dimensions. These attributes let you force a skeleton block with explicit sizing.

Use this for dynamically sized elements that have no dimensions yet when the skeleton is generated — images without explicit `width`/`height`, containers filled by JavaScript, or any element whose size depends on data that hasn't loaded.

```html
<phantom-ui loading>
  <div class="profile">
    <img src="/avatar.jpg" data-shimmer-width="80" data-shimmer-height="80" />
    <div class="bio" data-shimmer-height="60">
      <!-- Content injected by JS after fetch -->
    </div>
  </div>
</phantom-ui>
```

You can set one or both attributes. If only one is set, the other falls back to the measured value from `getBoundingClientRect()`.
