import type { ReactiveController, ReactiveControllerHost } from "lit";
import { GRAPHIC_ATTR, SHIMMER_IGNORE_ATTR } from "./constants.js";
import { hideShadowRoot, isMaskedGraphic, unhideShadowRoot } from "./light-dom-styles.js";

type Host = ReactiveControllerHost & { pierceShadow: boolean };

/**
 * Hides the slotted content while loading. Three concerns the CSS hiding rules
 * cannot cover on their own:
 *
 * - **Shadow roots** (pierce mode): light-DOM rules cannot cross shadow
 *   boundaries, so an equivalent stylesheet is injected into each pierced root.
 * - **Mask-image icons**: drawn via CSS mask + background tint, neither
 *   `<img>` nor `<svg>`, so they are detected at runtime and marked.
 * - **Accessibility**: visually hidden content stays focusable and in the
 *   accessibility tree, so it is made `inert`.
 *
 * Each pass tracks exactly what it set, so restore is precise and a consumer's
 * own `inert` is never cleared. Restores automatically on host disconnect.
 */
export class ContentVisibilityController implements ReactiveController {
	private _hiddenRoots = new Set<ShadowRoot>();
	private _markedGraphics = new Set<Element>();
	private _inertedElements = new Set<Element>();

	constructor(private host: Host) {
		host.addController(this);
	}

	hostDisconnected(): void {
		this.restore();
	}

	/** Hide the given slotted roots. Safe to call on every measure pass. */
	apply(roots: Element[]): void {
		if (this.host.pierceShadow) this._hideShadowContent(roots);
		this._markGraphics(roots);
		// inert is refreshed each pass so structural changes are reflected.
		this._restoreInert();
		this._applyInert(roots);
	}

	restore(): void {
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
			if (this.host.pierceShadow && el.shadowRoot) {
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
			if (el.hasAttribute(SHIMMER_IGNORE_ATTR)) return;
			if (!el.querySelector(`[${SHIMMER_IGNORE_ATTR}]`)) {
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
}
