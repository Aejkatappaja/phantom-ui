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

## `shimmer-color`

| Type | Default |
| --- | --- |
| `string` | `rgba(255, 255, 255, 0.3)` |

Color of the animated gradient sweep that moves across each shimmer block.

```html
<phantom-ui loading shimmer-color="rgba(100, 200, 255, 0.4)">
  ...
</phantom-ui>
```

## `background-color`

| Type | Default |
| --- | --- |
| `string` | `rgba(255, 255, 255, 0.08)` |

Background fill of each shimmer block.

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
