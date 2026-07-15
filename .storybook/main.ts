import type { StorybookConfig } from "@storybook/web-components-vite";

const config: StorybookConfig = {
    stories: ["../src/**/*.stories.@(ts|tsx)"],
    addons: ["@storybook/addon-docs"],

    framework: {
		name: "@storybook/web-components-vite",
		options: {},
	}
};

export default config;
