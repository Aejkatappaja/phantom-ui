---
title: How It Works
description: The internal mechanics of phantom-ui's DOM measurement engine.
---

## The algorithm

When `loading` is set, phantom-ui runs through these steps:

### 1. Render content invisibly

The real content is rendered in the DOM but styled to be invisible:

- `color: transparent` hides text while preserving layout
- `opacity: 0` hides images, SVGs, videos, and canvases
- `pointer-events: none` prevents interaction
- Container backgrounds and borders remain visible, giving a natural card outline

This applies to all descendants, not just direct children. A light DOM stylesheet (`phantom-ui[loading] *`) ensures deeply nested media and text are hidden.

### 2. Walk the DOM tree

The component recursively walks all slotted children. For each element, it determines whether it is a "leaf" -- a terminal content node that should become a shimmer block.

An element is a leaf if it is one of these tags: `img`, `svg`, `video`, `canvas`, `iframe`, `input`, `textarea`, `button`, `hr`. Or if it has no child elements (only text nodes).

Container elements like `div`, `section`, `ul` are recursed into, not captured.

### 3. Measure positions

Each leaf element is measured with `getBoundingClientRect()` relative to the host component. The computed `borderRadius` is read from `getComputedStyle()`.

Table cells (`td`, `th`) get special handling: a temporary `<span>` is inserted to measure actual text width rather than the full cell width.

### 4. Render shimmer overlay

An absolutely-positioned overlay is rendered with one div per measured element. Each div is positioned at the exact `{x, y, width, height}` with the correct border radius. A CSS animation sweeps a gradient across each block.

### 5. Re-measure on changes

A `ResizeObserver`, `MutationObserver`, and media `load` listener watch for layout changes. When the container resizes, the DOM mutates, or an image/video finishes loading, measurement is re-triggered on the next animation frame. This means images without explicit `width`/`height` attributes are picked up automatically once they load.

### 6. Reveal

When `loading` is removed, the overlay is destroyed. The invisible styles are removed and real content appears.

## Special behaviors

### `data-shimmer-ignore`

If an element has this attribute, it and all descendants are skipped entirely during the DOM walk. The element stays visible during loading.

### `data-shimmer-no-children`

If an element has this attribute, it is captured as a single block without recursing into children. Useful for dense groups that should appear as one placeholder.

### Zero-dimension elements

Elements with `width: 0` or `height: 0` (collapsed, `display: none`) are skipped. Use `data-shimmer-width` and `data-shimmer-height` to override measured dimensions and force a block for elements that render at zero size.

### SVG

Only the outer `<svg>` bounding box is captured, not individual paths or shapes within.

## Performance

The DOM measurement pipeline runs in a single `requestAnimationFrame` callback. Benchmarked in Chrome:

| Elements | Leaf nodes | Time |
| --- | --- | --- |
| 100 | 334 | ~20ms |
| 500 | 1,667 | ~25ms |
| 1,000 | 3,334 | ~31ms |

Even with 1,000 elements (far more than any realistic skeleton screen), the full measure → render cycle completes within a single frame.
