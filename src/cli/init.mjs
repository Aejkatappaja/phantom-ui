#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const FILENAME = "phantom-ui.d.ts";

const templates = {
	react: `import type { PhantomUiAttributes } from "phantom-ui";

declare module "react/jsx-runtime" {
\texport namespace JSX {
\t\tinterface IntrinsicElements {
\t\t\t"phantom-ui": PhantomUiAttributes;
\t\t}
\t}
}
`,
	solid: `import type { SolidPhantomUiAttributes } from "phantom-ui";

declare module "solid-js" {
\tnamespace JSX {
\t\tinterface IntrinsicElements {
\t\t\t"phantom-ui": SolidPhantomUiAttributes;
\t\t}
\t}
}
`,
	qwik: `import type { PhantomUiAttributes } from "phantom-ui";

declare module "@builder.io/qwik" {
\tnamespace QwikJSX {
\t\tinterface IntrinsicElements {
\t\t\t"phantom-ui": PhantomUiAttributes & Record<string, unknown>;
\t\t}
\t}
}
`,
};

function findProjectRoot() {
	// During postinstall, INIT_CWD is set to the directory where `npm install` was run
	if (process.env.INIT_CWD && existsSync(join(process.env.INIT_CWD, "package.json"))) {
		return process.env.INIT_CWD;
	}

	let dir = process.cwd();
	// If we're inside node_modules, walk up to the project root
	if (dir.includes("node_modules")) {
		dir = dir.slice(0, dir.indexOf("node_modules") - 1);
	}
	if (existsSync(join(dir, "package.json"))) return dir;
	return null;
}

function detectFramework(root) {
	try {
		const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
		const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
		const has = (name) => deps.includes(name);

		if (has("react") || has("next") || has("@remix-run/react")) return "react";
		if (has("solid-js")) return "solid";
		if (has("@builder.io/qwik")) return "qwik";
		if (has("vue") || has("nuxt")) return "vue";
		if (has("svelte") || has("@sveltejs/kit")) return "svelte";
		if (has("@angular/core")) return "angular";
	} catch {
		// no package.json
	}
	return null;
}

function findSrcDir(root) {
	for (const dir of ["src", "app"]) {
		if (existsSync(join(root, dir))) return join(root, dir);
	}
	return root;
}

const root = findProjectRoot();
if (!root) {
	// Silent exit during postinstall if we can't find the project
	process.exit(0);
}

const framework = detectFramework(root);

if (!framework) {
	// Silent exit during postinstall if framework is unknown
	if (process.env.npm_lifecycle_event === "postinstall") process.exit(0);
	console.log("Could not detect framework from package.json.");
	console.log("Run this command from your project root.");
	process.exit(1);
}

if (framework === "vue" || framework === "svelte" || framework === "angular") {
	if (process.env.npm_lifecycle_event !== "postinstall") {
		console.log(`Detected ${framework}. No type declaration needed - types work automatically.`);
	}
	process.exit(0);
}

const template = templates[framework];
const srcDir = findSrcDir(root);
const outPath = join(srcDir, FILENAME);

if (existsSync(outPath)) {
	if (process.env.npm_lifecycle_event !== "postinstall") {
		console.log(`${outPath} already exists. Skipping.`);
	}
	process.exit(0);
}

writeFileSync(outPath, template);
console.log(`phantom-ui: created ${outPath} (${framework} JSX types)`);
