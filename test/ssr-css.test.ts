import { expect } from "@open-wc/testing";
import { LIGHT_DOM_CSS, RUNTIME_ONLY_SELECTOR, SSR_CSS } from "../src/hiding-css.js";

/**
 * `src/ssr.css` is generated from SSR_CSS at build time, but it is committed and it is
 * what ships. These assertions run against the file on disk, so a stale copy fails here
 * as well as in the CI `git diff` check.
 */
function rulesOf(css: string): Map<string, string> {
	const sheet = new CSSStyleSheet();
	sheet.replaceSync(css);
	const out = new Map<string, string>();
	for (const rule of sheet.cssRules) {
		if (!(rule instanceof CSSStyleRule)) continue;
		// Split selector lists so a rule grouping N selectors compares the same whether
		// the two files group them identically or not.
		for (const selector of rule.selectorText.split(",")) {
			out.set(selector.trim(), rule.style.cssText);
		}
	}
	return out;
}

describe("ssr.css mirrors the runtime hiding rules", () => {
	let onDisk: Map<string, string>;
	const source = rulesOf(SSR_CSS);
	const runtime = rulesOf(LIGHT_DOM_CSS);

	before(async () => {
		const res = await fetch("/src/ssr.css");
		expect(res.ok, "src/ssr.css must be served by the test runner").to.be.true;
		onDisk = rulesOf(await res.text());
	});

	it("matches SSR_CSS rule for rule", () => {
		expect([...onDisk.keys()].sort()).to.deep.equal([...source.keys()].sort());
		for (const [selector, declarations] of onDisk) {
			expect(source.get(selector), `selector ${selector}`).to.equal(declarations);
		}
	});

	// The runtime rules are SSR_CSS plus this one selector, which cannot match before
	// the runtime has marked a masked graphic.
	it("is the runtime rule set minus the runtime-only selector", () => {
		expect(runtime.has(RUNTIME_ONLY_SELECTOR)).to.be.true;
		expect(source.has(RUNTIME_ONLY_SELECTOR)).to.be.false;
		expect([...runtime.keys()].filter((s) => s !== RUNTIME_ONLY_SELECTOR).sort()).to.deep.equal(
			[...source.keys()].sort(),
		);
	});
});
