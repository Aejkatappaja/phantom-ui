import { readFileSync } from "node:fs";

// The analyzer emits the identifier name (e.g. `DEFAULT_DURATION`, `TAG_NAME`) wherever
// the source references an imported constant, because it does not resolve values across
// modules. Read those literals from constants.ts and substitute them so the manifest
// shows real values instead of symbol names. Single source of truth stays constants.ts.
const constantsSrc = readFileSync(new URL("./src/constants.ts", import.meta.url), "utf8");
const CONSTANTS = {};
for (const [, name, raw] of constantsSrc.matchAll(/export const (\w+)\s*=\s*(.+?);/g)) {
	CONSTANTS[name] = raw.trim();
}

const unquote = (s) => s.replace(/^["']|["']$/g, "");

function resolveConstants() {
	return {
		name: "resolve-constants",
		packageLinkPhase({ customElementsManifest }) {
			for (const mod of customElementsManifest.modules ?? []) {
				for (const decl of mod.declarations ?? []) {
					// Attribute / property defaults keep the literal form (quotes included for strings).
					for (const item of [...(decl.members ?? []), ...(decl.attributes ?? [])]) {
						if (item.default && item.default in CONSTANTS) {
							item.default = CONSTANTS[item.default];
						}
					}
					// tagName is the bare string value (no quotes).
					if (decl.tagName && decl.tagName in CONSTANTS) {
						decl.tagName = unquote(CONSTANTS[decl.tagName]);
					}
				}
				for (const exp of mod.exports ?? []) {
					if (exp.kind === "custom-element-definition" && exp.name in CONSTANTS) {
						exp.name = unquote(CONSTANTS[exp.name]);
					}
				}
			}
		},
	};
}

export default {
	globs: ["src/phantom-ui.ts"],
	outdir: ".",
	litelement: true,
	plugins: [resolveConstants()],
};
