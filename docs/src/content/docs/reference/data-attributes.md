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
