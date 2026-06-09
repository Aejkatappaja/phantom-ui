---
title: Design Systems (Shadow DOM)
description: Using phantom-ui with Stencil, Lit, and other shadow-DOM component libraries.
---

If your components are built with a Web Component framework like **Stencil** or **Lit**, their internal structure lives inside a shadow root. By default phantom-ui stops at the component boundary and treats the whole component as a single shimmer block, because shadow boundaries are opaque to outside code.

The `pierce-shadow` attribute changes that.

## The problem

```html
<phantom-ui loading>
  <my-card></my-card>
</phantom-ui>
```

Here `<my-card>` renders its title, avatar, and text inside its own shadow root. phantom-ui can't see them, so it produces one block the size of the card instead of a granular skeleton.

## The fix

Add `pierce-shadow`:

```html
<phantom-ui loading pierce-shadow>
  <my-card>
    <span slot="title">Placeholder title</span>
    <p slot="body">A short bio goes here.</p>
  </my-card>
</phantom-ui>
```

phantom-ui now:

- walks into the open shadow root of each slotted custom element
- resolves default and named slots to their projected light-DOM content, measured at their real position
- treats slot-only containers as measurable leaves (so a Stencil text component built as `<p><slot/></p>` is measured correctly)
- injects hiding styles into each pierced shadow root, since the light-DOM hiding rules cannot cross shadow boundaries

It works with nested shadow roots and with icons drawn via CSS `mask-image` (a common design-system pattern), which are hidden like real media during loading.

## Limitations

- **Open shadow roots only.** Components using `mode: "closed"` are not reachable. Stencil and Lit default to open, so most design systems work.
- **Mutations inside child shadow roots are not observed.** phantom-ui re-measures on resize and on light-DOM mutations, but it does not currently watch for DOM changes happening *inside* a pierced component's shadow root. The initial measurement is correct; dynamic structural changes inside the shadow root won't re-trigger it.
- **Double rendering.** Because slotted light-DOM content is measured through slot resolution, it is never measured twice.

## Stencil example

```tsx
// k-text.tsx — a typical shadow:true component
@Component({ tag: "k-text", shadow: true })
export class KText {
  render() {
    return <Host><p><slot /></p></Host>;
  }
}
```

```html
<phantom-ui loading pierce-shadow>
  <k-text>This text is measured inside the shadow root.</k-text>
</phantom-ui>
```
