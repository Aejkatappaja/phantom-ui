import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./phantom-ui.js";

const meta: Meta = {
	title: "Components/PhantomUi",
	component: "phantom-ui",
	argTypes: {
		loading: { control: "boolean" },
		"shimmer-color": { control: "color" },
		"background-color": { control: "color" },
		duration: { control: { type: "range", min: 0.5, max: 5, step: 0.1 } },
		"fallback-radius": { control: { type: "range", min: 0, max: 20, step: 1 } },
	},
	args: {
		loading: true,
		"shimmer-color": "rgba(128, 128, 128, 0.3)",
		"background-color": "rgba(128, 128, 128, 0.2)",
		duration: 1.5,
		"fallback-radius": 4,
	},
};

export default meta;

type Story = StoryObj;

const cardStyles = html`
  <style>
    .card {
      background: #16213e;
      border-radius: 12px;
      padding: 20px;
      width: 320px;
      font-family: system-ui, sans-serif;
      color: #e0e0e0;
    }
    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }
    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #0f3460;
      object-fit: cover;
    }
    .card-header-text h3 {
      margin: 0 0 4px;
      font-size: 16px;
    }
    .card-header-text p {
      margin: 0;
      font-size: 13px;
      color: #8899aa;
    }
    .card-body p {
      margin: 0 0 8px;
      font-size: 14px;
      line-height: 1.5;
    }
    .card-footer {
      display: flex;
      gap: 8px;
      margin-top: 16px;
    }
    .tag {
      background: #0f3460;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      color: #53a8b6;
    }
  </style>
`;

export const UserCard: Story = {
	render: (args) => html`
    ${cardStyles}
    <phantom-ui
      ?loading=${args.loading}
      shimmer-color=${args["shimmer-color"]}
      background-color=${args["background-color"]}
      duration=${args.duration}
      fallback-radius=${args["fallback-radius"]}
    >
      <div class="card">
        <div class="card-header">
          <img
            class="avatar"
            src="https://i.pravatar.cc/96?img=12"
            alt="Avatar"
          />
          <div class="card-header-text">
            <h3>Sarah Chen</h3>
            <p>Senior Engineer</p>
          </div>
        </div>
        <div class="card-body">
          <p>
            Building scalable distributed systems and mentoring junior engineers
            on best practices.
          </p>
        </div>
        <div class="card-footer">
          <span class="tag">Rust</span>
          <span class="tag">TypeScript</span>
          <span class="tag">Go</span>
        </div>
      </div>
    </phantom-ui>
  `,
};

const listStyles = html`
  <style>
    .list {
      background: #16213e;
      border-radius: 12px;
      padding: 16px;
      width: 300px;
      font-family: system-ui, sans-serif;
      color: #e0e0e0;
    }
    .list-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid #1a1a3e;
    }
    .list-item:last-child {
      border-bottom: none;
    }
    .list-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #0f3460;
      flex-shrink: 0;
    }
    .list-text {
      flex: 1;
    }
    .list-text strong {
      display: block;
      font-size: 14px;
      margin-bottom: 2px;
    }
    .list-text span {
      font-size: 12px;
      color: #8899aa;
    }
    .list-badge {
      background: #e94560;
      color: white;
      border-radius: 10px;
      padding: 2px 8px;
      font-size: 11px;
      font-weight: 600;
    }
  </style>
`;

export const NotificationList: Story = {
	render: (args) => html`
    ${listStyles}
    <phantom-ui
      ?loading=${args.loading}
      shimmer-color=${args["shimmer-color"]}
      background-color=${args["background-color"]}
      duration=${args.duration}
      fallback-radius=${args["fallback-radius"]}
    >
      <div class="list">
        <div class="list-item">
          <div class="list-avatar"></div>
          <div class="list-text">
            <strong>New deployment</strong>
            <span>Production v2.4.1 deployed successfully</span>
          </div>
          <span class="list-badge">New</span>
        </div>
        <div class="list-item">
          <div class="list-avatar"></div>
          <div class="list-text">
            <strong>PR merged</strong>
            <span>Fix auth timeout #342 merged by @alex</span>
          </div>
        </div>
        <div class="list-item">
          <div class="list-avatar"></div>
          <div class="list-text">
            <strong>Alert resolved</strong>
            <span>CPU usage back to normal on api-3</span>
          </div>
        </div>
        <div class="list-item">
          <div class="list-avatar"></div>
          <div class="list-text">
            <strong>New comment</strong>
            <span>Maria commented on RFC-0047</span>
          </div>
        </div>
      </div>
    </phantom-ui>
  `,
};

const statsStyles = html`
  <style>
    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      width: 340px;
      font-family: system-ui, sans-serif;
    }
    .stat-card {
      background: #16213e;
      border-radius: 10px;
      padding: 16px;
      color: #e0e0e0;
    }
    .stat-label {
      font-size: 12px;
      color: #8899aa;
      margin-bottom: 6px;
    }
    .stat-value {
      font-size: 28px;
      font-weight: 700;
    }
    .stat-change {
      font-size: 12px;
      margin-top: 4px;
    }
    .stat-change.up {
      color: #4ecca3;
    }
    .stat-change.down {
      color: #e94560;
    }
  </style>
`;

