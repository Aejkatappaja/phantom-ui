---
title: Changelog
description: Release history for phantom-ui
---

## 0.6.1 <span style="display:inline-block;vertical-align:middle;font-size:0.4em;font-weight:600;letter-spacing:0.05em;padding:4px 10px;border-radius:100px;background:rgba(158,206,106,0.15);color:#9ece6a;margin-left:8px;position:relative;top:-2px">latest</span>

*2026-04-09*

### Bug Fixes

- **data-shimmer-ignore**: elements with `data-shimmer-ignore` now properly stay visible during loading. Previously, light DOM styles (`-webkit-text-fill-color: transparent`, `opacity: 0`) were hiding text and media inside ignored zones.

### Tests

- Added tests verifying `data-shimmer-ignore` keeps text and images visible during loading state.

### Docs

- Standalone interactive demo page with 11 card types, sticky controls bar, and theme switcher
- Custom moon/sun theme toggle component for docs
- Package manager tabs (npm/pnpm/yarn/bun) on all install commands
- Data fetching guide with TanStack Query, SWR, and Vue composable patterns
- Improved light mode contrast and purple accent color
- Fixed default color values in README

## 0.6.0

*2026-04-09*

## What's new

**SSR pre-hydration CSS** — Prevents content flash before JavaScript hydrates. The `postinstall` script now auto-detects SSR frameworks (Next.js, Nuxt, SvelteKit, Remix, Qwik) and injects `import "@aejkatappaja/phantom-ui/ssr.css"` into your layout file.

**`data-shimmer-width` / `data-shimmer-height`** — Override measured dimensions for elements that have no size yet (images without explicit width/height, JS-filled containers). Elements with zero dimensions are normally skipped — these attributes force a skeleton block.

**CLI tests** — 54 bun tests covering framework detection, SSR detection, CSS injection, indentation preservation, and idempotency.

## 0.5.2

*2026-04-08*

### Bug fix

  - **Hide buttons during loading** -- buttons and `[role="button"]` elements are now hidden (`opacity: 0`) during loading state, preventing colored backgrounds from bleeding through the shimmer
  blocks

## 0.5.1

*2026-04-08*

### Bug fixes

  - **Fix border visibility during loading** -- borders using `currentColor` (e.g. `border: 2px solid`) are no longer hidden by the loading styles
  - **Neutral default colors** -- shimmer defaults changed from white-based to neutral gray, now visible on both light and dark backgrounds

  ### Updated
  - Docs and playground updated to reflect new defaults

## 0.5.0

*2026-04-08*

## New features

- **Media load re-measurement** — Skeleton blocks re-measure automatically when images/videos finish loading via a capture-phase `load` listener. Images without explicit `width`/`height` are picked up once they load.
- **Deep descendant hiding** — All nested elements (not just direct slot children) are now hidden during loading. A light DOM stylesheet targets `phantom-ui[loading] *` to hide deeply nested images, text, and media.
- **Reveal transition fix** — The `reveal` fade-out now works correctly. The overlay stays in the DOM during the CSS opacity transition instead of being removed and recreated.

## Improvements

- **Animated SVG preview** — Replaced the 2.7MB preview GIF in the README with lightweight animated SVGs.
- **Browser test suite** — 19 tests running on Chromium, Firefox, and WebKit via `@web/test-runner` + Playwright.
- **Interactive playground** — `bun run playground` serves a local test page with controls for every attribute.
- **Contributing guide** — Added `CONTRIBUTING.md` with setup, testing, and PR guidelines.
- **CI improvements** — Test job added to CI pipeline, Playwright browsers cached for faster runs.
- **Framework examples** — README examples now showcase more attributes (animation, stagger, reveal, count) and include a React list example with repeat mode.
- **Examples point to local package** — All framework examples in `examples/` now use `file:../..` instead of a pinned npm version.
- **Input validation** — `count` clamped to minimum 1, `count-gap` clamped to minimum 0.
- **Repo cleanup** — Removed unused `preview.gif` and `logo.svg`, moved README assets to `.github/assets/`.

## 0.4.0

*2026-04-08*

## What's new

- **`count` attribute** — Generate multiple skeleton rows from a single template element. Useful for lists, tables, and feeds where data isn't loaded yet.
- **`count-gap` attribute** — Control spacing (in pixels) between repeated skeleton rows.
- Input validation: `count` is clamped to minimum 1, `count-gap` to minimum 0.

## Example

```html
<phantom-ui loading count="5" count-gap="8">
  <div class="user-row">
    <img src="avatar.png" width="32" height="32" />
    <span>John Doe</span>
    <span>john@acme.io</span>
  </div>
</phantom-ui>
```

## 0.3.0

*2026-04-07*

New animation modes, stagger effect, reveal transition, and accessibility.

  - 4 animation modes: shimmer (default), pulse, breathe, solid
  - Stagger attribute: progressive delay between blocks for wave effect
  - Reveal attribute: smooth fade-out when loading ends
  - aria-busy automatically set on host element
  - Updated demo page and documentation with new controls

## 0.2.4

*2026-04-07*

Fix shimmer animation on Firefox and improve loop smoothness.

  - Gradient now uses block background color at edges instead of transparent, eliminating the visible gap between animation cycles
  - Moved gradient declaration out of keyframes (Firefox cannot interpolate between full background shorthand values)
  - Changed easing from ease-in-out to linear for seamless looping
  - Fixed slotted leaf elements (p, img, span) not being captured as skeleton blocks

## 0.2.3

*2026-04-06*

Fix: slotted leaf elements (p, img, span) were not captured as skeleton blocks when they were direct children of the slot.

## 0.2.2

*2026-03-30*

Add repository field for webcomponents.org

## 0.2.0

*2026-03-30*

Structure-aware skeleton loader. One Web Component, every framework.

  ### Highlights

  - Wrap your real UI in `<phantom-ui loading>` and get perfect shimmer placeholders automatically
  - Works in React, Vue, Svelte, Angular, Solid, Qwik, and plain HTML
  - ~8kb gzipped CDN build (Lit included)
  - Runtime DOM measurement via `getBoundingClientRect()`
  - CSS custom properties for theming
  - `data-shimmer-ignore` and `data-shimmer-no-children` for fine-grained control
  - TypeScript types with auto-generated JSX declarations
  - Starlight documentation site

  ### Install

  `bun add @aejkatappaja/phantom-ui`

  ### Links

  - [Documentation](https://aejkatappaja.github.io/phantom-ui/)
  - [npm](https://www.npmjs.com/package/@aejkatappaja/phantom-ui)
  - [Live Demo](https://aejkatappaja.github.io/phantom-ui/demo/)

