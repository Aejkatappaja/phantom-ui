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

	/**
	 * Hide the given slotted roots. Safe to call on every measure pass, and re-applied
	 * each time so a component that swaps its own stylesheets gets the sheet back.
	 *
	 * Shadow hiding and graphic marking share one traversal: both cross shadow
	 * boundaries only when piercing, so running them separately walked the same tree
	 * twice per pass.
	 */
	apply(roots: Element[]): void {
		const pierce = this.host.pierceShadow;
		walkTree(roots, pierce, (el) => {
			if (pierce && el.shadowRoot) {
				hideShadowRoot(el.shadowRoot);
				this._hiddenRoots.add(el.shadowRoot);
			}
			if (isMaskedGraphic(el)) {
				el.setAttribute(GRAPHIC_ATTR, "");
				this._markedGraphics.add(el);
			}
		});
		// inert is refreshed each pass so structural changes are reflected.
		this._restoreInert();
		this._applyInert(roots);
	}

	restore(): void {
		this._restoreShadowContent();
		this._restoreGraphics();
		this._restoreInert();
	}

	private _restoreShadowContent(): void {
		for (const root of this._hiddenRoots) unhideShadowRoot(root);
		this._hiddenRoots.clear();
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

/** Depth-first visit of every element under `roots`, optionally crossing open shadow roots. */
function walkTree(roots: Element[], pierce: boolean, visit: (el: Element) => void): void {
	const step = (el: Element): void => {
		visit(el);
		if (pierce && el.shadowRoot) {
			for (const child of el.shadowRoot.children) step(child);
		}
		for (const child of el.children) step(child);
	};
	for (const el of roots) step(el);
}
