<script setup lang="ts">
import { ref } from "vue";
import "phantom-ui";

const loading = ref(true);
</script>

<template>
  <div class="app">
    <h1>Vue + phantom-ui</h1>
    <button class="toggle" @click="loading = !loading">Toggle loading</button>

    <phantom-ui :loading="loading">
      <div class="card">
        <div class="header">
          <img src="https://i.pravatar.cc/96?img=12" alt="avatar" class="avatar" />
          <div>
            <h3>Sarah Chen</h3>
            <p class="subtitle">Senior Engineer</p>
          </div>
        </div>
        <p class="body">
          Building scalable distributed systems and mentoring junior engineers.
        </p>
        <div class="tags">
          <span class="tag">Rust</span>
          <span class="tag">TypeScript</span>
          <span class="tag">Go</span>
        </div>
      </div>
    </phantom-ui>
  </div>
</template>

<style>
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
.header h3 { margin: 0 0 4px; }
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
</style>
