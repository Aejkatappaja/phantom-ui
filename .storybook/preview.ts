import type { Preview } from "@storybook/web-components";
import { setCustomElementsManifest } from "@storybook/web-components";
import customElements from "../custom-elements.json" with { type: "json" };

setCustomElementsManifest(customElements);

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		backgrounds: {
			default: "dark",
			values: [
				{ name: "dark", value: "#1a1a2e" },
				{ name: "light", value: "#ffffff" },
				{ name: "gray", value: "#f5f5f5" },
			],
		},
	},
};

export default preview;
