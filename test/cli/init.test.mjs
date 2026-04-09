import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
	CSS_IMPORT,
	DTS_FILENAME,
	detectFramework,
	detectSSRFramework,
	findEntryFile,
	findSrcDir,
	injectCSSImport,
	readDeps,
	typeTemplates,
} from "../../src/cli/init.mjs";

let tmp;

beforeEach(() => {
	tmp = mkdtempSync(join(tmpdir(), "phantom-ui-test-"));
});

afterEach(() => {
	rmSync(tmp, { recursive: true, force: true });
});

function writePkg(deps = {}, devDeps = {}) {
	writeFileSync(
		join(tmp, "package.json"),
		JSON.stringify({ dependencies: deps, devDependencies: devDeps }),
	);
}

function writeFile(relativePath, content) {
	const full = join(tmp, relativePath);
	mkdirSync(join(full, ".."), { recursive: true });
	writeFileSync(full, content);
	return full;
}

function readFile(relativePath) {
	return readFileSync(join(tmp, relativePath), "utf8");
}

describe("detectFramework", () => {
	test("detects react", () => {
		expect(detectFramework(["react", "react-dom"])).toBe("react");
	});

	test("detects next as react", () => {
		expect(detectFramework(["next", "react"])).toBe("react");
	});

	test("detects remix as react", () => {
		expect(detectFramework(["@remix-run/react"])).toBe("react");
	});

	test("detects solid", () => {
		expect(detectFramework(["solid-js"])).toBe("solid");
	});

	test("detects qwik", () => {
		expect(detectFramework(["@builder.io/qwik"])).toBe("qwik");
	});

	test("detects vue", () => {
		expect(detectFramework(["vue"])).toBe("vue");
	});

	test("detects nuxt as vue", () => {
		expect(detectFramework(["nuxt"])).toBe("vue");
	});

	test("detects svelte", () => {
		expect(detectFramework(["svelte"])).toBe("svelte");
	});

	test("detects sveltekit as svelte", () => {
		expect(detectFramework(["@sveltejs/kit"])).toBe("svelte");
	});

	test("detects angular", () => {
		expect(detectFramework(["@angular/core"])).toBe("angular");
	});

	test("returns null for unknown deps", () => {
		expect(detectFramework(["express", "lodash"])).toBeNull();
	});

	test("returns null for empty deps", () => {
		expect(detectFramework([])).toBeNull();
	});
});

describe("detectSSRFramework", () => {
	test("detects next", () => {
		expect(detectSSRFramework(["next", "react"])).toBe("next");
	});

	test("detects remix", () => {
		expect(detectSSRFramework(["@remix-run/react", "react"])).toBe("remix");
	});

	test("detects nuxt", () => {
		expect(detectSSRFramework(["nuxt", "vue"])).toBe("nuxt");
	});

	test("detects sveltekit", () => {
		expect(detectSSRFramework(["@sveltejs/kit", "svelte"])).toBe("sveltekit");
	});

	test("detects qwik", () => {
		expect(detectSSRFramework(["@builder.io/qwik"])).toBe("qwik");
	});

	test("returns null for client-only react", () => {
		expect(detectSSRFramework(["react", "react-dom"])).toBeNull();
	});

	test("returns null for client-only vue", () => {
		expect(detectSSRFramework(["vue"])).toBeNull();
	});

	test("returns null for empty deps", () => {
		expect(detectSSRFramework([])).toBeNull();
	});
});

describe("readDeps", () => {
	test("reads dependencies and devDependencies", () => {
		writePkg({ react: "18.0.0", next: "14.0.0" }, { typescript: "5.0.0" });
		const deps = readDeps(tmp);
		expect(deps).toContain("react");
		expect(deps).toContain("next");
		expect(deps).toContain("typescript");
	});

	test("returns empty array for missing package.json", () => {
		expect(readDeps(join(tmp, "nonexistent"))).toEqual([]);
	});
});

describe("findSrcDir", () => {
	test("prefers src/ if it exists", () => {
		mkdirSync(join(tmp, "src"));
		mkdirSync(join(tmp, "app"));
		expect(findSrcDir(tmp)).toBe(join(tmp, "src"));
	});

	test("falls back to app/", () => {
		mkdirSync(join(tmp, "app"));
		expect(findSrcDir(tmp)).toBe(join(tmp, "app"));
	});

	test("falls back to root", () => {
		expect(findSrcDir(tmp)).toBe(tmp);
	});
});

