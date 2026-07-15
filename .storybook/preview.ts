import type { Preview } from "@storybook/web-components-vite";
import { setCustomElementsManifest } from "@storybook/web-components-vite";
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
            options: {
                dark: { name: "dark", value: "#1a1a2e" },
                light: { name: "light", value: "#ffffff" },
                gray: { name: "gray", value: "#f5f5f5" }
            }
        },
	},

    initialGlobals: {
        backgrounds: {
            value: "dark"
        }
    },

    tags: ["autodocs"]
};

export default preview;
