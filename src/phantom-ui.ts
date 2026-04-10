import { LitElement, html } from "lit";
import type { CSSResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import {
	createResizeObserver,
	extractContainerInfo,
	extractElementInfo,
} from "./dom-measurement.js";
import type { ContainerInfo, ElementInfo } from "./dom-measurement.js";
import { phantomUiStyles } from "./phantom-ui.styles.js";

type Animation = "shimmer" | "pulse" | "breathe" | "solid";

const LIGHT_DOM_STYLE_ID = "phantom-ui-loading-styles";

function injectLightDomStyles(): void {
	if (document.getElementById(LIGHT_DOM_STYLE_ID)) return;
	const style = document.createElement("style");
	style.id = LIGHT_DOM_STYLE_ID;
	style.textContent = `
		phantom-ui[loading] * {
			-webkit-text-fill-color: transparent !important;
			pointer-events: none;
			user-select: none;
		}
		phantom-ui[loading] img,
		phantom-ui[loading] svg,
		phantom-ui[loading] video,
		phantom-ui[loading] canvas,
		phantom-ui[loading] button,
		phantom-ui[loading] [role="button"] {
			opacity: 0 !important;
		}
		phantom-ui[loading] [data-shimmer-ignore],
		phantom-ui[loading] [data-shimmer-ignore] * {
			-webkit-text-fill-color: initial !important;
			pointer-events: auto;
			user-select: auto;
		}
		phantom-ui[loading] [data-shimmer-ignore] img,
		phantom-ui[loading] [data-shimmer-ignore] svg,
		phantom-ui[loading] [data-shimmer-ignore] video,
		phantom-ui[loading] [data-shimmer-ignore] canvas,
		phantom-ui[loading] [data-shimmer-ignore] button,
		phantom-ui[loading] [data-shimmer-ignore] [role="button"] {
			opacity: 1 !important;
		}
	`;
	document.head.appendChild(style);
}

/**
 * `<phantom-ui>` -- A structure-aware shimmer skeleton loader.
 *
 * Wraps real content and, when `loading` is true, measures the DOM structure
 * of the slotted children to generate perfectly-aligned shimmer overlay blocks.
 *
 * @slot - The real content to show (or measure for skeleton generation)
 *
 * @attr {boolean} loading - Show the shimmer overlay or real content. The string `"false"` is treated as falsy.
 * @attr {string} shimmer-color - Color of the animated gradient wave (shimmer mode only)
 * @attr {string} background-color - Background color of each shimmer block (all modes)
 * @attr {number} duration - Animation cycle duration in seconds
 * @attr {number} fallback-radius - Border radius (px) for elements with no radius
 * @attr {Animation} animation - Animation mode: `shimmer`, `pulse`, `breathe`, or `solid`
 * @attr {number} stagger - Delay in seconds between each block's animation start (0 = no stagger)
 * @attr {number} reveal - Fade-out duration in seconds when loading ends (0 = instant)
 * @attr {number} count - Number of skeleton rows to generate from a single template (1 = no repeat)
 * @attr {number} count-gap - Gap in pixels between repeated rows (only used when count > 1)
 *
 * @example
 * ```tsx
 * <phantom-ui loading={isLoading}>
 *   <div class="card">
 *     <img src={user?.avatar} width="48" height="48" />
 *     <h3>{user?.name ?? "x"}</h3>
 *     <p>{user?.bio ?? "x"}</p>
 *   </div>
 * </phantom-ui>
 * ```
 */
@customElement("phantom-ui")
export class PhantomUi extends LitElement {
	static override styles: CSSResult = phantomUiStyles;

	/** Whether to show the shimmer overlay or the real content */
	@property({
		type: Boolean,
		reflect: true,
		converter: {
			fromAttribute: (value: string | null) => value !== null && value !== "false",
			toAttribute: (value: boolean) => (value ? "" : null),
		},
	})
	loading = false;

	/** Color of the animated gradient wave. Only used in `animation="shimmer"` mode. */
	@property({ attribute: "shimmer-color" })
	shimmerColor = "rgba(128, 128, 128, 0.3)";

	/** Background color of each shimmer block. Applies to all animation modes. */
	@property({ attribute: "background-color" })
	backgroundColor = "rgba(128, 128, 128, 0.2)";

	/** Animation cycle duration in seconds */
	@property({ type: Number })
	duration = 1.5;

	/** Border radius applied to elements with border-radius: 0 (like text) */
	@property({ type: Number, attribute: "fallback-radius" })
	fallbackRadius = 4;

	/** Animation mode: "shimmer" (gradient sweep), "pulse" (opacity), "breathe" (scale + fade), or "solid" (static) */
	@property({ reflect: true })
	animation: Animation = "shimmer";

	/** Delay in seconds between each block's animation start (0 = no stagger) */
	@property({ type: Number })
	stagger = 0;

	/** Fade-out duration in seconds when loading ends (0 = instant) */
	@property({ type: Number })
	reveal = 0;

	/** Number of skeleton rows to generate from a single template element */
	@property({
		type: Number,
		converter: (v) => Math.max(1, Math.round(Number(v) || 1)),
	})
	count = 1;

	/** Gap in pixels between each repeated skeleton row (only used when count > 1) */
	@property({
		type: Number,
		attribute: "count-gap",
		converter: (v) => Math.max(0, Number(v) || 0),
	})
	countGap = 0;

	@state()
	private _blocks: ElementInfo[] = [];

	@state()
	private _revealing = false;

	private _resizeObserver: ResizeObserver | null = null;
	private _mutationObserver: MutationObserver | null = null;
	private _loadHandler: (() => void) | null = null;
	private _measureScheduled = false;
	private _revealTimeout: ReturnType<typeof setTimeout> | null = null;

	override connectedCallback(): void {
		super.connectedCallback();
		injectLightDomStyles();
	}

	override disconnectedCallback(): void {
		super.disconnectedCallback();
		this._teardownObservers();
		this._clearRevealTimeout();
	}

	override willUpdate(changedProperties: Map<PropertyKey, unknown>): void {
		if (changedProperties.has("loading") && !this.loading) {
			if (this.reveal > 0 && this._blocks.length > 0) {
				this._revealing = true;
			}
		}
	}

	override updated(changedProperties: Map<PropertyKey, unknown>): void {
		if ((changedProperties.has("count") || changedProperties.has("countGap")) && this.loading) {
			this._scheduleMeasure();
		}

		if (changedProperties.has("loading")) {
			this.setAttribute("aria-busy", String(this.loading));

			if (this.loading) {
				this._revealing = false;
				this._clearRevealTimeout();
				this._scheduleMeasure();
				this._setupObservers();
			} else if (this._revealing) {
				this._teardownObservers();
				this._revealTimeout = setTimeout(() => {
					this._revealing = false;
					this._blocks = [];
					this._revealTimeout = null;
					this.style.minHeight = "";
				}, this.reveal * 1000);
			} else {
				this._blocks = [];
				this._teardownObservers();
				this.style.minHeight = "";
			}
		}
	}

	override render() {
		const overlayStyles = styleMap({
			"--shimmer-color": this.shimmerColor,
			"--shimmer-duration": `${this.duration}s`,
			"--shimmer-bg": this.backgroundColor,
			"--reveal-duration": `${this.reveal}s`,
		});

		const showOverlay = this.loading || this._revealing;

		return html`
      <slot></slot>
      ${
				showOverlay
					? html`
            <div
              class="shimmer-overlay ${this._revealing ? "revealing" : ""}"
              style=${overlayStyles}
              aria-hidden="true"
            >
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

		if (this.count > 1 && allBlocks.length > 0) {
			let slotHeight = 0;
			for (const el of assignedElements) {
				const rect = el.getBoundingClientRect();
				slotHeight = Math.max(slotHeight, rect.bottom - hostRect.top);
			}

			const containers: ContainerInfo[] = [];
			for (const el of assignedElements) {
				const info = extractContainerInfo(el, hostRect);
				if (info) containers.push(info);
			}

			const baseBlocks = [...allBlocks];
			for (let i = 1; i < this.count; i++) {
				const offset = i * (slotHeight + this.countGap);
				for (const c of containers) {
					allBlocks.push({
						x: c.x,
						y: c.y + offset,
						width: c.width,
						height: c.height,
						tag: "container",
						borderRadius: c.borderRadius,
						isContainer: true,
						containerBg: c.backgroundColor,
						containerBorder: c.border,
						containerShadow: c.boxShadow,
					});
				}
				for (const block of baseBlocks) {
					allBlocks.push({
						...block,
						y: block.y + offset,
					});
				}
			}
			const totalHeight = this.count * slotHeight + (this.count - 1) * this.countGap;
			this.style.minHeight = `${totalHeight}px`;
		} else {
			this.style.minHeight = "";
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

		this._loadHandler = () => this._scheduleMeasure();
		this.addEventListener("load", this._loadHandler, true);
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
		if (this._loadHandler) {
			this.removeEventListener("load", this._loadHandler, true);
			this._loadHandler = null;
		}
	}

	private _clearRevealTimeout(): void {
		if (this._revealTimeout !== null) {
			clearTimeout(this._revealTimeout);
			this._revealTimeout = null;
		}
	}

	private _renderBlocks() {
		return this._blocks.map((block, index) => {
			const radius = block.borderRadius || `${this.fallbackRadius}px`;

			if (block.isContainer) {
				return html`
        <div
          class="shimmer-container-block"
          style="
						left: ${block.x}px;
						top: ${block.y}px;
						width: ${block.width}px;
						height: ${block.height}px;
						border-radius: ${radius};
						${block.containerBg ? `background: ${block.containerBg};` : ""}
						${block.containerBorder ? `border: ${block.containerBorder};` : ""}
						${block.containerShadow ? `box-shadow: ${block.containerShadow};` : ""}
					"
        ></div>
      `;
			}

			const staggerDelay = this.stagger;
			const delay = staggerDelay > 0 ? `animation-delay: ${index * staggerDelay}s;` : "";
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
						${delay}
					"
        ></div>
      `;
		});
	}
}

export interface PhantomUiAttributes {
	/** Show the shimmer overlay (`true`) or the real content (`false`). Treats the string `"false"` as falsy. */
	loading?: boolean;
	/** Color of the animated gradient wave. Only used in `animation="shimmer"` mode. */
	"shimmer-color"?: string;
	/** Background color of each shimmer block. Applies to all animation modes. */
	"background-color"?: string;
	/** Animation cycle duration in seconds. */
	duration?: number;
	/** Border radius (px) applied to elements that have none (like text). */
	"fallback-radius"?: number;
	/** Animation mode: `"shimmer"` (gradient sweep), `"pulse"` (opacity), `"breathe"` (scale + fade), or `"solid"` (static). */
	animation?: "shimmer" | "pulse" | "breathe" | "solid";
	/** Delay in seconds between each block's animation start. `0` = no stagger. */
	stagger?: number;
	/** Fade-out duration in seconds when loading ends. `0` = instant. */
	reveal?: number;
	/** Number of skeleton rows to generate from a single template element. */
	count?: number;
	/** Gap in pixels between repeated rows (only used when `count > 1`). */
	"count-gap"?: number;
	/** Slotted content (React/Solid/Qwik). */
	children?: unknown;
	/** Standard HTML `class` attribute. */
	class?: string;
	/** Standard HTML `id` attribute. */
	id?: string;
	/** Inline styles — string or object (React). */
	style?: string | Record<string, string>;
	/** Named slot assignment. */
	slot?: string;
	/** React/Solid reconciliation key. Not passed to the DOM. */
	key?: string | number;
	/** Element ref (React/Solid). Not passed to the DOM. */
	ref?: unknown;
	/** Any `data-*` attribute. */
	[key: `data-${string}`]: string | undefined;
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
