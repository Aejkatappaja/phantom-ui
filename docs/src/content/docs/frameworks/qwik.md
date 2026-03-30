---
title: Qwik
description: Using phantom-ui with Qwik.
---

## Setup

```bash
bun add phantom-ui
```

The `postinstall` script generates a `phantom-ui.d.ts` file for JSX types automatically.

## Usage

The component must be imported client-side since it uses browser APIs:

```tsx
import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

export default component$(() => {
  const loading = useSignal(true);
  const ready = useSignal(false);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    import("phantom-ui");
    ready.value = true;

    const data = await fetchUser();
    // update your state...
    loading.value = false;
  });

  return (
    <>
      {ready.value && (
        <phantom-ui loading={loading.value || undefined}>
          <div class="card">
            <img src="/placeholder.png" class="avatar" />
            <h3>Placeholder Name</h3>
            <p>A short bio goes here.</p>
          </div>
        </phantom-ui>
      )}
    </>
  );
});
```

## TypeScript

If the postinstall did not generate `src/phantom-ui.d.ts`, create it manually:

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
