/**
 * Asserts that an example app actually renders, not merely that it compiles.
 *
 * The `examples` CI job builds each app, which catches type and bundling breakage but
 * would happily pass on a component that renders nothing. This drives the built output in
 * a real browser and checks the contract that holds whatever the app's markup is:
 *
 * - while loading, every measured element is covered and every leaf is hidden
 * - every block's geometry matches a real element, so the overlay cannot drift
 * - on reveal, the overlay is gone and nothing it touched is left behind
 *
 * Loading is driven by assigning the property, which deliberately bypasses whatever
 * binding the app itself uses. That keeps the check identical across frameworks, and it
 * is the tradeoff to know about: this does not exercise React's `loading={x || undefined}`
 * or Solid's `attr:loading`. Interop bugs on those paths belong in the unit suite, where
 * they are cheaper and more precise to pin down.
 *
 * Usage: node scripts/assert-example-rendering.mjs <name> <dir> [port]
 */

import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright";

const [name, dir, portArg] = process.argv.slice(2);
if (!name || !dir) {
	console.error("usage: node scripts/assert-example-rendering.mjs <name> <dir> [port]");
	process.exit(2);
}
const port = Number(portArg) || 4599;

const MIME = {
	".html": "text/html",
	".js": "text/javascript",
	".mjs": "text/javascript",
	".css": "text/css",
	".json": "application/json",
	".svg": "image/svg+xml",
	".png": "image/png",
	".jpg": "image/jpeg",
	".woff2": "font/woff2",
	".map": "application/json",
};

const server = createServer(async (req, res) => {
	// Strip the query and refuse to escape the served directory.
	const rel = normalize(decodeURIComponent(req.url.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
	for (const candidate of [join(dir, rel), join(dir, rel, "index.html"), join(dir, "index.html")]) {
		try {
			const body = await readFile(candidate);
			res.writeHead(200, {
				"content-type": MIME[extname(candidate)] ?? "application/octet-stream",
			});
			res.end(body);
			return;
		} catch {}
	}
	res.writeHead(404).end();
});
await new Promise((r) => server.listen(port, r));

let failures = 0;
const check = (label, ok, detail = "") => {
	if (!ok) failures++;
	console.log(`  ${ok ? "PASS" : "FAIL"}  ${label}${detail ? ` :: ${detail}` : ""}`);
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1100 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 160)));
page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 160)));

console.log(`\nrendering: ${name}\n`);
await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForFunction(() => document.querySelector("phantom-ui")?.shadowRoot, null, {
	timeout: 30000,
});

/** Force every instance into a loading state, whatever the app's own controls do. */
const setLoading = (value) =>
	page.evaluate(async (v) => {
		for (const el of document.querySelectorAll("phantom-ui")) {
			el.loading = v;
			await el.updateComplete;
		}
	}, value);

await setLoading(true);
await page.waitForTimeout(900);

const loading = await page.evaluate(() => {
	const hosts = [...document.querySelectorAll("phantom-ui")];
	// A block is trustworthy only if it sits on top of something real. Compare each block
	// against every candidate element in the same host, allowing a pixel of rounding.
	let blocks = 0;
	let matched = 0;
	let hiddenText = 0;
	let visibleText = 0;
	let hiddenMedia = 0;
	let visibleMedia = 0;
	for (const host of hosts) {
		if (host.getAttribute("mode") === "overlay") continue;
		const hostRect = host.getBoundingClientRect();
		// querySelectorAll stops at shadow boundaries, but pierce-shadow measures inside
		// them, so those blocks would have no candidate to match against.
		const walk = (root, out = []) => {
			for (const el of root.querySelectorAll("*")) {
				const r = el.getBoundingClientRect();
				out.push({ top: r.top - hostRect.top, left: r.left - hostRect.left });
				if (el.shadowRoot) walk(el.shadowRoot, out);
			}
			return out;
		};
		const candidates = walk(host);
		for (const b of host.shadowRoot.querySelectorAll(".shimmer-block")) {
			blocks++;
			const top = Number.parseFloat(b.style.top);
			const left = Number.parseFloat(b.style.left);
			if (candidates.some((c) => Math.abs(c.top - top) < 1.5 && Math.abs(c.left - left) < 1.5)) {
				matched++;
			}
		}
		for (const el of host.querySelectorAll("*")) {
			const cs = getComputedStyle(el);
			if (el.textContent?.trim() && el.children.length === 0) {
				cs.webkitTextFillColor === "rgba(0, 0, 0, 0)" ? hiddenText++ : visibleText++;
			}
			if (/^(IMG|SVG|VIDEO|CANVAS)$/.test(el.tagName)) {
				cs.opacity === "0" ? hiddenMedia++ : visibleMedia++;
			}
		}
	}
	return {
		hosts: hosts.length,
		blocks,
		matched,
		hiddenText,
		visibleText,
		hiddenMedia,
		visibleMedia,
		ariaBusy: [...new Set(hosts.map((h) => h.getAttribute("aria-busy")))],
	};
});

