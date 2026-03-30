import type { PhantomUiAttributes } from "phantom-ui";

declare module "react/jsx-runtime" {
	export namespace JSX {
		interface IntrinsicElements {
			"phantom-ui": PhantomUiAttributes;
		}
	}
}
