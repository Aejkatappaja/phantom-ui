---
title: CSS Custom Properties
description: Style phantom-ui from the outside using CSS variables.
---

You can override the shimmer appearance globally or per-instance using CSS custom properties. These work in addition to (or instead of) the HTML attributes.

## Available properties

| Property | Default | Description |
| --- | --- | --- |
| `--shimmer-color` | `rgba(128, 128, 128, 0.3)` | Gradient sweep color |
| `--shimmer-duration` | `1.5s` | Animation cycle |
| `--shimmer-bg` | `rgba(128, 128, 128, 0.2)` | Block background |
| `--reveal-duration` | `0s` | Fade-out transition when loading ends |

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

## Theme customization

The defaults use neutral grays that work on both light and dark backgrounds. Override them to match your design system:

```css
/* Dark theme */
.dark phantom-ui {
  --shimmer-color: rgba(255, 255, 255, 0.3);
  --shimmer-bg: rgba(255, 255, 255, 0.08);
}

/* Light theme */
.light phantom-ui {
  --shimmer-color: rgba(0, 0, 0, 0.08);
  --shimmer-bg: rgba(0, 0, 0, 0.06);
}
```
