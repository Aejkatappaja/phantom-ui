---
title: React
description: Using phantom-ui with React.
---

## Setup

```bash
bun add @aejkatappaja/phantom-ui
```

The `postinstall` script generates a `phantom-ui.d.ts` file for JSX types automatically.

## Usage

```tsx
import { useState, useEffect } from "react";
import "@aejkatappaja/phantom-ui";

function UserCard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser().then(setUser);
  }, []);

  return (
    <phantom-ui loading={!user || undefined}>
      <div className="card">
        <img src={user?.avatar ?? "/placeholder.png"} className="avatar" />
        <h3>{user?.name ?? "Placeholder Name"}</h3>
        <p>{user?.bio ?? "A short bio goes here for measurement."}</p>
      </div>
    </phantom-ui>
  );
}
```

## Important: boolean attributes

React passes `loading={true}` as the string `"true"`, which works. But `loading={false}` passes the string `"false"`, which is truthy in HTML. Use `undefined` to remove the attribute:

```tsx
// Correct
<phantom-ui loading={isLoading || undefined}>

// Wrong - "false" is a truthy string
<phantom-ui loading={isLoading}>
```

## TypeScript

If the postinstall did not generate `src/phantom-ui.d.ts`, create it manually:

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

Or run:

```bash
npx @aejkatappaja/phantom-ui init
```
