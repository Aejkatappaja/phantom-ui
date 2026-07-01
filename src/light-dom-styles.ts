import { GRAPHIC_ATTR, SHIMMER_IGNORE_ATTR, TAG_NAME } from "./constants.js";

/** Elements hidden by opacity (rather than transparent text) while loading. */
const MEDIA_SELECTOR = 'img, svg, video, canvas, button, [role="button"]';

/** Make text invisible and block interaction without collapsing layout. */
const HIDE_TEXT = `
	-webkit-text-fill-color: transparent !important;
	pointer-events: none;
	user-select: none;
`;

const SHOW_TEXT = `
	-webkit-text-fill-color: initial !important;
	pointer-events: auto;
	user-select: auto;
`;

const LIGHT_DOM_STYLE_ID = "phantom-ui-loading-styles";

export function injectLightDomStyles(): void {
	if (document.getElementById(LIGHT_DOM_STYLE_ID)) return;
	// Overlay mode keeps content visible, so the hiding rules must not apply to it.
	const loading = `${TAG_NAME}[loading]:not([mode="overlay"])`;
	const mediaList = MEDIA_SELECTOR.split(", ")
		.map((sel) => `${loading} ${sel}`)
		.join(",\n\t\t\t");
	const ignoreMediaList = MEDIA_SELECTOR.split(", ")
		.map((sel) => `${loading} [${SHIMMER_IGNORE_ATTR}] ${sel}`)
		.join(",\n\t\t\t");

	const style = document.createElement("style");
	style.id = LIGHT_DOM_STYLE_ID;
	style.textContent = `
		${loading} * { ${HIDE_TEXT} }
		${mediaList},
		${loading} [${GRAPHIC_ATTR}] { opacity: 0 !important; }
		${loading} [${SHIMMER_IGNORE_ATTR}],
		${loading} [${SHIMMER_IGNORE_ATTR}] * { ${SHOW_TEXT} }
		${ignoreMediaList} { opacity: 1 !important; }
	`;
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
const SHADOW_HIDE_CSS = `
	:host([${SHIMMER_IGNORE_ATTR}]) *, [${SHIMMER_IGNORE_ATTR}] * {
		-webkit-text-fill-color: initial !important;
		opacity: 1 !important;
	}
	* { ${HIDE_TEXT} }
	${MEDIA_SELECTOR}, [${GRAPHIC_ATTR}] { opacity: 0 !important; }
`;

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
