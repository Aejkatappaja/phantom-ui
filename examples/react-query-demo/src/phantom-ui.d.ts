import type { PhantomUiAttributes } from "@aejkatappaja/phantom-ui";

declare module "react/jsx-runtime" {
	export namespace JSX {
		interface IntrinsicElements {
			/** Structure-aware shimmer skeleton loader. Wrap your content and set `loading` to generate shimmer blocks automatically. */
			"phantom-ui": PhantomUiAttributes;
		}
	}
}
