---
title: TypeScript
description: TypeScript setup for phantom-ui across frameworks.
---

The package ships full type definitions and exports the following types:

- `PhantomUi` -- the Web Component class
- `PhantomUiAttributes` -- props interface for JSX type augmentation
- `SolidPhantomUiAttributes` -- props interface with `attr:` prefixed variants for Solid
- `ElementInfo` -- internal type for measured DOM elements

## Automatic setup

The `postinstall` script detects your project setup and handles two things automatically:

- **JSX type declarations** — For React, Solid, and Qwik, it generates a `phantom-ui.d.ts` in your `src/` directory.
- **SSR pre-hydration CSS** — For Next.js, Nuxt, SvelteKit, Remix, and Qwik, it adds `import "@aejkatappaja/phantom-ui/ssr.css"` to your layout file to prevent content flash before hydration (see [SSR Frameworks](/frameworks/ssr/#pre-hydration-css)).

If it did not run (CI, monorepos, `--ignore-scripts`), trigger it manually:

```bash
npx @aejkatappaja/phantom-ui init
```

## Frameworks that need no setup

**Vue** and **Svelte** read the `HTMLElementTagNameMap` augmentation from the main type declarations. No extra file needed.

**Angular** uses `CUSTOM_ELEMENTS_SCHEMA` which bypasses type checking for custom elements.

## Manual type declarations

### React / Next.js / Remix

```typescript
import type { PhantomUiAttributes } from "@aejkatappaja/phantom-ui";

declare module "react/jsx-runtime" {
  export namespace JSX {
    interface IntrinsicElements {
      "phantom-ui": PhantomUiAttributes;
    }
  }
}
```

### Solid

```typescript
import type { SolidPhantomUiAttributes } from "@aejkatappaja/phantom-ui";

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      "phantom-ui": SolidPhantomUiAttributes;
    }
  }
}
```

### Qwik

```typescript
import type { PhantomUiAttributes } from "@aejkatappaja/phantom-ui";

declare module "@builder.io/qwik" {
  namespace QwikJSX {
    interface IntrinsicElements {
      "phantom-ui": PhantomUiAttributes & Record<string, unknown>;
    }
  }
}
```

## Manual SSR CSS import

Add this import to your root layout file:

```js
import "@aejkatappaja/phantom-ui/ssr.css";
```

| Framework | Layout file |
| --- | --- |
| Next.js (App Router) | `app/layout.tsx` |
| Next.js (Pages) | `pages/_app.tsx` |
| Nuxt | `app.vue` |
| SvelteKit | `src/routes/+layout.svelte` |
| Remix | `app/root.tsx` |
| Qwik | `src/root.tsx` |

## Why a local file?

TypeScript does not apply `declare module` augmentations from `.d.ts` files inside `node_modules` to other packages. This is a known TypeScript limitation that affects all Web Component libraries. The local `.d.ts` file works around this by being part of your project's compilation context.
