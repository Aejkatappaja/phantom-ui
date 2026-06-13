import type { CSSResult } from "lit";
import { html, LitElement, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import type { ContainerInfo, ElementInfo } from "./dom-measurement.js";
import {
	createResizeObserver,
	extractContainerInfo,
	extractElementInfo,
} from "./dom-measurement.js";
import {
	GRAPHIC_ATTR,
	hideShadowRoot,
	injectLightDomStyles,
	isMaskedGraphic,
	unhideShadowRoot,
} from "./light-dom-styles.js";
import { phantomUiStyles } from "./phantom-ui.styles.js";

export type { PhantomUiAttributes, SolidPhantomUiAttributes } from "./types.js";
import "./types.js";

type Animation = "shimmer" | "pulse" | "breathe" | "solid";
type ShimmerDirection = "ltr" | "rtl" | "ttb" | "btt";

const DEFAULT_SHIMMER_COLOR = "rgba(128, 128, 128, 0.3)";
const DEFAULT_SHIMMER_BG = "rgba(128, 128, 128, 0.2)";
const DEFAULT_DURATION = 1.5;

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
	private _hiddenRoots = new Set<ShadowRoot>();
	private _markedGraphics = new Set<Element>();
	private _inertedElements = new Set<Element>();

	override connectedCallback(): void {
		super.connectedCallback();
		injectLightDomStyles();
	}

	override disconnectedCallback(): void {
		super.disconnectedCallback();
		this._teardownObservers();
		this._clearRevealTimeout();
		this._restoreShadowContent();
		this._restoreGraphics();
		this._restoreInert();
	}

	/**
	 * Inject hiding styles into every open shadow root under the slotted elements.
	 * Light-DOM hiding rules cannot cross shadow boundaries, so pierced components
	 * would otherwise show their real content through the shimmer overlay.
	 */
	private _hideShadowContent(roots: Element[]): void {
		const visit = (el: Element): void => {
			if (el.shadowRoot) {
				hideShadowRoot(el.shadowRoot);
				this._hiddenRoots.add(el.shadowRoot);
				for (const child of el.shadowRoot.children) visit(child);
			}
			for (const child of el.children) visit(child);
		};
		for (const el of roots) visit(el);
	}

	private _restoreShadowContent(): void {
		for (const root of this._hiddenRoots) unhideShadowRoot(root);
		this._hiddenRoots.clear();
	}

	/**
	 * Icons drawn with CSS mask-image and tinted via background-color are neither
	 * <img> nor <svg>, so the media-hiding rules miss them and they show through
	 * the shimmer. CSS can't select "has a mask", so detect them at runtime and
	 * mark them with GRAPHIC_ATTR, which the hiding rules target. Walks light DOM
	 * and (when piercing) shadow roots.
	 */
	private _markGraphics(roots: Element[]): void {
		const visit = (el: Element): void => {
			if (isMaskedGraphic(el)) {
				el.setAttribute(GRAPHIC_ATTR, "");
				this._markedGraphics.add(el);
			}
			if (this.pierceShadow && el.shadowRoot) {
				for (const child of el.shadowRoot.children) visit(child);
			}
			for (const child of el.children) visit(child);
		};
		for (const el of roots) visit(el);
	}

	private _restoreGraphics(): void {
		for (const el of this._markedGraphics) el.removeAttribute(GRAPHIC_ATTR);
		this._markedGraphics.clear();
	}

	/**
	 * While loading, slotted content is visually hidden but stays focusable,
	 * keyboard-activatable, and exposed to screen readers (the CSS hiding only sets
	 * pointer-events/opacity/transparent text, none of which affect the tab order or
	 * the accessibility tree). Mark it `inert` to remove it from both.
	 *
	 * `inert` is inherited and cannot be cancelled by a descendant, so we cannot just
	 * inert the assigned elements: that would force any nested `data-shimmer-ignore`
	 * element inert too, defeating the one feature meant to stay interactive. Instead
	 * we inert the largest subtrees that contain no `data-shimmer-ignore`, and recurse
	 * past the ones that do. We only track what we set, so a consumer's own `inert` is
	 * never cleared on restore. `inert` is inherited through shadow boundaries, so
	 * pierced shadow content is covered without walking it.
	 */
	private _applyInert(roots: Element[]): void {
		const walk = (el: Element): void => {
			if (el.hasAttribute("data-shimmer-ignore")) return;
			if (!el.querySelector("[data-shimmer-ignore]")) {
				if (!el.hasAttribute("inert")) {
					el.setAttribute("inert", "");
					this._inertedElements.add(el);
				}
				return;
			}
			for (const child of el.children) walk(child);
		};
		for (const el of roots) walk(el);
	}

	private _restoreInert(): void {
		for (const el of this._inertedElements) el.removeAttribute("inert");
		this._inertedElements.clear();
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
					this._restoreShadowContent();
					this._restoreGraphics();
					this._restoreInert();
				}, this.reveal * 1000);
			} else {
				this._blocks = [];
				this._teardownObservers();
				this.style.minHeight = "";
				this._restoreShadowContent();
				this._restoreGraphics();
				this._restoreInert();
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

		if (this._mutationObserver) this._mutationObserver.disconnect();

		const slot = this.shadowRoot?.querySelector("slot");
		if (!slot) return;

		const assignedElements = slot.assignedElements({ flatten: true });
		const allBlocks: ElementInfo[] = [];

		if (this.pierceShadow) {
			this._hideShadowContent(assignedElements);
		}
		this._markGraphics(assignedElements);
		this._restoreInert();
		this._applyInert(assignedElements);

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

	private _renderBlocks() {
		return this._blocks.map((block, index) => {
			const radius = block.borderRadius || `${this.fallbackRadius}px`;
			const base = {
				left: `${block.x}px`,
				top: `${block.y}px`,
				width: `${block.width}px`,
				height: `${block.height}px`,
				"border-radius": radius,
			};

			if (block.isContainer) {
				const styles: Record<string, string> = { ...base };
				if (block.containerBg) styles.background = block.containerBg;
				if (block.containerBorder) styles.border = block.containerBorder;
				if (block.containerShadow) styles["box-shadow"] = block.containerShadow;
				return html`<div
          class="shimmer-container-block"
          style=${styleMap(styles)}
        >${this.debug ? html`<span class="debug-label" data-kind="container">C${index}</span>` : nothing}</div>`;
			}

			const styles: Record<string, string> = {
				...base,
				background: `var(--shimmer-bg, ${this.backgroundColor})`,
			};
			if (this.stagger > 0) {
				styles["animation-delay"] = `${index * this.stagger}s`;
			}
			return html`<div class="shimmer-block" style=${styleMap(styles)}>${this.debug ? html`<span class="debug-label">${index}</span>` : nothing}</div>`;
		});
	}
}

if (!customElements.get("phantom-ui")) {
	customElements.define("phantom-ui", PhantomUi);
}
