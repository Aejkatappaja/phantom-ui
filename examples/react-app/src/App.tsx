import { useState } from "react";
import "@aejkatappaja/phantom-ui";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div
      style={{
        padding: 40,
        background: "#1a1a2e",
        minHeight: "100vh",
        fontFamily: "system-ui",
      }}
    >
      <h1 style={{ color: "#fff", marginBottom: 20 }}>
        React + phantom-ui
      </h1>
      <button
        onClick={() => setLoading((l) => !l)}
        style={{
          padding: "8px 20px",
          background: "#e94560",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          marginBottom: 20,
        }}
      >
        Toggle loading
      </button>

      <phantom-ui loading={loading}>
        <div
          style={{
            background: "#16213e",
            borderRadius: 12,
            padding: 20,
            width: 320,
            color: "#e0e0e0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
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
              <p style={{ margin: 0, fontSize: 13, color: "#8899aa" }}>
                Senior Engineer
              </p>
            </div>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.5 }}>
            Building scalable distributed systems and mentoring junior
            engineers.
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <span
              style={{
                background: "#0f3460",
                padding: "4px 10px",
                borderRadius: 12,
                fontSize: 12,
                color: "#53a8b6",
              }}
            >
              Rust
            </span>
            <span
              style={{
                background: "#0f3460",
                padding: "4px 10px",
                borderRadius: 12,
                fontSize: 12,
                color: "#53a8b6",
              }}
            >
              TypeScript
            </span>
            <span
              style={{
                background: "#0f3460",
                padding: "4px 10px",
                borderRadius: 12,
                fontSize: 12,
                color: "#53a8b6",
              }}
            >
              Go
            </span>
          </div>
        </div>
      </phantom-ui>
    </div>
  );
}

export default App;
