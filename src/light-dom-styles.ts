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
	const mediaList = MEDIA_SELECTOR.split(", ")
		.map((sel) => `phantom-ui[loading] ${sel}`)
		.join(",\n\t\t\t");
	const ignoreMediaList = MEDIA_SELECTOR.split(", ")
		.map((sel) => `phantom-ui[loading] [data-shimmer-ignore] ${sel}`)
		.join(",\n\t\t\t");

	const style = document.createElement("style");
	style.id = LIGHT_DOM_STYLE_ID;
	style.textContent = `
		phantom-ui[loading] * { ${HIDE_TEXT} }
		${mediaList},
		phantom-ui[loading] [${GRAPHIC_ATTR}] { opacity: 0 !important; }
		phantom-ui[loading] [data-shimmer-ignore],
		phantom-ui[loading] [data-shimmer-ignore] * { ${SHOW_TEXT} }
		${ignoreMediaList} { opacity: 1 !important; }
	`;
	document.head.appendChild(style);
}

/**
 * Marker attribute set at measure time on elements rendered as graphics through
 * CSS (mask-image icons tinted with background-color) rather than as <img>/<svg>.
 * The media-hiding rules can't select these via CSS, so phantom-ui detects them
 * at runtime, marks them, and the hiding rules target the marker.
 */
export const GRAPHIC_ATTR = "data-phantom-graphic";

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
	:host([data-shimmer-ignore]) *, [data-shimmer-ignore] * {
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
