---
title: API Stability
description: What the 1.0 release guarantees about the phantom-ui API.
---

phantom-ui follows [semantic versioning](https://semver.org/). As of **1.0.0**, the public API is considered stable.

## What this means

The following are part of the public API and will not change in a breaking way without a major version bump (`2.0.0`):

- The `<phantom-ui>` custom element tag name
- All documented attributes (`loading`, `animation`, `shimmer-direction`, `shimmer-color`, `background-color`, `duration`, `fallback-radius`, `stagger`, `reveal`, `count`, `count-gap`, `debug`, `loading-label`)
- All documented data attributes (`data-shimmer-ignore`, `data-shimmer-no-children`, `data-shimmer-width`, `data-shimmer-height`)
- The documented CSS custom properties
- The exported TypeScript types (`PhantomUiAttributes`, `SolidPhantomUiAttributes`)
- The `ssr.css` import path and the CLI (`npx @aejkatappaja/phantom-ui init`)

## What may still change

These are not part of the stability guarantee:

- The exact pixel output of generated shimmer blocks (measurement is heuristic and may improve)
- Internal class names inside the Shadow DOM
- The structure of the Custom Elements Manifest
- Behavior in undocumented edge cases

## Versioning policy

- **Patch** (`1.0.x`) — bug fixes, no API change
- **Minor** (`1.x.0`) — new attributes or features, fully backward compatible
- **Major** (`2.0.0`) — breaking changes to any of the guarantees above, announced in the changelog with a migration note

## Reporting

If a release breaks something documented here without a major bump, it is a bug. Open an [issue](https://github.com/Aejkatappaja/phantom-ui/issues) and it will be treated as a regression.