check("no console or page errors", errors.length === 0, [...new Set(errors)].join(" | "));
check("at least one phantom-ui on the page", loading.hosts > 0, `${loading.hosts} hosts`);
check("blocks are rendered", loading.blocks > 0, `${loading.blocks} blocks`);
check(
	"every block sits on a real element",
	loading.blocks > 0 && loading.matched === loading.blocks,
	`${loading.matched}/${loading.blocks} matched`,
);
check(
	"leaf text is hidden while loading",
	loading.hiddenText > 0 && loading.visibleText === 0,
	`${loading.hiddenText} hidden, ${loading.visibleText} still visible`,
);
check(
	"media is hidden while loading",
	loading.visibleMedia === 0,
	`${loading.hiddenMedia} hidden, ${loading.visibleMedia} still visible`,
);
check(
	'aria-busy is exactly "true"',
	loading.ariaBusy.length === 1 && loading.ariaBusy[0] === "true",
	JSON.stringify(loading.ariaBusy),
);

await setLoading(false);
await page.waitForTimeout(900);

const revealed = await page.evaluate(() => {
	const hosts = [...document.querySelectorAll("phantom-ui")];
	let overlays = 0;
	let inert = 0;
	let transparentText = 0;
	let hiddenMedia = 0;
	for (const host of hosts) {
		if (host.shadowRoot.querySelector(".shimmer-overlay")) overlays++;
		for (const el of host.querySelectorAll("*")) {
			if (el.hasAttribute("inert")) inert++;
			const cs = getComputedStyle(el);
			if (el.textContent?.trim() && el.children.length === 0) {
				if (cs.webkitTextFillColor === "rgba(0, 0, 0, 0)") transparentText++;
			}
			if (/^(IMG|SVG|VIDEO|CANVAS)$/.test(el.tagName) && cs.opacity === "0") hiddenMedia++;
		}
	}
	return {
		overlays,
		inert,
		transparentText,
		hiddenMedia,
		ariaBusy: [...new Set(hosts.map((h) => h.getAttribute("aria-busy")))],
	};
});

check("every overlay is torn down", revealed.overlays === 0, `${revealed.overlays} left`);
check("no inert attribute is left behind", revealed.inert === 0, `${revealed.inert} left`);
check(
	"text is visible again",
	revealed.transparentText === 0,
	`${revealed.transparentText} still transparent`,
);
check("media is visible again", revealed.hiddenMedia === 0, `${revealed.hiddenMedia} still hidden`);
check(
	'aria-busy is exactly "false"',
	revealed.ariaBusy.length === 1 && revealed.ariaBusy[0] === "false",
	JSON.stringify(revealed.ariaBusy),
);

await browser.close();
server.close();
console.log(
	failures === 0 ? `\n${name}: rendering verified\n` : `\n${name}: ${failures} failure(s)\n`,
);
process.exit(failures === 0 ? 0 : 1);
