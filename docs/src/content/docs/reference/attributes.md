---
title: Attributes
description: All attributes available on the phantom-ui element.
---

## `loading`

| Type | Default | Reflects |
| --- | --- | --- |
| `boolean` | `false` | Yes |

Show the shimmer overlay when present. Remove to reveal real content.

```html
<!-- Loading state -->
<phantom-ui loading>...</phantom-ui>

<!-- Content revealed -->
<phantom-ui>...</phantom-ui>
```

## `animation`

| Type | Default | Reflects |
| --- | --- | --- |
| `string` | `shimmer` | Yes |

Animation mode for the shimmer blocks. Four modes available:

- `shimmer` -- gradient sweep moving across each block (default)
- `pulse` -- opacity oscillation between full and faded
- `breathe` -- subtle scale and opacity breathing effect
- `solid` -- static blocks with no animation

```html
<phantom-ui loading animation="pulse">...</phantom-ui>
<phantom-ui loading animation="breathe">...</phantom-ui>
<phantom-ui loading animation="solid">...</phantom-ui>
```

## `stagger`

| Type | Default |
| --- | --- |
| `number` | `0` |

Delay in seconds between each block's animation start. Creates a wave effect where blocks animate one after another instead of all at once. Works with all animation modes.

```html
<phantom-ui loading stagger="0.05">...</phantom-ui>
```

## `reveal`

| Type | Default |
| --- | --- |
| `number` | `0` |

Fade-out duration in seconds when loading ends. Instead of an instant switch, the shimmer overlay fades out smoothly. Set to `0` for instant reveal (default).

```html
<phantom-ui loading reveal="0.3">...</phantom-ui>
```

## `count`

| Type | Default |
| --- | --- |
| `number` | `1` |

Number of skeleton rows to generate from a single template element. The component measures your slotted content once, then duplicates the skeleton blocks vertically. If the slotted element has a visible background, border, or box-shadow, these are replicated on each repeated row automatically. Useful for lists, tables, or feeds where you don't have data yet to render multiple items.

```html
<phantom-ui loading count="5">
  <div class="user-row">
    <img src="avatar.png" width="32" height="32" />
    <span>John Doe</span>
    <span>john@acme.io</span>
  </div>
</phantom-ui>
```

## `count-gap`

| Type | Default |
| --- | --- |
| `number` | `0` |

Gap in pixels between each repeated skeleton row. Only applies when `count` is greater than 1.

```html
<phantom-ui loading count="5" count-gap="12">
  <div class="feed-item">
    <div class="avatar"></div>
    <p>Activity description here</p>
  </div>
</phantom-ui>
```

## `shimmer-direction`

| Type | Default | Reflects |
| --- | --- | --- |
| `string` | `ltr` | Yes |

Direction of the shimmer gradient sweep. Only applies to `animation="shimmer"` (the default).

- `ltr` -- left to right (default)
- `rtl` -- right to left
- `ttb` -- top to bottom
- `btt` -- bottom to top

```html
<phantom-ui loading shimmer-direction="rtl">...</phantom-ui>
<phantom-ui loading shimmer-direction="ttb">...</phantom-ui>
```

## `shimmer-color`

| Type | Default |
| --- | --- |
| `string` | `rgba(128, 128, 128, 0.3)` |

Color of the animated gradient sweep that moves across each shimmer block. Only applies to `animation="shimmer"` (the default).

```html
<phantom-ui loading shimmer-color="rgba(100, 200, 255, 0.4)">
  ...
</phantom-ui>
```

## `background-color`

| Type | Default |
| --- | --- |
| `string` | `rgba(128, 128, 128, 0.2)` |

Background fill of each shimmer block. Applies to all animation modes.

```html
<phantom-ui loading background-color="rgba(100, 200, 255, 0.1)">
  ...
</phantom-ui>
```

## `duration`

| Type | Default |
| --- | --- |
| `number` | `1.5` |

Animation cycle duration in seconds.

```html
<phantom-ui loading duration="2.5">...</phantom-ui>
```

## `fallback-radius`

| Type | Default |
| --- | --- |
| `number` | `4` |

Border radius in pixels applied to elements that have `border-radius: 0` (like text paragraphs). Elements with their own border radius (like circular avatars) keep their computed value.

```html
<phantom-ui loading fallback-radius="8">...</phantom-ui>
```

## `debug`

| Type | Default | Reflects |
| --- | --- | --- |
| `boolean` | `false` | Yes |

Outlines each measured block with an index, useful for inspecting how phantom-ui interprets your DOM. Leaf blocks get a pink outline and a numeric label (`0`, `1`, `2`...), container blocks get a blue outline and a `C`-prefixed label (`C0`, `C1`...). Toggle on temporarily during development to debug unexpected skeletons.

```html
<phantom-ui loading debug>...</phantom-ui>
```
