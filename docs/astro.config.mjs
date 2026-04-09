import starlight from "@astrojs/starlight";
// @ts-check
import { defineConfig } from "astro/config";
import { bundledThemes } from "shiki";

const tokyoNight = (await bundledThemes["tokyo-night"]()).default;
const githubLight = (await bundledThemes["github-light"]()).default;

export default defineConfig({
	site: "https://aejkatappaja.github.io",
	base: "/phantom-ui",
	integrations: [
		starlight({
			expressiveCode: {
				themes: [tokyoNight, githubLight],
			},
			title: "phantom-ui",
			logo: {
				src: "./src/assets/logo.svg",
			},
			social: [
				{
					icon: "github",
					label: "GitHub",
					href: "https://github.com/aejkatappaja/phantom-ui",
				},
				{
					icon: "npm",
					label: "npm",
					href: "https://www.npmjs.com/package/@aejkatappaja/phantom-ui",
				},
			],
			customCss: ["./src/styles/custom.css"],
			sidebar: [
				{
					label: "Getting Started",
					items: [
						{ label: "Introduction", slug: "guides/introduction" },
						{ label: "Installation", slug: "guides/installation" },
						{ label: "Quick Start", slug: "guides/quick-start" },
						{ label: "Data Fetching", slug: "guides/data-fetching" },
					],
				},
				{
					label: "Frameworks",
					items: [
						{ label: "React", slug: "frameworks/react" },
						{ label: "Vue", slug: "frameworks/vue" },
						{ label: "Svelte", slug: "frameworks/svelte" },
						{ label: "Angular", slug: "frameworks/angular" },
						{ label: "Solid", slug: "frameworks/solid" },
						{ label: "Qwik", slug: "frameworks/qwik" },
						{ label: "SSR (Next, Nuxt, SvelteKit)", slug: "frameworks/ssr" },
					],
				},
				{
					label: "Reference",
					items: [
						{ label: "Attributes", slug: "reference/attributes" },
						{ label: "Data Attributes", slug: "reference/data-attributes" },
						{ label: "CSS Custom Properties", slug: "reference/css-custom-properties" },
						{ label: "TypeScript", slug: "reference/typescript" },
						{ label: "How It Works", slug: "reference/how-it-works" },
					],
				},
				{
					label: "Playground",
					items: [{ label: "Live Demo", slug: "demo" }],
				},
			],
		}),
	],
});
