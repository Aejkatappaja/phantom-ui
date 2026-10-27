import { LIGHT_DOM_CSS, SHADOW_HIDE_CSS } from "./hiding-css.js";

declare global {
	/** Sheets shared across independently bundled copies of phantom-ui. */
	var __phantomUiSheets: Map<string, CSSStyleSheet> | undefined;
	/** Set by hosts running a nonce-based CSP; Lit reads the same global. */
	var litNonce: string | undefined;
}

/**
 * Constructed stylesheets survive a Content-Security-Policy without `unsafe-inline`,
 * which blocks `<style>` elements via style-src-elem. Where they are unavailable
 * (Safari < 16.4) `new CSSStyleSheet()` throws, so fall back to a `<style>` element.
 * Same feature test Lit uses. Called lazily: no DOM globals exist at import time when
 * the build imports this module under Bun.
 */
function supportsAdoptingStyleSheets(): boolean {
	return "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
}

function createSheet(css: string): CSSStyleSheet {
	const sheet = new CSSStyleSheet();
	sheet.replaceSync(css);
	return sheet;
}

/** Fallback delivery. Carries `litNonce` when the host uses a nonce-based CSP. */
function createStyleElement(css: string, id: string): HTMLStyleElement {
	const el = document.createElement("style");
	const nonce = globalThis.litNonce;
	if (nonce !== undefined) el.setAttribute("nonce", nonce);
	el.id = id;
	el.textContent = css;
	return el;
}

const LIGHT_DOM_STYLE_ID = "phantom-ui-loading-styles";

/**
 * Keyed on globalThis so a second copy of phantom-ui, bundled separately and therefore
 * with its own module scope, reuses the same sheet instead of adopting a duplicate. The
 * version suffix keeps a future release with different rules from being suppressed by
 * an older one.
 */
const LIGHT_DOM_SHEET_KEY = "__phantomUiLightDomSheet_v1";
const SHADOW_HIDE_SHEET_KEY = "__phantomUiShadowHideSheet_v1";

function sharedSheet(key: string, css: string): CSSStyleSheet {
	globalThis.__phantomUiSheets ??= new Map();
	const sheets = globalThis.__phantomUiSheets;
	let sheet = sheets.get(key);
	if (!sheet) {
		sheet = createSheet(css);
		sheets.set(key, sheet);
	}
	return sheet;
}

/**
 * Adopt the hiding rules into the tree the host actually lives in.
 *
 * Document styles do not cross a shadow boundary, so a `<phantom-ui>` rendered inside
 * another component's shadow root (design systems, Angular `ViewEncapsulation.ShadowDom`)
 * would never be matched by a document-level sheet and its content would show through.
 * Passing the host's own root scopes the rules correctly at any nesting depth.
 *
 * Idempotent on the sheet itself rather than on a marker, so it also repairs a root whose
 * `adoptedStyleSheets` or `<head>` was replaced wholesale — view transitions and SPA head
 * managers both do that.
 */
export function injectLightDomStyles(root: Document | ShadowRoot): void {
	if (!supportsAdoptingStyleSheets()) {
		const container = root instanceof Document ? root.head : root;
		if (!container.querySelector(`#${LIGHT_DOM_STYLE_ID}`)) {
			container.appendChild(createStyleElement(LIGHT_DOM_CSS, LIGHT_DOM_STYLE_ID));
		}
		return;
	}
	const sheet = sharedSheet(LIGHT_DOM_SHEET_KEY, LIGHT_DOM_CSS);
	if (root.adoptedStyleSheets.includes(sheet)) return;
	root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
}

/**
 * True when the element is painted via a CSS mask (the icon-as-mask pattern),
 * either on the element itself or on its ::before / ::after pseudo-elements
 * (the most common icon-system layout: an empty element with the mask on a pseudo).
 */
export function isMaskedGraphic(el: Element): boolean {
	for (const pseudo of [null, "::before", "::after"]) {
		const style = getComputedStyle(el, pseudo);
		const mask =
			style.getPropertyValue("mask-image") || style.getPropertyValue("-webkit-mask-image");
		if (mask && mask !== "none") return true;
	}
	return false;
}

const SHADOW_HIDE_STYLE_ID = "phantom-ui-shadow-hide";

/** One sheet instance shared by every pierced root, added and removed by identity. */
const getShadowHideSheet = () => sharedSheet(SHADOW_HIDE_SHEET_KEY, SHADOW_HIDE_CSS);

export function hideShadowRoot(root: ShadowRoot): void {
	if (!supportsAdoptingStyleSheets()) {
		if (root.querySelector(`#${SHADOW_HIDE_STYLE_ID}`)) return;
		root.appendChild(createStyleElement(SHADOW_HIDE_CSS, SHADOW_HIDE_STYLE_ID));
		return;
	}
	const sheet = getShadowHideSheet();
	if (root.adoptedStyleSheets.includes(sheet)) return;
	root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
}

export function unhideShadowRoot(root: ShadowRoot): void {
	if (!supportsAdoptingStyleSheets()) {
		root.querySelector(`#${SHADOW_HIDE_STYLE_ID}`)?.remove();
		return;
	}
	const sheet = getShadowHideSheet();
	root.adoptedStyleSheets = root.adoptedStyleSheets.filter((s) => s !== sheet);
}
