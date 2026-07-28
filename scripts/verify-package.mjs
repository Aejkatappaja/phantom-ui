/**
 * Packs the package, installs the tarball into a throwaway project, and type-checks it
 * as a consumer would.
 *
 * The repo's own `tsc --noEmit` reads `src/`, so it cannot see what actually ships: a
 * `.d.ts` left out of `files`, a stale `exports` map, or a deleted module still
 * referenced by a published declaration all pass locally and break on install.
 * `skipLibCheck` is off on purpose, so the shipped declarations are checked too.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = process.cwd();
const run = (cmd, args, cwd = root) =>
	execFileSync(cmd, args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });

const CONSUMER = `import { PhantomUi } from "@aejkatappaja/phantom-ui";
import type { PhantomUiAttributes, SolidPhantomUiAttributes } from "@aejkatappaja/phantom-ui";

const el: PhantomUi = document.createElement("phantom-ui");
el.loading = true;
el.pierceShadow = true;
el.mode = "overlay";
el.shimmerDirection = "btt";

const attrs: PhantomUiAttributes = { loading: true, "shimmer-direction": "ltr", count: 3 };
// Solid writes attributes, so booleans arrive as "" or null.
const solid: SolidPhantomUiAttributes = { "attr:loading": "", "attr:duration": 2 };

// The HTMLElementTagNameMap augmentation has to reach the consumer.
const found = document.querySelector("phantom-ui");
export { el, attrs, solid, found };
`;

const TSCONFIG = {
	compilerOptions: {
		target: "ES2022",
		module: "ES2022",
		moduleResolution: "bundler",
		strict: true,
		skipLibCheck: false,
		noEmit: true,
		lib: ["ES2022", "DOM"],
	},
	include: ["src"],
};

const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const dir = mkdtempSync(join(tmpdir(), "phantom-ui-pkg-"));

try {
	const tarball = run("npm", ["pack", "--silent", "--pack-destination", dir])
		.trim()
		.split("\n")
		.pop();

	mkdirSync(join(dir, "src"), { recursive: true });
	writeFileSync(
		join(dir, "package.json"),
		JSON.stringify({ name: "consumer", private: true, type: "module" }),
	);
	writeFileSync(join(dir, "tsconfig.json"), JSON.stringify(TSCONFIG));
	writeFileSync(join(dir, "src", "use.ts"), CONSUMER);

	run("npm", ["install", "--silent", "--no-audit", "--no-fund", join(dir, tarball)], dir);
	run(
		"npm",
		[
			"install",
			"--silent",
			"--no-audit",
			"--no-fund",
			`typescript@${pkg.devDependencies.typescript ?? "5"}`,
		],
		dir,
	);

	// Every subpath the exports map promises must resolve from an installed copy.
	for (const subpath of Object.keys(pkg.exports).filter((s) => s !== ".")) {
		run("node", ["-e", `require.resolve("${pkg.name}${subpath.slice(1)}")`], dir);
	}

	run(join(dir, "node_modules", ".bin", "tsc"), ["--noEmit"], dir);
	console.log("package verified: tarball installs, exports resolve, consumer type-checks");
} catch (error) {
	console.error(error.stdout ?? "");
	console.error(error.stderr ?? "");
	console.error("\npackage verification failed");
	process.exitCode = 1;
} finally {
	rmSync(dir, { recursive: true, force: true });
}