export const StatsGrid: Story = {
	render: (args) => html`
    ${statsStyles}
    <phantom-ui
      ?loading=${args.loading}
      shimmer-color=${args["shimmer-color"]}
      background-color=${args["background-color"]}
      duration=${args.duration}
      fallback-radius=${args["fallback-radius"]}
    >
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Revenue</div>
          <div class="stat-value">$48.2k</div>
          <div class="stat-change up">+12.5%</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Users</div>
          <div class="stat-value">2,847</div>
          <div class="stat-change up">+8.1%</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Requests</div>
          <div class="stat-value">1.2M</div>
          <div class="stat-change down">-3.2%</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Latency</div>
          <div class="stat-value">42ms</div>
          <div class="stat-change up">-18.4%</div>
        </div>
      </div>
    </phantom-ui>
  `,
};

const tableStyles = html`
  <style>
    .data-table {
      width: 480px;
      border-collapse: collapse;
      font-family: system-ui, sans-serif;
      background: #16213e;
      border-radius: 10px;
      overflow: hidden;
      color: #e0e0e0;
    }
    .data-table th {
      text-align: left;
      padding: 12px 16px;
      font-size: 12px;
      color: #8899aa;
      background: #0f3460;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .data-table td {
      padding: 10px 16px;
      font-size: 14px;
      border-bottom: 1px solid #1a1a3e;
    }
    .data-table tr:last-child td {
      border-bottom: none;
    }
    .status-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 6px;
    }
    .status-dot.active {
      background: #4ecca3;
    }
    .status-dot.idle {
      background: #f0a500;
    }
    .status-dot.offline {
      background: #e94560;
    }
  </style>
`;

export const DataTable: Story = {
	render: (args) => html`
    ${tableStyles}
    <phantom-ui
      ?loading=${args.loading}
      shimmer-color=${args["shimmer-color"]}
      background-color=${args["background-color"]}
      duration=${args.duration}
      fallback-radius=${args["fallback-radius"]}
    >
      <table class="data-table">
        <thead>
          <tr>
            <th>Service</th>
            <th>Status</th>
            <th>Uptime</th>
            <th>Latency</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>api-gateway</td>
            <td><span class="status-dot active"></span>Active</td>
            <td>99.98%</td>
            <td>12ms</td>
          </tr>
          <tr>
            <td>auth-service</td>
            <td><span class="status-dot active"></span>Active</td>
            <td>99.95%</td>
            <td>28ms</td>
          </tr>
          <tr>
            <td>cache-layer</td>
            <td><span class="status-dot idle"></span>Idle</td>
            <td>99.80%</td>
            <td>3ms</td>
          </tr>
          <tr>
            <td>ml-pipeline</td>
            <td><span class="status-dot offline"></span>Offline</td>
            <td>94.20%</td>
            <td>—</td>
          </tr>
        </tbody>
      </table>
    </phantom-ui>
  `,
};

const articleStyles = html`
  <style>
    .article {
      background: #16213e;
      border-radius: 12px;
      overflow: hidden;
      width: 400px;
      font-family: system-ui, sans-serif;
      color: #e0e0e0;
    }
    .article-cover {
      width: 100%;
      height: 180px;
      object-fit: cover;
      display: block;
      background: #0f3460;
    }
    .article-content {
      padding: 20px;
    }
    .article-content h2 {
      margin: 0 0 8px;
      font-size: 20px;
    }
    .article-meta {
      font-size: 12px;
      color: #8899aa;
      margin-bottom: 12px;
    }
    .article-content p {
      margin: 0;
      font-size: 14px;
      line-height: 1.6;
      color: #b0b0c0;
    }
  </style>
`;

export const ArticleCard: Story = {
	render: (args) => html`
    ${articleStyles}
    <phantom-ui
      ?loading=${args.loading}
      shimmer-color=${args["shimmer-color"]}
      background-color=${args["background-color"]}
      duration=${args.duration}
      fallback-radius=${args["fallback-radius"]}
    >
      <div class="article">
        <img
          class="article-cover"
          src="https://picsum.photos/seed/arch/800/360"
          alt="Cover"
        />
        <div class="article-content">
          <h2>Building Resilient Microservices</h2>
          <div class="article-meta">March 28, 2026 · 8 min read</div>
          <p>
            A practical guide to circuit breakers, bulkheads, and retry patterns
            that keep your services running when dependencies fail.
          </p>
        </div>
      </div>
    </phantom-ui>
  `,
};

export const ToggleDemo: Story = {
	render: () => {
		const toggle = () => {
			const el = document.querySelector("#toggle-demo");
			if (el) {
				const isLoading = el.hasAttribute("loading");
				if (isLoading) {
					el.removeAttribute("loading");
				} else {
					el.setAttribute("loading", "");
				}
			}
		};

		return html`
      ${cardStyles}
      <div
        style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start;"
      >
        <button
          @click=${toggle}
          style="
						padding: 8px 20px;
						background: #e94560;
						color: white;
						border: none;
						border-radius: 6px;
						cursor: pointer;
						font-size: 14px;
						font-family: system-ui;
					"
        >
          Toggle Loading
        </button>
        <phantom-ui id="toggle-demo" loading>
          <div class="card">
            <div class="card-header">
              <img
                class="avatar"
                src="https://i.pravatar.cc/96?img=32"
                alt="Avatar"
              />
              <div class="card-header-text">
                <h3>Alex Rivera</h3>
                <p>Product Designer</p>
              </div>
            </div>
            <div class="card-body">
              <p>
                Crafting intuitive interfaces that bridge the gap between user
                needs and technical possibilities.
              </p>
            </div>
            <div class="card-footer">
              <span class="tag">Figma</span>
              <span class="tag">CSS</span>
              <span class="tag">Motion</span>
            </div>
          </div>
        </phantom-ui>
      </div>
    `;
	},
	args: {},
	argTypes: {},
};