describe("findEntryFile", () => {
	test("finds Next.js App Router layout", () => {
		const path = writeFile("app/layout.tsx", "");
		expect(findEntryFile(tmp, "next")).toBe(path);
	});

	test("finds Next.js Pages _app", () => {
		const path = writeFile("pages/_app.tsx", "");
		expect(findEntryFile(tmp, "next")).toBe(path);
	});

	test("prefers app/layout over pages/_app for Next.js", () => {
		const layout = writeFile("app/layout.tsx", "");
		writeFile("pages/_app.tsx", "");
		expect(findEntryFile(tmp, "next")).toBe(layout);
	});

	test("finds Nuxt app.vue", () => {
		const path = writeFile("app.vue", "");
		expect(findEntryFile(tmp, "nuxt")).toBe(path);
	});

	test("finds Nuxt layouts/default.vue as fallback", () => {
		const path = writeFile("layouts/default.vue", "");
		expect(findEntryFile(tmp, "nuxt")).toBe(path);
	});

	test("finds SvelteKit +layout.svelte", () => {
		const path = writeFile("src/routes/+layout.svelte", "");
		expect(findEntryFile(tmp, "sveltekit")).toBe(path);
	});

	test("finds Remix root.tsx", () => {
		const path = writeFile("app/root.tsx", "");
		expect(findEntryFile(tmp, "remix")).toBe(path);
	});

	test("finds Qwik root.tsx", () => {
		const path = writeFile("src/root.tsx", "");
		expect(findEntryFile(tmp, "qwik")).toBe(path);
	});

	test("returns null when no entry file exists", () => {
		expect(findEntryFile(tmp, "next")).toBeNull();
	});

	test("returns null for unknown framework", () => {
		expect(findEntryFile(tmp, "unknown")).toBeNull();
	});
});

describe("injectCSSImport (JS/TS)", () => {
	test("injects after last import in .tsx file", () => {
		writeFile(
			"app/layout.tsx",
			'import type { Metadata } from "next";\nimport "./globals.css";\n\nexport default function Layout() {}\n',
		);
		const result = injectCSSImport(join(tmp, "app/layout.tsx"));
		expect(result).toBe(true);
		const content = readFile("app/layout.tsx");
		const lines = content.split("\n");
		expect(lines[0]).toBe('import type { Metadata } from "next";');
		expect(lines[1]).toBe('import "./globals.css";');
		expect(lines[2]).toBe(CSS_IMPORT);
	});

	test("injects at top when no imports exist", () => {
		writeFile("app/root.tsx", "export default function Root() {}\n");
		injectCSSImport(join(tmp, "app/root.tsx"));
		const content = readFile("app/root.tsx");
		expect(content.startsWith(CSS_IMPORT)).toBe(true);
	});

	test("is idempotent — does not inject twice", () => {
		writeFile(
			"app/layout.tsx",
			`import "./globals.css";\n${CSS_IMPORT}\n\nexport default function Layout() {}\n`,
		);
		const result = injectCSSImport(join(tmp, "app/layout.tsx"));
		expect(result).toBe(false);
		const content = readFile("app/layout.tsx");
		const matches = content.match(/phantom-ui\/ssr\.css/g);
		expect(matches.length).toBe(1);
	});
});

describe("injectCSSImport (Vue)", () => {
	test("injects inside existing <script setup>", () => {
		writeFile(
			"app.vue",
			'<script setup lang="ts">\nconst title = "App";\n</script>\n\n<template><slot /></template>\n',
		);
		injectCSSImport(join(tmp, "app.vue"));
		const content = readFile("app.vue");
		expect(content).toContain(CSS_IMPORT);
		expect(content.indexOf("<script setup")).toBeLessThan(content.indexOf(CSS_IMPORT));
		expect(content.indexOf(CSS_IMPORT)).toBeLessThan(content.indexOf("const title"));
	});

	test("creates <script setup> when none exists", () => {
		writeFile("app.vue", "<template><div>Hello</div></template>\n");
		injectCSSImport(join(tmp, "app.vue"));
		const content = readFile("app.vue");
		expect(content).toContain("<script setup>");
		expect(content).toContain(CSS_IMPORT);
		expect(content).toContain("</script>");
		expect(content).toContain("<template><div>Hello</div></template>");
	});

	test("respects existing indentation", () => {
		writeFile("app.vue", "<script setup>\n  const x = 1;\n</script>\n");
		injectCSSImport(join(tmp, "app.vue"));
		const content = readFile("app.vue");
		const lines = content.split("\n");
		const importLine = lines.find((l) => l.includes("phantom-ui/ssr.css"));
		expect(importLine.startsWith("  ")).toBe(true);
	});

	test("is idempotent", () => {
		writeFile("app.vue", `<script setup>\n${CSS_IMPORT}\n</script>\n`);
		const result = injectCSSImport(join(tmp, "app.vue"));
		expect(result).toBe(false);
	});
});

