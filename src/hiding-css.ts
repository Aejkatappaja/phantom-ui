import { GRAPHIC_ATTR, SHIMMER_IGNORE_ATTR, TAG_NAME } from "./constants.js";

/**
 * The stylesheets that hide slotted content while loading, as plain strings.
 *
 * Deliberately free of DOM references: the build imports this module under Bun to
 * generate `src/ssr.css`, and the tests read it without pulling in the delivery layer.
 * Delivery lives in `light-dom-styles.ts`.
 */

/** Elements hidden by opacity rather than transparent text. */
const MEDIA_TAGS = ["img", "svg", "video", "canvas", "button", '[role="button"]'];

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

// Overlay mode keeps content visible, so the hiding rules must not apply to it.
const LOADING = `${TAG_NAME}[loading]:not([mode="overlay"])`;

const prefixMedia = (prefix: string) => MEDIA_TAGS.map((tag) => `${prefix} ${tag}`).join(",\n\t");

/**
 * The rules that are already valid before hydration. `src/ssr.css` is generated from
 * this string by `scripts/generate-ssr-css.ts`, so the two can never drift.
 */
export const SSR_CSS = `
	${LOADING} * { ${HIDE_TEXT} }
	${prefixMedia(LOADING)} { opacity: 0 !important; }
	${LOADING} [${SHIMMER_IGNORE_ATTR}],
	${LOADING} [${SHIMMER_IGNORE_ATTR}] * { ${SHOW_TEXT} }
	${prefixMedia(`${LOADING} [${SHIMMER_IGNORE_ATTR}]`)} { opacity: 1 !important; }
`;

/** Selector that can only match once the runtime has marked a masked graphic. */
export const RUNTIME_ONLY_SELECTOR = `${LOADING} [${GRAPHIC_ATTR}]`;

/** Everything ssr.css covers, plus the marker phantom-ui sets on mask-image icons. */
export const LIGHT_DOM_CSS = `${SSR_CSS}
	${RUNTIME_ONLY_SELECTOR} { opacity: 0 !important; }
`;

/**
 * Light-DOM rules cannot cross shadow boundaries, so pierced roots get an equivalent
 * sheet of their own. Scoped to the root, hence the bare selectors.
 */
export const SHADOW_HIDE_CSS = `
	:host([${SHIMMER_IGNORE_ATTR}]) *, [${SHIMMER_IGNORE_ATTR}] * {
		-webkit-text-fill-color: initial !important;
		opacity: 1 !important;
	}
	* { ${HIDE_TEXT} }
	${MEDIA_TAGS.join(", ")}, [${GRAPHIC_ATTR}] { opacity: 0 !important; }
`;
