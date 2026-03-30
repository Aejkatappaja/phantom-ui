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

The `postinstall` script detects your framework and generates a `phantom-ui.d.ts` in your `src/` directory. This works for React, Solid, and Qwik.

If it did not run (CI, monorepos, `--ignore-scripts`), generate it manually:

```bash
npx phantom-ui init
```

## Frameworks that need no setup

**Vue** and **Svelte** read the `HTMLElementTagNameMap` augmentation from the main type declarations. No extra file needed.

**Angular** uses `CUSTOM_ELEMENTS_SCHEMA` which bypasses type checking for custom elements.

## Manual declarations

### React

```typescript
import type { PhantomUiAttributes } from "phantom-ui";

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
import type { SolidPhantomUiAttributes } from "phantom-ui";

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
import type { PhantomUiAttributes } from "phantom-ui";

declare module "@builder.io/qwik" {
  namespace QwikJSX {
    interface IntrinsicElements {
      "phantom-ui": PhantomUiAttributes & Record<string, unknown>;
    }
  }
}
```

## Why a local file?

TypeScript does not apply `declare module` augmentations from `.d.ts` files inside `node_modules` to other packages. This is a known TypeScript limitation that affects all Web Component libraries. The local `.d.ts` file works around this by being part of your project's compilation context.
