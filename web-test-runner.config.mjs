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
	// Only enforced when run with --coverage. Set a few points under the current
	// numbers: a floor that catches a real drop, not a ratchet that fails on noise.
	coverageConfig: {
		include: ["src/**/*.ts"],
		exclude: ["src/**/*.stories.ts"],
		threshold: { statements: 95, branches: 88, functions: 95, lines: 95 },
	},
	plugins: [
		esbuildPlugin({
			ts: true,
			target: "es2022",
			tsconfig: "./tsconfig.json",
		}),
	],
};
