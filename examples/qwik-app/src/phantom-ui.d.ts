import type { PhantomUiAttributes } from "phantom-ui";

declare module "@builder.io/qwik" {
	namespace QwikJSX {
		interface IntrinsicElements {
			"phantom-ui": PhantomUiAttributes & Record<string, unknown>;
		}
	}
}
