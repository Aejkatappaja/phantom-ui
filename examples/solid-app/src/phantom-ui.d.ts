import type { SolidPhantomUiAttributes } from "@aejkatappaja/phantom-ui";

declare module "solid-js" {
	namespace JSX {
		interface IntrinsicElements {
			"phantom-ui": SolidPhantomUiAttributes;
		}
	}
}
