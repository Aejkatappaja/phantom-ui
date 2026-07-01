import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// The demo (`src/pages/demo.astro`) loads the library from `public/phantom-ui.cdn.js`,
// a static file with no build-time regeneration. Rebuild the CDN bundle straight from
// the library source so the demo always runs the current code, never a stale bundle.
// Uses bunx esbuild so it needs no root install (works in the docs-only CI job).
const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(scriptDir, "..", "..");
const out = join(scriptDir, "..", "public", "phantom-ui.cdn.js");

execSync(
	`bunx esbuild src/phantom-ui.ts --bundle --format=iife --outfile="${out}" --minify --target=es2022`,
	{ cwd: repoRoot, stdio: "inherit" },
);
console.log("[sync-cdn] built library -> docs/public/phantom-ui.cdn.js");
