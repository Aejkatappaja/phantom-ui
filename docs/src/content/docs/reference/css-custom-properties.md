---
title: CSS Custom Properties
description: Style phantom-ui from the outside using CSS variables.
---

You can override the shimmer appearance globally or per-instance using CSS custom properties. These work in addition to (or instead of) the HTML attributes.

## Available properties

| Property | Default | Description |
| --- | --- | --- |
| `--shimmer-color` | `rgba(255, 255, 255, 0.3)` | Gradient sweep color |
| `--shimmer-duration` | `1.5s` | Animation cycle |
| `--shimmer-bg` | `rgba(255, 255, 255, 0.08)` | Block background |

## Global override

```css
phantom-ui {
  --shimmer-color: rgba(100, 200, 255, 0.3);
  --shimmer-duration: 2s;
  --shimmer-bg: rgba(100, 200, 255, 0.08);
}
```

## Per-instance

```css
.hero-section phantom-ui {
  --shimmer-duration: 2.5s;
}

.sidebar phantom-ui {
  --shimmer-bg: rgba(255, 255, 255, 0.12);
}
```

## Light mode example

The default colors are designed for dark backgrounds. For light themes:

```css
.light phantom-ui,
[data-theme="light"] phantom-ui {
  --shimmer-color: rgba(0, 0, 0, 0.06);
  --shimmer-bg: rgba(0, 0, 0, 0.04);
}
```
