import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  const loading = useSignal(true);
  const ready = useSignal(false);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    import("@aejkatappaja/phantom-ui");
    ready.value = true;
  });

  return (
    <div
      style={{
        padding: "40px",
        background: "#1a1a2e",
        minHeight: "100vh",
        fontFamily: "system-ui",
      }}
    >
      <h1 style={{ color: "#fff", marginBottom: "20px" }}>Qwik + phantom-ui</h1>
      <button
        onClick$={() => (loading.value = !loading.value)}
        style={{
          padding: "8px 20px",
          background: "#e94560",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Toggle loading
      </button>

      {ready.value && (
        <phantom-ui loading={loading.value || undefined}>
          <div
            style={{
              background: "#16213e",
              borderRadius: "12px",
              padding: "20px",
              width: "320px",
              color: "#e0e0e0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <img
                src="https://i.pravatar.cc/96?img=12"
                alt="avatar"
                width={48}
                height={48}
                style={{ borderRadius: "50%" }}
              />
              <div>
                <h3 style={{ margin: "0 0 4px" }}>Sarah Chen</h3>
                <p style={{ margin: "0", fontSize: "13px", color: "#8899aa" }}>Senior Engineer</p>
              </div>
            </div>
            <p style={{ fontSize: "14px", lineHeight: "1.5" }}>
              Building scalable distributed systems and mentoring junior engineers.
            </p>
            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              <span
                style={{
                  background: "#0f3460",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "#53a8b6",
                }}
              >
                Rust
              </span>
              <span
                style={{
                  background: "#0f3460",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "#53a8b6",
                }}
              >
                TypeScript
              </span>
              <span
                style={{
                  background: "#0f3460",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "#53a8b6",
                }}
              >
                Go
              </span>
            </div>
          </div>
        </phantom-ui>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Qwik + phantom-ui",
};
