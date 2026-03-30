import { createSignal } from "solid-js";
import "phantom-ui";

function App() {
  const [loading, setLoading] = createSignal(true);

  return (
    <div style={{ padding: "40px", background: "#1a1a2e", "min-height": "100vh", "font-family": "system-ui" }}>
      <h1 style={{ color: "#fff", "margin-bottom": "20px" }}>Solid + phantom-ui</h1>
      <button
        onClick={() => setLoading((l) => !l)}
        style={{
          padding: "8px 20px",
          background: "#e94560",
          color: "#fff",
          border: "none",
          "border-radius": "6px",
          cursor: "pointer",
          "margin-bottom": "20px",
        }}
      >
        Toggle loading
      </button>

      <phantom-ui attr:loading={loading() || undefined}>
        <div
          style={{
            background: "#16213e",
            "border-radius": "12px",
            padding: "20px",
            width: "320px",
            color: "#e0e0e0",
          }}
        >
          <div style={{ display: "flex", "align-items": "center", gap: "12px", "margin-bottom": "16px" }}>
            <img
              src="https://i.pravatar.cc/96?img=12"
              alt="avatar"
              width={48}
              height={48}
              style={{ "border-radius": "50%" }}
            />
            <div>
              <h3 style={{ margin: "0 0 4px" }}>Sarah Chen</h3>
              <p style={{ margin: "0", "font-size": "13px", color: "#8899aa" }}>Senior Engineer</p>
            </div>
          </div>
          <p style={{ "font-size": "14px", "line-height": "1.5" }}>
            Building scalable distributed systems and mentoring junior engineers.
          </p>
          <div style={{ display: "flex", gap: "8px", "margin-top": "16px" }}>
            <span style={{ background: "#0f3460", padding: "4px 10px", "border-radius": "12px", "font-size": "12px", color: "#53a8b6" }}>Rust</span>
            <span style={{ background: "#0f3460", padding: "4px 10px", "border-radius": "12px", "font-size": "12px", color: "#53a8b6" }}>TypeScript</span>
            <span style={{ background: "#0f3460", padding: "4px 10px", "border-radius": "12px", "font-size": "12px", color: "#53a8b6" }}>Go</span>
          </div>
        </div>
      </phantom-ui>
    </div>
  );
}

export default App;
