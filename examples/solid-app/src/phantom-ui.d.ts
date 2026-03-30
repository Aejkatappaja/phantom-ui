import type { SolidPhantomUiAttributes } from "phantom-ui";

declare module "solid-js" {
	namespace JSX {
		interface IntrinsicElements {
			"phantom-ui": SolidPhantomUiAttributes;
		}
	}
}
