/**
 * Loads the playground against the built bundle and asserts the behaviours that unit
 * tests cannot: that dist/ actually works in a page, with no console errors, and that
 * the features with the most moving parts still render.
 *
 * Usage: node scripts/smoke-playground.mjs [url]
 */
import { chromium } from "playwright";

const URL = process.argv[2] ?? "http://localhost:4444/playground/";

let failures = 0;
const check = (label, ok, detail = "") => {
	if (!ok) failures++;
	console.log(`  ${ok ? "PASS" : "FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`);
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1300, height: 1200 } });

const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 160)));
page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 160)));

await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(800);

console.log(`\nsmoke: ${URL}\n`);
check("no console or page errors", errors.length === 0, [...new Set(errors)].join(" | "));

const base = await page.evaluate(() => {
	const host = document.getElementById("target");
	const blocks = [...(host?.shadowRoot?.querySelectorAll(".shimmer-block") ?? [])];
	const cells = [...host.querySelectorAll(".demo-table td")].map((td) => {
		const hostRect = host.getBoundingClientRect();
		const r = td.getBoundingClientRect();
		const block = blocks.find(
			(b) =>
				Math.abs(Number.parseFloat(b.style.top) - (r.top - hostRect.top)) < 2 &&
				Math.abs(Number.parseFloat(b.style.left) - (r.left - hostRect.left)) < 2,
		);
		return {
			cell: Math.round(r.width),
			block: block ? Math.round(Number.parseFloat(block.style.width)) : null,
		};
	});
	return { upgraded: !!host?.shadowRoot, blocks: blocks.length, cells };
});

check("custom element upgraded", base.upgraded);
check("overlay blocks rendered", base.blocks > 0, `${base.blocks} blocks`);
check(
	"table cells measured to their text",
	base.cells.length > 0 && base.cells.every((c) => c.block !== null && c.block < c.cell),
	JSON.stringify(base.cells),
);

await page.click("#ctl-pierce-shadow");
await page.waitForTimeout(600);
// Asserted through computed style, not through the stylesheet that produces it:
// the delivery mechanism differs by browser and must not decide the outcome.
const pierced = await page.evaluate(() => {
	const badge = document.querySelector("demo-badge");
	const nestedText = badge?.shadowRoot?.querySelector("demo-text")?.shadowRoot?.querySelector("p");
	return {
		nestedFill: nestedText ? getComputedStyle(nestedText).webkitTextFillColor : "n/a",
		icon: badge?.shadowRoot?.querySelector(".icon")?.hasAttribute("data-phantom-graphic") ?? false,
	};
});
check(
	"pierce-shadow hides text two shadow roots deep",
	pierced.nestedFill === "rgba(0, 0, 0, 0)",
	pierced.nestedFill,
);
check("masked icon inside a shadow root is marked", pierced.icon);

for (const [dir, name, direction] of [
	["ltr", "shimmer-horizontal", "normal"],
	["rtl", "shimmer-horizontal", "reverse"],
	["ttb", "shimmer-vertical", "normal"],
	["btt", "shimmer-vertical", "reverse"],
]) {
	await page.selectOption("#ctl-shimmer-direction", dir);
	await page.waitForTimeout(120);
	const got = await page.evaluate(() => {
		const b = document.getElementById("target").shadowRoot.querySelector(".shimmer-block");
		const s = getComputedStyle(b, "::after");
		return { name: s.animationName, direction: s.animationDirection };
	});
	check(
		`shimmer-direction ${dir}`,
		got.name === name && got.direction === direction,
		JSON.stringify(got),
	);
}

await page.selectOption("#ctl-mode", "overlay");
await page.waitForTimeout(600);
const overlayFill = await page.evaluate(
	() => getComputedStyle(document.querySelector("#target .card-body p")).webkitTextFillColor,
);
check("overlay keeps content readable", overlayFill !== "rgba(0, 0, 0, 0)", overlayFill);

await browser.close();
console.log(failures === 0 ? "\nsmoke passed\n" : `\n${failures} smoke failure(s)\n`);
process.exit(failures === 0 ? 0 : 1);
