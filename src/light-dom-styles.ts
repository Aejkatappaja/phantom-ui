import { LIGHT_DOM_CSS, SHADOW_HIDE_CSS } from "./hiding-css.js";

const LIGHT_DOM_STYLE_ID = "phantom-ui-loading-styles";

export function injectLightDomStyles(): void {
	if (document.getElementById(LIGHT_DOM_STYLE_ID)) return;
	const style = document.createElement("style");
	style.id = LIGHT_DOM_STYLE_ID;
	style.textContent = LIGHT_DOM_CSS;
	document.head.appendChild(style);
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

/**
 * Light-DOM hiding rules cannot cross shadow boundaries, so when piercing shadow
 * roots we inject an equivalent stylesheet directly into each pierced root. The
 * style is added while loading and removed on reveal/teardown.
 */
export function hideShadowRoot(root: ShadowRoot): void {
	if (root.querySelector(`#${SHADOW_HIDE_STYLE_ID}`)) return;
	const style = document.createElement("style");
	style.id = SHADOW_HIDE_STYLE_ID;
	style.textContent = SHADOW_HIDE_CSS;
	root.appendChild(style);
}

export function unhideShadowRoot(root: ShadowRoot): void {
	root.querySelector(`#${SHADOW_HIDE_STYLE_ID}`)?.remove();
}
