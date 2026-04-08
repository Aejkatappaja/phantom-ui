import { esbuildPlugin } from "@web/dev-server-esbuild";
import { playwrightLauncher } from "@web/test-runner-playwright";

const allBrowsers = process.argv.includes("--all-browsers");

export default {
	files: "test/**/*.test.ts",
	nodeResolve: true,
	browsers: allBrowsers
		? [
				playwrightLauncher({ product: "chromium" }),
				playwrightLauncher({ product: "firefox" }),
				playwrightLauncher({ product: "webkit" }),
			]
		: [playwrightLauncher({ product: "chromium" })],
	plugins: [
		esbuildPlugin({
			ts: true,
			target: "es2022",
			tsconfig: "./tsconfig.json",
		}),
	],
};
