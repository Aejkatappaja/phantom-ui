/** The custom element tag name. */
export const TAG_NAME = "phantom-ui";

/**
 * Data attributes a consumer puts on slotted children to control measurement.
 * Shared between the measurement engine, the hiding styles, and the inert pass.
 */
export const SHIMMER_IGNORE_ATTR = "data-shimmer-ignore";
export const SHIMMER_NO_CHILDREN_ATTR = "data-shimmer-no-children";
export const SHIMMER_WIDTH_ATTR = "data-shimmer-width";
export const SHIMMER_HEIGHT_ATTR = "data-shimmer-height";

/**
 * Marker phantom-ui sets at runtime on mask-image icons (which CSS cannot select)
 * so the light-DOM hiding rules can target them.
 */
export const GRAPHIC_ATTR = "data-phantom-graphic";

/** Default shimmer appearance. Overridable via attributes or inherited CSS custom properties. */
export const DEFAULT_SHIMMER_COLOR = "rgba(128, 128, 128, 0.3)";
export const DEFAULT_SHIMMER_BG = "rgba(128, 128, 128, 0.2)";
export const DEFAULT_DURATION = 1.5;
