import { Component, signal, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import "@aejkatappaja/phantom-ui";

interface User {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  tags: string[];
}

@Component({
  selector: "app-root",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="app">
      <h1>Angular + phantom-ui</h1>
      <button class="toggle" (click)="fetchUser()">Reload user</button>

      <phantom-ui [attr.loading]="loading() ? '' : null" reveal="0.3">
        <div class="card">
          <div class="header">
            <img [src]="user()?.avatar ?? ''" alt="avatar" class="avatar" width="48" height="48" />
            <div>
              <h3>{{ user()?.name ?? 'x' }}</h3>
              <p class="subtitle">{{ user()?.role ?? 'x' }}</p>
            </div>
          </div>
          <p class="body">{{ user()?.bio ?? 'x' }}</p>
          <div class="tags">
            @for (tag of user()?.tags ?? ['x', 'x', 'x']; track tag) {
              <span class="tag">{{ tag }}</span>
            }
          </div>
        </div>
      </phantom-ui>
    </div>
  `,
  styles: [
    `
    .app {
      padding: 40px;
      background: #1a1a2e;
      min-height: 100vh;
      font-family: system-ui;
      color: #fff;
    }
    .toggle {
      padding: 8px 20px;
      background: #e94560;
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      margin-bottom: 20px;
    }
    .card {
      background: #16213e;
      border-radius: 12px;
      padding: 20px;
      width: 320px;
      color: #e0e0e0;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }
    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }
    h3 { margin: 0 0 4px; }
    .subtitle { margin: 0; font-size: 13px; color: #8899aa; }
    .body { font-size: 14px; line-height: 1.5; }
    .tags { display: flex; gap: 8px; margin-top: 16px; }
    .tag {
      background: #0f3460;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      color: #53a8b6;
    }
    `,
  ],
})
export class App {
  protected readonly loading = signal(true);
  protected readonly user = signal<User | null>(null);

  constructor() {
    this.fetchUser();
  }

  fetchUser() {
    this.loading.set(true);
    this.user.set(null);

    setTimeout(() => {
      this.user.set({
        name: "Sarah Chen",
        role: "Senior Engineer",
        bio: "Building scalable distributed systems and mentoring junior engineers.",
        avatar: "https://i.pravatar.cc/96?img=12",
        tags: ["Rust", "TypeScript", "Go"],
      });
      this.loading.set(false);
    }, 2000);
  }
}