describe("injectCSSImport (Svelte)", () => {
	test("injects inside existing <script>", () => {
		writeFile("layout.svelte", '<script>\n  import "../app.css";\n</script>\n\n<slot />\n');
		injectCSSImport(join(tmp, "layout.svelte"));
		const content = readFile("layout.svelte");
		expect(content).toContain(CSS_IMPORT);
		expect(content.indexOf("<script>")).toBeLessThan(content.indexOf(CSS_IMPORT));
	});

	test("creates <script> when none exists", () => {
		writeFile("layout.svelte", "<slot />\n");
		injectCSSImport(join(tmp, "layout.svelte"));
		const content = readFile("layout.svelte");
		expect(content).toContain("<script>");
		expect(content).toContain(CSS_IMPORT);
		expect(content).toContain("</script>");
	});

	test("respects existing indentation", () => {
		writeFile("layout.svelte", '<script>\n\timport "../app.css";\n</script>\n');
		injectCSSImport(join(tmp, "layout.svelte"));
		const content = readFile("layout.svelte");
		const lines = content.split("\n");
		const importLine = lines.find((l) => l.includes("phantom-ui/ssr.css"));
		expect(importLine.startsWith("\t")).toBe(true);
	});

	test("is idempotent", () => {
		writeFile("layout.svelte", `<script>\n${CSS_IMPORT}\n</script>\n`);
		const result = injectCSSImport(join(tmp, "layout.svelte"));
		expect(result).toBe(false);
	});
});

describe("typeTemplates", () => {
	test("has templates for react, solid, qwik only", () => {
		expect(Object.keys(typeTemplates).sort()).toEqual(["qwik", "react", "solid"]);
	});

	test("react template declares react/jsx-runtime module", () => {
		expect(typeTemplates.react).toContain('declare module "react/jsx-runtime"');
		expect(typeTemplates.react).toContain("PhantomUiAttributes");
	});

	test("solid template declares solid-js module", () => {
		expect(typeTemplates.solid).toContain('declare module "solid-js"');
		expect(typeTemplates.solid).toContain("SolidPhantomUiAttributes");
	});

	test("qwik template declares @builder.io/qwik module", () => {
		expect(typeTemplates.qwik).toContain('declare module "@builder.io/qwik"');
		expect(typeTemplates.qwik).toContain("QwikJSX");
	});
});

describe("integration", () => {
	test("Next.js project gets both .d.ts and SSR CSS", () => {
		writePkg({ next: "14.0.0", react: "18.0.0" });
		mkdirSync(join(tmp, "app"));
		writeFile("app/layout.tsx", 'import "./globals.css";\n\nexport default function Layout() {}\n');

		// Simulate what main() does
		const deps = readDeps(tmp);
		const framework = detectFramework(deps);
		expect(framework).toBe("react");

		// Type declarations
		const srcDir = findSrcDir(tmp);
		const dtsPath = join(srcDir, DTS_FILENAME);
		writeFileSync(dtsPath, typeTemplates[framework]);
		expect(existsSync(dtsPath)).toBe(true);
		expect(readFileSync(dtsPath, "utf8")).toContain("react/jsx-runtime");

		// SSR CSS
		const ssrFramework = detectSSRFramework(deps);
		expect(ssrFramework).toBe("next");
		const entryFile = findEntryFile(tmp, ssrFramework);
		expect(entryFile).not.toBeNull();
		injectCSSImport(entryFile);
		expect(readFile("app/layout.tsx")).toContain(CSS_IMPORT);
	});

	test("Nuxt project gets SSR CSS but no .d.ts", () => {
		writePkg({ nuxt: "3.0.0", vue: "3.0.0" });
		writeFile(
			"app.vue",
			"<script setup>\nconst x = 1;\n</script>\n\n<template><NuxtPage /></template>\n",
		);

		const deps = readDeps(tmp);
		expect(detectFramework(deps)).toBe("vue");
		expect(typeTemplates.vue).toBeUndefined();

		const ssrFramework = detectSSRFramework(deps);
		expect(ssrFramework).toBe("nuxt");
		injectCSSImport(findEntryFile(tmp, ssrFramework));
		expect(readFile("app.vue")).toContain(CSS_IMPORT);
	});

	test("SvelteKit project gets SSR CSS but no .d.ts", () => {
		writePkg({}, { "@sveltejs/kit": "2.0.0", svelte: "4.0.0" });
		writeFile(
			"src/routes/+layout.svelte",
			'<script>\n  import "../app.css";\n</script>\n\n<slot />\n',
		);

		const deps = readDeps(tmp);
		expect(detectFramework(deps)).toBe("svelte");
		expect(typeTemplates.svelte).toBeUndefined();

		const ssrFramework = detectSSRFramework(deps);
		expect(ssrFramework).toBe("sveltekit");
		injectCSSImport(findEntryFile(tmp, ssrFramework));
		const content = readFile("src/routes/+layout.svelte");
		expect(content).toContain(CSS_IMPORT);
		// Verify indentation matches existing code
		const importLine = content.split("\n").find((l) => l.includes("phantom-ui/ssr.css"));
		expect(importLine.startsWith("  ")).toBe(true);
	});

	test("client-only React project gets .d.ts but no SSR CSS", () => {
		writePkg({ react: "18.0.0", "react-dom": "18.0.0" });
		mkdirSync(join(tmp, "src"));

		const deps = readDeps(tmp);
		expect(detectFramework(deps)).toBe("react");
		expect(detectSSRFramework(deps)).toBeNull();
	});
});
