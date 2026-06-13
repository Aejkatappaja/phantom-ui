import type { CSSResult } from "lit";
import { html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { renderBlocks } from "./block-renderer.js";
import {
	DEFAULT_DURATION,
	DEFAULT_SHIMMER_BG,
	DEFAULT_SHIMMER_COLOR,
	TAG_NAME,
} from "./constants.js";
import { ContentVisibilityController } from "./content-visibility.js";
import type { ContainerInfo, ElementInfo } from "./dom-measurement.js";
import {
	createResizeObserver,
	extractContainerInfo,
	extractElementInfo,
} from "./dom-measurement.js";
import { injectLightDomStyles } from "./light-dom-styles.js";
import { phantomUiStyles } from "./phantom-ui.styles.js";

export type { PhantomUiAttributes, SolidPhantomUiAttributes } from "./types.js";
import "./types.js";
import type { Animation, ShimmerDirection } from "./types.js";

type OverlayVar = "--shimmer-color" | "--shimmer-bg" | "--shimmer-duration" | "--reveal-duration";

/**
 * `<phantom-ui>` -- A structure-aware shimmer skeleton loader.
 *
 * Wraps real content and, when `loading` is true, measures the DOM structure
 * of the slotted children to generate perfectly-aligned shimmer overlay blocks.
 *
 * @slot - The real content to show (or measure for skeleton generation)
 *
 * @attr {boolean} loading - Show the shimmer overlay or real content. The string `"false"` is treated as falsy.
 * @attr {ShimmerDirection} shimmer-direction - Direction of the shimmer sweep: `ltr`, `rtl`, `ttb`, or `btt` (shimmer mode only)
 * @attr {string} shimmer-color - Color of the animated gradient wave (shimmer mode only)
 * @attr {string} background-color - Background color of each shimmer block (all modes)
 * @attr {number} duration - Animation cycle duration in seconds
 * @attr {number} fallback-radius - Border radius (px) for elements with no radius
 * @attr {Animation} animation - Animation mode: `shimmer`, `pulse`, `breathe`, or `solid`
 * @attr {number} stagger - Delay in seconds between each block's animation start (0 = no stagger)
 * @attr {number} reveal - Fade-out duration in seconds when loading ends (0 = instant)
 * @attr {number} count - Number of skeleton rows to generate from a single template (1 = no repeat)
 * @attr {number} count-gap - Gap in pixels between repeated rows (only used when count > 1)
 * @attr {boolean} debug - Outline each measured block with an index for inspection
 * @attr {string} loading-label - Accessible label announced by screen readers while loading (default "Loading")
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

	/** Direction of the shimmer sweep. Only used in `animation="shimmer"` mode. */
	@property({ attribute: "shimmer-direction", reflect: true })
	shimmerDirection: ShimmerDirection = "ltr";

	/** Color of the animated gradient wave. Only used in `animation="shimmer"` mode. */
	@property({ attribute: "shimmer-color" })
	shimmerColor = DEFAULT_SHIMMER_COLOR;

	/** Background color of each shimmer block. Applies to all animation modes. */
	@property({ attribute: "background-color" })
	backgroundColor = DEFAULT_SHIMMER_BG;

	/** Animation cycle duration in seconds */
	@property({ type: Number })
	duration = DEFAULT_DURATION;

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

	/** Debug mode: outlines each measured block with an index. Useful for inspecting how phantom-ui interprets your DOM. */
	@property({ type: Boolean, reflect: true })
	debug = false;

	/** Accessible label announced by screen readers while loading. Set as `aria-label` on the host when `loading` is true. */
	@property({ attribute: "loading-label" })
	loadingLabel = "Loading";

	/** Measure inside open shadow roots of slotted custom elements (design systems built with Stencil, Lit, FAST). Resolves slots to their projected content. */
	@property({ type: Boolean, attribute: "pierce-shadow" })
	pierceShadow = false;

	@state()
	private _blocks: ElementInfo[] = [];

	@state()
	private _revealing = false;

	private _resizeObserver: ResizeObserver | null = null;
	private _mutationObserver: MutationObserver | null = null;
	private _loadHandler: (() => void) | null = null;
	private _measureScheduled = false;
	private _revealTimeout: ReturnType<typeof setTimeout> | null = null;
	private _visibility = new ContentVisibilityController(this);

	override connectedCallback(): void {
		super.connectedCallback();
		injectLightDomStyles();
		// On reconnection (the element was moved in the DOM), Lit does not schedule an
		// update, so observers, inert markers, and graphic hiding are not restored on
		// their own. Re-initialize them when reconnecting while loading. Guard on
		// hasUpdated so the very first connect, where updated() already runs the setup,
		// does not do it twice.
		if (this.hasUpdated && this.loading) {
			this._setupObservers();
			this._scheduleMeasure();
		}
	}

	override disconnectedCallback(): void {
		super.disconnectedCallback();
		this._teardownObservers();
		this._clearRevealTimeout();
		// Content visibility is restored by the controller's hostDisconnected hook.
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

		if (changedProperties.has("loading") || changedProperties.has("loadingLabel")) {
			this.setAttribute("aria-busy", String(this.loading));

			if (this.loading) {
				this.setAttribute("aria-label", this.loadingLabel);
			} else {
				this.removeAttribute("aria-label");
			}
		}

		if (changedProperties.has("loading")) {
			// React 18 (and any attribute-based binding) sets loading="false" as an
			// attribute. The converter resolves the property to false, but Lit suppresses
			// reflection during attributeChangedCallback, so the attribute lingers and the
			// presence-based hiding selectors (:host([loading]), phantom-ui[loading]) keep
			// the content hidden. Strip the stale attribute to match the property path.
			if (!this.loading && this.hasAttribute("loading")) {
				this.removeAttribute("loading");
			}

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
					this._visibility.restore();
				}, this.reveal * 1000);
			} else {
				this._blocks = [];
				this._teardownObservers();
				this.style.minHeight = "";
				this._visibility.restore();
			}
		}
	}

	override render() {
		// Only write a custom property inline when the consumer actually customized it.
		// An inline declaration shadows inherited values, so emitting the defaults here
		// would make page-level theming (`phantom-ui { --shimmer-color: ... }`) inert.
		// Omitting them lets the inherited value, then the :host default, take over.
		// Numeric attributes need the finiteness check: removing the attribute makes
		// Lit's Number converter yield null, and an invalid value yields NaN — both
		// would otherwise pass the !== guard and be serialized as "nulls"/"NaNs",
		// breaking the animation shorthand AND shadowing inherited theming.
		const overlayVars: Partial<Record<OverlayVar, string>> = {};
		if (this.shimmerColor !== DEFAULT_SHIMMER_COLOR) {
			overlayVars["--shimmer-color"] = this.shimmerColor;
		}
		if (this.backgroundColor !== DEFAULT_SHIMMER_BG) {
			overlayVars["--shimmer-bg"] = this.backgroundColor;
		}
		if (Number.isFinite(this.duration) && this.duration !== DEFAULT_DURATION) {
			overlayVars["--shimmer-duration"] = `${this.duration}s`;
		}
		if (Number.isFinite(this.reveal) && this.reveal > 0) {
			overlayVars["--reveal-duration"] = `${this.reveal}s`;
		}
		const overlayStyles = styleMap(overlayVars);

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
              ${renderBlocks(this._blocks, {
								fallbackRadius: this.fallbackRadius,
								backgroundColor: this.backgroundColor,
								stagger: this.stagger,
								debug: this.debug,
							})}
            </div>
          `
					: nothing
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

		// Disconnect only after the slot guard: an early return here would otherwise
		// leave the observer permanently disconnected and stop all re-measures. The
		// attribute writes below (graphics/inert markers) must not be observed, so the
		// observer stays off until it is re-observed at the end of this method.
		if (this._mutationObserver) this._mutationObserver.disconnect();

		const assignedElements = slot.assignedElements({ flatten: true });
		const allBlocks: ElementInfo[] = [];

		this._visibility.apply(assignedElements);

		for (const el of assignedElements) {
			const blocks = extractElementInfo(el, hostRect, this.pierceShadow);
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

		if (this._mutationObserver) {
			this._mutationObserver.observe(this, {
				childList: true,
				subtree: true,
				attributes: true,
			});
		}
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
}

if (!customElements.get(TAG_NAME)) {
	customElements.define(TAG_NAME, PhantomUi);
}
