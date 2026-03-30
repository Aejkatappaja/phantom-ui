---
title: Angular
description: Using phantom-ui with Angular.
---

## Setup

```bash
bun add phantom-ui
```

No extra TypeScript setup needed. Angular uses `CUSTOM_ELEMENTS_SCHEMA`.

## Usage

Add `CUSTOM_ELEMENTS_SCHEMA` to your component and import the package:

```typescript
import { Component, signal, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import "phantom-ui";

@Component({
  selector: "app-user-card",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <phantom-ui [attr.loading]="loading() ? '' : null">
      <div class="card">
        <img [src]="user()?.avatar ?? '/placeholder.png'" class="avatar" />
        <h3>{{ user()?.name ?? "Placeholder Name" }}</h3>
        <p>{{ user()?.bio ?? "A short bio goes here." }}</p>
      </div>
    </phantom-ui>
  `,
})
export class UserCardComponent {
  loading = signal(true);
  user = signal(null);

  async ngOnInit() {
    const data = await fetchUser();
    this.user.set(data);
    this.loading.set(false);
  }
}
```

## Important: attribute binding

Use `[attr.loading]` with a ternary to set/remove the attribute:

```html
<!-- Correct: sets attribute when true, removes when false -->
<phantom-ui [attr.loading]="loading() ? '' : null">

<!-- Wrong: always sets the attribute (even to "false") -->
<phantom-ui [loading]="loading()">
```
