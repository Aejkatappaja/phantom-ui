import type { PhantomUi } from "./phantom-ui.js";

export interface PhantomUiAttributes {
	/** Show the shimmer overlay (`true`) or the real content (`false`). Treats the string `"false"` as falsy. */
	loading?: boolean;
	/** Color of the animated gradient wave. Only used in `animation="shimmer"` mode. */
	"shimmer-color"?: string;
	/** Background color of each shimmer block. Applies to all animation modes. */
	"background-color"?: string;
	/** Animation cycle duration in seconds. */
	duration?: number;
	/** Border radius (px) applied to elements that have none (like text). */
	"fallback-radius"?: number;
	/** Animation mode: `"shimmer"` (gradient sweep), `"pulse"` (opacity), `"breathe"` (scale + fade), or `"solid"` (static). */
	animation?: "shimmer" | "pulse" | "breathe" | "solid";
	/** Delay in seconds between each block's animation start. `0` = no stagger. */
	stagger?: number;
	/** Fade-out duration in seconds when loading ends. `0` = instant. */
	reveal?: number;
	/** Number of skeleton rows to generate from a single template element. */
	count?: number;
	/** Gap in pixels between repeated rows (only used when `count > 1`). */
	"count-gap"?: number;
	/** Slotted content (React/Solid/Qwik). */
	children?: unknown;
	/** Standard HTML `class` attribute. */
	class?: string;
	/** Standard HTML `id` attribute. */
	id?: string;
	/** Inline styles — string or object (React). */
	style?: string | Record<string, string>;
	/** Named slot assignment. */
	slot?: string;
	/** React/Solid reconciliation key. Not passed to the DOM. */
	key?: string | number;
	/** Element ref (React/Solid). Not passed to the DOM. */
	ref?: unknown;
	/** Any `data-*` attribute. */
	[key: `data-${string}`]: string | undefined;
}

/** Solid uses `attr:` prefix to set HTML attributes. This maps all PhantomUiAttributes to their `attr:` equivalents. */
export type SolidPhantomUiAttributes = PhantomUiAttributes & {
	[K in keyof PhantomUiAttributes as `attr:${K & string}`]?: PhantomUiAttributes[K];
};

declare global {
	interface HTMLElementTagNameMap {
		"phantom-ui": PhantomUi;
	}

	// Solid, Preact, React <19
	namespace JSX {
		interface IntrinsicElements {
			"phantom-ui": PhantomUiAttributes;
		}
	}
}
