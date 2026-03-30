import type { PhantomUiAttributes } from "@aejkatappaja/phantom-ui";

declare module "@builder.io/qwik" {
	namespace QwikJSX {
		interface IntrinsicElements {
			"phantom-ui": PhantomUiAttributes & Record<string, unknown>;
		}
	}
}
