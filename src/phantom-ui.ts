import { LitElement, html } from "lit";
import type { CSSResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { createResizeObserver, extractElementInfo } from "./dom-measurement.js";
import type { ElementInfo } from "./dom-measurement.js";
import { phantomUiStyles } from "./phantom-ui.styles.js";

/**
 * `<phantom-ui>` — A structure-aware shimmer skeleton loader.
 *
 * Wraps real content and, when `loading` is true, measures the DOM structure
 * of the slotted children to generate perfectly-aligned shimmer overlay blocks.
 *
 * @slot - The real content to show (or measure for skeleton generation)
 *
 * @property {boolean} loading - Whether to show the shimmer overlay or the real content
 * @property {string} shimmerColor - Color of the animated shimmer gradient wave
 * @property {string} backgroundColor - Background color of each shimmer block
 * @property {number} duration - Animation cycle duration in seconds
 * @property {number} fallbackRadius - Border radius (px) for elements with border-radius: 0
 *
 * @example
 * ```html
 * <phantom-ui loading>
 *   <div class="card">
 *     <img src="avatar.png" width="48" height="48" />
 *     <h3>User Name</h3>
 *     <p>Some description text here</p>
 *   </div>
 * </phantom-ui>
 * ```
 */
@customElement("phantom-ui")
export class PhantomUi extends LitElement {
	static override styles: CSSResult = phantomUiStyles;

	/** Whether to show the shimmer overlay or the real content */
	@property({ type: Boolean, reflect: true })
	loading = false;

	/** Color of the animated shimmer gradient wave */
	@property({ attribute: "shimmer-color" })
	shimmerColor = "rgba(255, 255, 255, 0.3)";

	/** Background color of each shimmer block */
	@property({ attribute: "background-color" })
	backgroundColor = "rgba(255, 255, 255, 0.08)";

	/** Animation cycle duration in seconds */
	@property({ type: Number })
	duration = 1.5;

	/** Border radius applied to elements with border-radius: 0 (like text) */
	@property({ type: Number, attribute: "fallback-radius" })
	fallbackRadius = 4;

	@state()
	private _blocks: ElementInfo[] = [];

	private _resizeObserver: ResizeObserver | null = null;
	private _mutationObserver: MutationObserver | null = null;
	private _measureScheduled = false;

	override disconnectedCallback(): void {
		super.disconnectedCallback();
		this._teardownObservers();
	}

	override updated(changedProperties: Map<PropertyKey, unknown>): void {
		if (changedProperties.has("loading")) {
			if (this.loading) {
				this._scheduleMeasure();
				this._setupObservers();
			} else {
				this._blocks = [];
				this._teardownObservers();
			}
		}
	}

	override render() {
		const overlayStyles = styleMap({
			"--shimmer-color": this.shimmerColor,
			"--shimmer-duration": `${this.duration}s`,
			"--shimmer-bg": this.backgroundColor,
		});

		return html`
			<slot></slot>
			${
				this.loading
					? html`
						<div class="shimmer-overlay" style=${overlayStyles} aria-hidden="true">
							${this._renderBlocks()}
						</div>
					`
					: ""
			}
		`;
	}

	private _scheduleMeasure(): void {
		if (this._measureScheduled) return;
		this._measureScheduled = true;

		requestAnimationFrame(() => {
			this._measureScheduled = false;
			this._measure();
		});
	}

	private _measure(): void {
		if (!this.loading) return;

		const hostRect = this.getBoundingClientRect();
		if (hostRect.width === 0 || hostRect.height === 0) return;

		const slot = this.shadowRoot?.querySelector("slot");
		if (!slot) return;

		const assignedElements = slot.assignedElements({ flatten: true });
		const allBlocks: ElementInfo[] = [];

		for (const el of assignedElements) {
			const blocks = extractElementInfo(el, hostRect);
			allBlocks.push(...blocks);
		}

		this._blocks = allBlocks;
	}

	private _setupObservers(): void {
		this._teardownObservers();

		this._resizeObserver = createResizeObserver(this, () => {
			this._scheduleMeasure();
		});

		this._mutationObserver = new MutationObserver(() => {
			this._scheduleMeasure();
		});

		this._mutationObserver.observe(this, {
			childList: true,
			subtree: true,
			attributes: true,
		});
	}

	private _teardownObservers(): void {
		if (this._resizeObserver) {
			this._resizeObserver.disconnect();
			this._resizeObserver = null;
		}
		if (this._mutationObserver) {
			this._mutationObserver.disconnect();
			this._mutationObserver = null;
		}
	}

	private _renderBlocks() {
		return this._blocks.map((block) => {
			const radius = block.borderRadius || `${this.fallbackRadius}px`;
			return html`
        <div
          class="shimmer-block"
          style="
						left: ${block.x}px;
						top: ${block.y}px;
						width: ${block.width}px;
						height: ${block.height}px;
						border-radius: ${radius};
						background: var(--shimmer-bg, ${this.backgroundColor});
					"
        ></div>
      `;
		});
	}
}

export interface PhantomUiAttributes {
	loading?: boolean;
	"shimmer-color"?: string;
	"background-color"?: string;
	duration?: number;
	"fallback-radius"?: number;
	children?: unknown;
	class?: string;
	id?: string;
	style?: string;
	slot?: string;
}

/** Solid uses `attr:` prefix to set HTML attributes. This maps all PhantomUiAttributes to their `attr:` equivalents. */
export type SolidPhantomUiAttributes = PhantomUiAttributes & {
	[K in keyof PhantomUiAttributes as `attr:${K & string}`]?: PhantomUiAttributes[K];
};

declare global {
	interface HTMLElementTagNameMap {
		"phantom-ui": PhantomUi;
	}

	// Solid, Preact, React <19
	namespace JSX {
		interface IntrinsicElements {
			"phantom-ui": PhantomUiAttributes;
		}
	}
}
