#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export const DTS_FILENAME = "phantom-ui.d.ts";
export const CSS_IMPORT = 'import "@aejkatappaja/phantom-ui/ssr.css";';

/* ------------------------------------------------------------------ */
/*  JSX type declaration templates (React, Solid, Qwik)               */
/* ------------------------------------------------------------------ */

export const typeTemplates = {
	react: `import type { PhantomUiAttributes } from "@aejkatappaja/phantom-ui";

declare module "react/jsx-runtime" {
\texport namespace JSX {
\t\tinterface IntrinsicElements {
\t\t\t"phantom-ui": PhantomUiAttributes;
\t\t}
\t}
}
`,
	solid: `import type { SolidPhantomUiAttributes } from "@aejkatappaja/phantom-ui";

declare module "solid-js" {
\tnamespace JSX {
\t\tinterface IntrinsicElements {
\t\t\t"phantom-ui": SolidPhantomUiAttributes;
\t\t}
\t}
}
`,
	qwik: `import type { PhantomUiAttributes } from "@aejkatappaja/phantom-ui";

declare module "@builder.io/qwik" {
\tnamespace QwikJSX {
\t\tinterface IntrinsicElements {
\t\t\t"phantom-ui": PhantomUiAttributes & Record<string, unknown>;
\t\t}
\t}
}
`,
};

/* ------------------------------------------------------------------ */
/*  SSR entry-file candidates per framework                           */
/* ------------------------------------------------------------------ */

export const SSR_ENTRY_FILES = {
	next: [
		"app/layout.tsx",
		"app/layout.jsx",
		"app/layout.js",
		"src/app/layout.tsx",
		"src/app/layout.jsx",
		"src/app/layout.js",
		"pages/_app.tsx",
		"pages/_app.jsx",
		"pages/_app.js",
		"src/pages/_app.tsx",
		"src/pages/_app.jsx",
		"src/pages/_app.js",
	],
	nuxt: ["app.vue", "layouts/default.vue"],
	sveltekit: ["src/routes/+layout.svelte"],
	remix: ["app/root.tsx", "app/root.jsx", "app/root.js"],
	qwik: ["src/root.tsx", "src/root.jsx"],
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

export function findProjectRoot() {
	if (process.env.INIT_CWD && existsSync(join(process.env.INIT_CWD, "package.json"))) {
		return process.env.INIT_CWD;
	}

	let dir = process.cwd();
	if (dir.includes("node_modules")) {
		dir = dir.slice(0, dir.indexOf("node_modules") - 1);
	}
	if (existsSync(join(dir, "package.json"))) return dir;
	return null;
}

export function readDeps(root) {
	try {
		const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
		return Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
	} catch {
		return [];
	}
}

export function detectFramework(deps) {
	const has = (name) => deps.includes(name);
	if (has("react") || has("next") || has("@remix-run/react")) return "react";
	if (has("solid-js")) return "solid";
	if (has("@builder.io/qwik")) return "qwik";
	if (has("vue") || has("nuxt")) return "vue";
	if (has("svelte") || has("@sveltejs/kit")) return "svelte";
	if (has("@angular/core")) return "angular";
	return null;
}

export function detectSSRFramework(deps) {
	const has = (name) => deps.includes(name);
	if (has("next")) return "next";
	if (has("@remix-run/react")) return "remix";
	if (has("nuxt")) return "nuxt";
	if (has("@sveltejs/kit")) return "sveltekit";
	if (has("@builder.io/qwik")) return "qwik";
	return null;
}

export function findSrcDir(root) {
	for (const dir of ["src", "app"]) {
		if (existsSync(join(root, dir))) return join(root, dir);
	}
	return root;
}

export function findEntryFile(root, ssrFramework) {
	const candidates = SSR_ENTRY_FILES[ssrFramework] || [];
	for (const file of candidates) {
		const fullPath = join(root, file);
		if (existsSync(fullPath)) return fullPath;
	}
	return null;
}

/* ------------------------------------------------------------------ */
/*  CSS import injection                                              */
/* ------------------------------------------------------------------ */

export function injectCSSImport(filePath) {
	const content = readFileSync(filePath, "utf8");
	if (content.includes("phantom-ui/ssr.css")) return false;

	const ext = filePath.split(".").pop();

	// Vue / Svelte — inject inside <script> block
	if (ext === "vue" || ext === "svelte") {
		return injectIntoSFC(filePath, content, ext);
	}

	// JS / TS / JSX / TSX — inject after last import
	return injectIntoJS(filePath, content);
}

export function injectIntoSFC(filePath, content, ext) {
	const scriptMatch = content.match(/<script[^>]*>/);
	if (scriptMatch) {
		const insertPos = scriptMatch.index + scriptMatch[0].length;
		const afterScript = content.slice(insertPos);
		const indentMatch = afterScript.match(/\n(\s+)\S/);
		const indent = indentMatch ? indentMatch[1] : "";
		const newContent = `${content.slice(0, insertPos)}\n${indent}${CSS_IMPORT}${content.slice(insertPos)}`;
		writeFileSync(filePath, newContent);
		return true;
	}

	// No <script> block — create one
	const tag = ext === "vue" ? "<script setup>" : "<script>";
	writeFileSync(filePath, `${tag}\n${CSS_IMPORT}\n</script>\n\n${content}`);
	return true;
}

export function injectIntoJS(filePath, content) {
	const lines = content.split("\n");

	// Find the last line that ends an import statement (handles multi-line imports)
	let insertAt = 0;
	for (let i = 0; i < lines.length; i++) {
		if (/\bfrom\s+["']|^\s*import\s+["']/.test(lines[i])) {
			insertAt = i + 1;
		}
	}

	lines.splice(insertAt, 0, CSS_IMPORT);
	writeFileSync(filePath, lines.join("\n"));
	return true;
}

/* ------------------------------------------------------------------ */
/*  Main (only runs when executed directly, not when imported)        */
/* ------------------------------------------------------------------ */

function main() {
	const root = findProjectRoot();
	if (!root) process.exit(0);

	const isPostinstall = process.env.npm_lifecycle_event === "postinstall";
	const deps = readDeps(root);
	const framework = detectFramework(deps);

	if (!framework) {
		if (isPostinstall) process.exit(0);
		console.log("Could not detect framework from package.json.");
		console.log("Run this command from your project root.");
		process.exit(1);
	}

	// --- Step 1: JSX type declarations ---

	const template = typeTemplates[framework];
	if (template) {
		const srcDir = findSrcDir(root);
		const outPath = join(srcDir, DTS_FILENAME);
		if (!existsSync(outPath)) {
			writeFileSync(outPath, template);
			console.log(`phantom-ui: created ${outPath} (${framework} JSX types)`);
		} else if (!isPostinstall) {
			console.log(`${outPath} already exists. Skipping.`);
		}
	}

	// --- Step 2: SSR pre-hydration CSS ---

	const ssrFramework = detectSSRFramework(deps);
	if (ssrFramework) {
		const entryFile = findEntryFile(root, ssrFramework);
		if (entryFile) {
			if (injectCSSImport(entryFile)) {
				console.log(`phantom-ui: added SSR styles import in ${entryFile}`);
			} else if (!isPostinstall) {
				console.log("phantom-ui: SSR styles import already present. Skipping.");
			}
		} else if (!isPostinstall) {
			console.log(`phantom-ui: detected ${ssrFramework} but could not find layout entry file.`);
			console.log(`Add this to your layout/root file: ${CSS_IMPORT}`);
		}
	}
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	main();
}
