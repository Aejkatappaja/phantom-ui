import { aTimeout, expect, fixture, html } from "@open-wc/testing";
import { PhantomUi } from "../src/phantom-ui.js";

function nextFrame(): Promise<void> {
	return new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
}

/**
 * getComputedStyle never returns the keyword `transparent`; CSSOM serializes it to this.
 * Comparing against the keyword makes an assertion vacuous in both directions.
 */
const TRANSPARENT = "rgba(0, 0, 0, 0)";

/** Same feature test the source uses to pick its stylesheet delivery. */
const SUPPORTS_ADOPTING_STYLESHEETS =
	"adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;

/**
 * Query helpers that assert what they found instead of casting. A missing or
 * wrong-typed node fails here with the selector in the message, rather than as a
 * confusing `undefined` further down the test.
 */
function queryAs<T extends Element>(scope: ParentNode, selector: string, type: new () => T): T {
	const found = scope.querySelector(selector);
	if (!(found instanceof type)) {
		throw new Error(
			`expected ${selector} to match a ${type.name}, got ${found?.nodeName ?? "null"}`,
		);
	}
	return found;
}

const query = (scope: ParentNode, selector: string) => queryAs(scope, selector, HTMLElement);
/** For nodes that may be SVG: computed style only needs an Element. */
const queryEl = (scope: ParentNode, selector: string) => queryAs(scope, selector, Element);

function queryAll(scope: ParentNode, selector: string): HTMLElement[] {
	return [...scope.querySelectorAll(selector)].filter((n) => n instanceof HTMLElement);
}

function shadowOf(el: Element): ShadowRoot {
	const { shadowRoot } = el;
	if (!shadowRoot) throw new Error(`expected an open shadow root on <${el.localName}>`);
	return shadowRoot;
}

/** Settle a measure pass, then read the rendered overlay blocks. */
async function blocksOf(el: PhantomUi): Promise<HTMLElement[]> {
	await nextFrame();
	await el.updateComplete;
	return queryAll(shadowOf(el), ".shimmer-block");
}

const widthsOf = async (el: PhantomUi) =>
	(await blocksOf(el)).map((b) => Math.round(Number.parseFloat(b.style.width)));

describe("phantom-ui", () => {
	it("is registered as a custom element", () => {
		expect(customElements.get("phantom-ui")).to.not.be.undefined;
	});

	it("does not throw when the module is imported a second time", async () => {
		// Re-importing the module simulates micro-frontend, lazy-loaded, or HMR setups
		// where phantom-ui can end up being initialized more than once. Without the
		// guard, customElements.define() throws NotSupportedError on the second call.
		await import("../src/phantom-ui.js");
		expect(customElements.get("phantom-ui")).to.not.be.undefined;
	});

	it("renders slotted content", async () => {
		const el = await fixture<PhantomUi>(html`
			<phantom-ui>
				<div class="content">Hello</div>
			</phantom-ui>
		`);
		const slot = el.shadowRoot?.querySelector("slot");
		expect(slot).to.exist;
		const assigned = slot?.assignedElements({ flatten: true });
		expect(assigned.length).to.equal(1);
	});

	it("shows overlay when loading is set", async () => {
		const el = await fixture<PhantomUi>(html`
			<phantom-ui loading>
				<div style="width:100px;height:50px;">Text</div>
			</phantom-ui>
		`);
		await nextFrame();
		await el.updateComplete;
		const overlay = el.shadowRoot?.querySelector(".shimmer-overlay");
		expect(overlay).to.exist;
		expect(el.getAttribute("aria-busy")).to.equal("true");
	});

	it("hides overlay when loading is removed", async () => {
		const el = await fixture<PhantomUi>(html`
			<phantom-ui loading>
				<div style="width:100px;height:50px;">Text</div>
			</phantom-ui>
		`);
		await nextFrame();
		await el.updateComplete;
		el.loading = false;
		await el.updateComplete;
		const overlay = el.shadowRoot?.querySelector(".shimmer-overlay");
		expect(overlay).to.not.exist;
		expect(el.getAttribute("aria-busy")).to.equal("false");
	});

	describe("loading-label", () => {
		it("sets a default aria-label while loading", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading>
					<div style="width:100px;height:50px;">Text</div>
				</phantom-ui>
			`);
			await el.updateComplete;
			expect(el.getAttribute("aria-label")).to.equal("Loading");
		});

		it("uses a custom loading-label", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading loading-label="Loading article">
					<div style="width:100px;height:50px;">Text</div>
				</phantom-ui>
			`);
			await el.updateComplete;
			expect(el.getAttribute("aria-label")).to.equal("Loading article");
		});

		it("removes aria-label when loading ends", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading>
					<div style="width:100px;height:50px;">Text</div>
				</phantom-ui>
			`);
			await el.updateComplete;
			el.loading = false;
			await el.updateComplete;
			expect(el.hasAttribute("aria-label")).to.be.false;
		});
	});

	it("generates shimmer blocks from slotted content", async () => {
		const el = await fixture<PhantomUi>(html`
			<phantom-ui loading>
				<div style="width:200px;">
					<p style="width:150px;height:20px;">Line 1</p>
					<p style="width:120px;height:20px;">Line 2</p>
				</div>
			</phantom-ui>
		`);
		await nextFrame();
		await el.updateComplete;
		const blocks = el.shadowRoot?.querySelectorAll(".shimmer-block");
		expect(blocks.length).to.be.greaterThan(0);
	});

	describe("animation modes", () => {
		for (const mode of ["shimmer", "pulse", "breathe", "solid"] as const) {
			it(`reflects animation="${mode}" on host`, async () => {
				const el = await fixture<PhantomUi>(html`
					<phantom-ui loading animation="${mode}">
						<div style="width:100px;height:50px;">Text</div>
					</phantom-ui>
				`);
				expect(el.getAttribute("animation")).to.equal(mode);
				expect(el.animation).to.equal(mode);
			});
		}
	});

	it("count duplicates block groups", async () => {
		const el = await fixture<PhantomUi>(html`
			<phantom-ui loading count="3">
				<div style="width:100px;height:40px;">
					<span style="display:inline-block;width:80px;height:16px;">Item</span>
				</div>
			</phantom-ui>
		`);
		await nextFrame();
		await el.updateComplete;
		const blocks = el.shadowRoot?.querySelectorAll(".shimmer-block");
		expect(blocks.length).to.be.greaterThan(0);
		expect(blocks.length % 3).to.equal(0);
	});

	it("clamps count to minimum 1", async () => {
		const el = await fixture<PhantomUi>(html`
			<phantom-ui loading count="0">
				<div style="width:100px;height:40px;">Item</div>
			</phantom-ui>
		`);
		expect(el.count).to.equal(1);
	});

	it("clamps negative count to 1", async () => {
		const el = await fixture<PhantomUi>(html`
			<phantom-ui loading count="-5">
				<div style="width:100px;height:40px;">Item</div>
			</phantom-ui>
		`);
		expect(el.count).to.equal(1);
	});

	it("count-gap offsets repeated groups vertically", async () => {
		const el = await fixture<PhantomUi>(html`
			<phantom-ui loading count="2" count-gap="20">
				<div style="width:100px;height:40px;">
					<span style="display:inline-block;width:80px;height:16px;">Item</span>
				</div>
			</phantom-ui>
		`);
		await nextFrame();
		await el.updateComplete;
		expect(el.countGap).to.equal(20);
		const minHeight = Number.parseFloat(el.style.minHeight);
		expect(minHeight).to.be.greaterThan(0);
	});

	it("clamps count-gap to minimum 0", async () => {
		const el = await fixture<PhantomUi>(html`
			<phantom-ui loading count-gap="-10">
				<div style="width:100px;height:40px;">Item</div>
			</phantom-ui>
		`);
		expect(el.countGap).to.equal(0);
	});

	it("count replicates container background for repeated rows", async () => {
		const el = await fixture<PhantomUi>(html`
			<phantom-ui loading count="3" count-gap="10">
				<div style="width:200px;height:50px;background:#1a1b26;border:1px solid #292e42;border-radius:8px;">
					<span style="display:inline-block;width:100px;height:16px;">Item</span>
				</div>
			</phantom-ui>
		`);
		await nextFrame();
		await el.updateComplete;
		const containers = el.shadowRoot?.querySelectorAll(".shimmer-container-block");
		expect(containers).to.exist;
		expect(containers?.length).to.equal(2);
	});

	it("count does not emit container blocks when background is transparent", async () => {
		const el = await fixture<PhantomUi>(html`
			<phantom-ui loading count="3">
				<div style="width:200px;height:50px;">
					<span style="display:inline-block;width:100px;height:16px;">Item</span>
				</div>
			</phantom-ui>
		`);
		await nextFrame();
		await el.updateComplete;
		const containers = el.shadowRoot?.querySelectorAll(".shimmer-container-block");
		expect(containers?.length).to.equal(0);
	});

	describe("shimmer-direction", () => {
		it("defaults to ltr", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading>
					<div style="width:100px;height:50px;">Text</div>
				</phantom-ui>
			`);
			expect(el.shimmerDirection).to.equal("ltr");
		});

		for (const dir of ["ltr", "rtl", "ttb", "btt"] as const) {
			it(`reflects shimmer-direction="${dir}" on host`, async () => {
				const el = await fixture<PhantomUi>(html`
					<phantom-ui loading shimmer-direction="${dir}">
						<div style="width:100px;height:50px;">Text</div>
					</phantom-ui>
				`);
				expect(el.getAttribute("shimmer-direction")).to.equal(dir);
				expect(el.shimmerDirection).to.equal(dir);
			});
		}

		const SWEEPS = {
			ltr: { name: "shimmer-horizontal", direction: "normal", size: "200% 100%" },
			rtl: { name: "shimmer-horizontal", direction: "reverse", size: "200% 100%" },
			ttb: { name: "shimmer-vertical", direction: "normal", size: "100% 200%" },
			btt: { name: "shimmer-vertical", direction: "reverse", size: "100% 200%" },
		} as const;

		for (const [dir, sweep] of Object.entries(SWEEPS)) {
			it(`sweeps ${dir} with the matching keyframes and direction`, async () => {
				const el = await fixture<PhantomUi>(html`
					<phantom-ui loading shimmer-direction="${dir}">
						<div style="width:100px;height:50px;">Text</div>
					</phantom-ui>
				`);
				await nextFrame();
				await el.updateComplete;
				const block = query(shadowOf(el), ".shimmer-block");
				const style = getComputedStyle(block, "::after");
				expect(style.animationName).to.equal(sweep.name);
				expect(style.animationDirection).to.equal(sweep.direction);
				expect(style.backgroundSize).to.equal(sweep.size);
			});
		}
	});

	describe("debug mode", () => {
		it("reflects debug attribute on host", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading debug>
					<div style="width:100px;height:50px;">Text</div>
				</phantom-ui>
			`);
			expect(el.hasAttribute("debug")).to.be.true;
			expect(el.debug).to.be.true;
		});

		it("renders debug labels on each block when debug + loading", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading debug>
					<div style="width:200px;">
						<p style="width:150px;height:20px;">Line 1</p>
						<p style="width:120px;height:20px;">Line 2</p>
					</div>
				</phantom-ui>
			`);
			await nextFrame();
			await el.updateComplete;
			const blocks = el.shadowRoot?.querySelectorAll(".shimmer-block");
			const labels = el.shadowRoot?.querySelectorAll(".debug-label");
			expect(labels?.length).to.equal(blocks?.length);
		});

		it("does not render debug labels when debug is false", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading>
					<div style="width:200px;">
						<p style="width:150px;height:20px;">Line 1</p>
					</div>
				</phantom-ui>
			`);
			await nextFrame();
			await el.updateComplete;
			const labels = el.shadowRoot?.querySelectorAll(".debug-label");
			expect(labels?.length).to.equal(0);
		});

		it("marks container labels with data-kind=container", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading debug count="3" count-gap="10">
					<div style="width:200px;height:50px;background:#1a1b26;border:1px solid #292e42;border-radius:8px;">
						<span style="display:inline-block;width:100px;height:16px;">Item</span>
					</div>
				</phantom-ui>
			`);
			await nextFrame();
			await el.updateComplete;
			const containerLabels = el.shadowRoot?.querySelectorAll(
				'.debug-label[data-kind="container"]',
			);
			expect(containerLabels?.length).to.be.greaterThan(0);
		});
	});

	it("applies stagger delay to blocks", async () => {
		const el = await fixture<PhantomUi>(html`
			<phantom-ui loading stagger="0.1">
				<div style="width:200px;">
					<p style="width:150px;height:20px;">Line 1</p>
					<p style="width:120px;height:20px;">Line 2</p>
				</div>
			</phantom-ui>
		`);
		await nextFrame();
		await el.updateComplete;
		const blocks = el.shadowRoot?.querySelectorAll(".shimmer-block");
		expect(blocks.length).to.be.greaterThanOrEqual(2);
		const secondStyle = blocks[1].getAttribute("style") || "";
		expect(secondStyle).to.include("animation-delay");
	});

	it("applies reveal fade-out transition", async () => {
		const el = await fixture<PhantomUi>(html`
			<phantom-ui loading reveal="0.5">
				<div style="width:100px;height:50px;">Text</div>
			</phantom-ui>
		`);
		await nextFrame();
		await el.updateComplete;
		const blocksBefore = el.shadowRoot?.querySelectorAll(".shimmer-block");
		expect(blocksBefore.length).to.be.greaterThan(0);
		el.loading = false;
		await el.updateComplete;
		await el.updateComplete;
		const overlay = el.shadowRoot?.querySelector(".shimmer-overlay");
		expect(overlay).to.exist;
		expect(overlay?.classList.contains("revealing")).to.be.true;
		await aTimeout(700);
		await el.updateComplete;
		const overlayAfter = el.shadowRoot?.querySelector(".shimmer-overlay");
		expect(overlayAfter).to.not.exist;
	});

	it("skips elements with data-shimmer-ignore", async () => {
		const el = await fixture<PhantomUi>(html`
			<phantom-ui loading>
				<div style="width:200px;">
					<p style="width:150px;height:20px;">Visible</p>
					<p style="width:120px;height:20px;" data-shimmer-ignore>Ignored</p>
				</div>
			</phantom-ui>
		`);
		await nextFrame();
		await el.updateComplete;
		const blocks = el.shadowRoot?.querySelectorAll(".shimmer-block");
		expect(blocks.length).to.equal(1);
	});

	it("captures data-shimmer-no-children as single block", async () => {
		const el = await fixture<PhantomUi>(html`
			<phantom-ui loading>
				<div style="width:200px;height:100px;" data-shimmer-no-children>
					<p style="width:150px;height:20px;">Child 1</p>
					<p style="width:120px;height:20px;">Child 2</p>
					<p style="width:100px;height:20px;">Child 3</p>
				</div>
			</phantom-ui>
		`);
		await nextFrame();
		await el.updateComplete;
		const blocks = el.shadowRoot?.querySelectorAll(".shimmer-block");
		expect(blocks.length).to.equal(1);
	});

	it("uses data-shimmer-width/height to override dimensions", async () => {
		const el = await fixture<PhantomUi>(html`
			<phantom-ui loading>
				<div style="width:200px;">
					<span style="display:inline-block;width:80px;height:16px;"
						data-shimmer-width="200" data-shimmer-height="40">Text</span>
				</div>
			</phantom-ui>
		`);
		await nextFrame();
		await el.updateComplete;
		const block = query(shadowOf(el), ".shimmer-block");
		expect(block).to.exist;
		expect(block.style.width).to.equal("200px");
		expect(block.style.height).to.equal("40px");
	});

	it("renders block for zero-size element with data-shimmer-width/height", async () => {
		const el = await fixture<PhantomUi>(html`
			<phantom-ui loading>
				<div style="width:200px;height:100px;">
					<div style="width:0;height:0;"
						data-shimmer-width="120" data-shimmer-height="24">Empty</div>
				</div>
			</phantom-ui>
		`);
		await nextFrame();
		await el.updateComplete;
		const blocks = el.shadowRoot?.querySelectorAll(".shimmer-block");
		expect(blocks.length).to.equal(1);
	});

	it("data-shimmer-ignore keeps text visible during loading", async () => {
		const el = await fixture<PhantomUi>(html`
			<phantom-ui loading>
				<div style="width:200px;">
					<p style="width:150px;height:20px;" data-shimmer-ignore>Stay visible</p>
				</div>
			</phantom-ui>
		`);
		await nextFrame();
		await el.updateComplete;
		const p = query(el, "[data-shimmer-ignore]");
		const style = getComputedStyle(p);
		expect(style.webkitTextFillColor).to.not.equal(TRANSPARENT);
		expect(style.pointerEvents).to.not.equal("none");
	});

	it("data-shimmer-ignore keeps images visible during loading", async () => {
		const el = await fixture<PhantomUi>(html`
			<phantom-ui loading>
				<div style="width:200px;">
					<div data-shimmer-ignore>
						<img style="width:48px;height:48px;" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
					</div>
				</div>
			</phantom-ui>
		`);
		await nextFrame();
		await el.updateComplete;
		const img = query(el, "[data-shimmer-ignore] img");
		const style = getComputedStyle(img);
		expect(style.opacity).to.equal("1");
	});

	it("re-measures when a child image loads", async () => {
		const el = await fixture<PhantomUi>(html`
			<phantom-ui loading>
				<div style="width:200px;">
					<p style="width:150px;height:20px;">Text</p>
				</div>
			</phantom-ui>
		`);
		await nextFrame();
		await el.updateComplete;
		const blocksBefore = el.shadowRoot?.querySelectorAll(".shimmer-block");
		const countBefore = blocksBefore?.length ?? 0;

		const img = document.createElement("img");
		img.style.width = "80px";
		img.style.height = "80px";
		img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
		el.querySelector("div")?.appendChild(img);

		await new Promise((r) => img.addEventListener("load", r));
		await nextFrame();
		await el.updateComplete;

		const blocksAfter = el.shadowRoot?.querySelectorAll(".shimmer-block");
		expect(blocksAfter?.length).to.be.greaterThan(countBefore);
	});

	// A consumer that renders <phantom-ui> inside its own shadow root: design systems, and
	// Angular ViewEncapsulation.ShadowDom. Document styles do not cross into a shadow tree,
	// so the hiding rules have to be adopted into the host's own root, not the document.
	// Covers three paths nothing else reaches: a <slot> that is not its parent's only
	// child (so the parent is not a leaf and the walker must resolve the slot), a reveal
	// interrupted before its timeout fires, and background-color written inline.
	describe("edge cases", () => {
		it("resolves a <slot> sitting beside other elements in a pierced root", async () => {
			if (!customElements.get("mixed-slot")) {
				customElements.define(
					"mixed-slot",
					class extends HTMLElement {
						connectedCallback() {
							if (this.shadowRoot) return;
							this.attachShadow({ mode: "open" }).innerHTML =
								'<div><span style="display:block;width:30px;height:10px"></span><slot></slot></div>';
						}
					},
				);
			}
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading pierce-shadow>
					<mixed-slot style="display:block;width:200px">
						<p class="projected" style="width:90px;height:14px;margin:0">projected</p>
					</mixed-slot>
				</phantom-ui>
			`);
			const widths = await widthsOf(el);
			// 30px from the shadow span, 90px from the light-DOM child reached via the slot.
			expect(widths).to.include(30);
			expect(widths).to.include(90);
		});

		it("cancels a pending reveal when loading restarts", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading reveal="1">
					<div style="width:100px;height:40px;">Text</div>
				</phantom-ui>
			`);
			await nextFrame();
			await el.updateComplete;

			el.loading = false;
			await el.updateComplete;
			el.loading = true;
			await el.updateComplete;

			// The interrupted timeout must not fire later and wipe the blocks.
			await aTimeout(1200);
			expect(el.shadowRoot?.querySelectorAll(".shimmer-block").length).to.be.greaterThan(0);
			expect(el.getAttribute("aria-busy")).to.equal("true");
		});

		it("writes background-color inline only when customized", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading background-color="rgb(1, 2, 3)">
					<div style="width:100px;height:40px;">Text</div>
				</phantom-ui>
			`);
			await nextFrame();
			await el.updateComplete;
			const overlay = query(shadowOf(el), ".shimmer-overlay");
			expect(overlay.style.getPropertyValue("--shimmer-bg")).to.equal("rgb(1, 2, 3)");
		});
	});

	describe("hosted inside another shadow root", () => {
		class OuterHost extends HTMLElement {
			connectedCallback() {
				if (this.shadowRoot) return;
				this.attachShadow({ mode: "open" }).innerHTML = `
					<phantom-ui loading>
						<div style="width:200px">
							<p class="txt" style="width:150px;height:20px">real text</p>
							<img class="pic" alt="" style="width:40px;height:40px"
								src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">
						</div>
					</phantom-ui>`;
			}
		}
		before(() => {
			if (!customElements.get("outer-host")) customElements.define("outer-host", OuterHost);
		});

		// We adopt into a root the consumer owns, so a component that rebuilds its own
		// adoptedStyleSheets on re-render drops our sheet, and that produces no
		// MutationRecord to react to. The next measure pass has to put it back.
		it("re-adopts after the host component rebuilds its own stylesheets", async function () {
			if (!SUPPORTS_ADOPTING_STYLESHEETS) this.skip();
			const el = await fixture<HTMLElement>(
				html`<outer-host style="display:block;width:300px"></outer-host>`,
			);
			await nextFrame();
			await nextFrame();

			const root = shadowOf(el);
			const txt = query(root, ".txt");
			expect(getComputedStyle(txt).webkitTextFillColor, "hidden initially").to.equal(TRANSPARENT);

			const own = new CSSStyleSheet();
			own.replaceSync("p { color: rebeccapurple; }");
			root.adoptedStyleSheets = [own];
			expect(getComputedStyle(txt).webkitTextFillColor, "dropped by the host").to.not.equal(
				TRANSPARENT,
			);

			query(root, "phantom-ui").appendChild(document.createElement("span"));
			await nextFrame();
			await nextFrame();
			expect(getComputedStyle(txt).webkitTextFillColor, "restored by the next pass").to.equal(
				TRANSPARENT,
			);
		});

		it("hides slotted content at every depth", async () => {
			const el = await fixture<HTMLElement>(
				html`<outer-host style="display:block;width:300px"></outer-host>`,
			);
			await nextFrame();
			await nextFrame();

			const root = shadowOf(el);
			const inner = queryAs(root, "phantom-ui", PhantomUi);
			expect(inner.shadowRoot?.querySelectorAll(".shimmer-block").length).to.be.greaterThan(0);

			const txt = query(root, ".txt");
			const pic = query(root, ".pic");
			expect(getComputedStyle(txt).webkitTextFillColor, "nested text").to.equal(TRANSPARENT);
			// Not reachable by ::slotted(), which only matches direct children.
			expect(getComputedStyle(pic).opacity, "nested media").to.equal("0");
		});
	});

	describe("pierce-shadow", () => {
		// Minimal Stencil-like component: shadow:true with a slot, mirroring k-text
		class MockText extends HTMLElement {
			connectedCallback() {
				if (this.shadowRoot) return;
				const root = this.attachShadow({ mode: "open" });
				const p = document.createElement("p");
				p.style.cssText = "font-size:16px;line-height:24px;margin:0;";
				p.appendChild(document.createElement("slot"));
				root.appendChild(p);
			}
		}
		// Component with multiple internal elements + named slots, mirroring k-header
		class MockHeader extends HTMLElement {
			connectedCallback() {
				if (this.shadowRoot) return;
				const root = this.attachShadow({ mode: "open" });
				root.innerHTML = `
					<header style="display:flex;gap:12px;align-items:center;height:48px;">
						<div class="start"><slot name="start"></slot></div>
						<a class="logo" href="./" style="width:120px;height:32px;display:block;background:#333;"></a>
						<div class="end"><slot name="end"></slot></div>
					</header>`;
			}
		}
		const MASK_URL =
			"url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22><rect width=%2224%22 height=%2224%22/></svg>')";
		// Wraps a <mock-text> inside its own shadow root, so the controller has to cross
		// two shadow boundaries. Also carries a mask-image icon that only the shadow-piercing
		// pass can reach.
		class MockNested extends HTMLElement {
			connectedCallback() {
				if (this.shadowRoot) return;
				const root = this.attachShadow({ mode: "open" });
				root.innerHTML = `
					<div style="display:flex;gap:8px;align-items:center;">
						<span class="inner-icon" style="display:inline-block;width:24px;height:24px;
							-webkit-mask-image:${MASK_URL};mask-image:${MASK_URL};background-color:#7aa2f7;"></span>
						<mock-text style="display:block;width:120px;">Nested</mock-text>
					</div>`;
			}
		}
		before(() => {
			if (!customElements.get("mock-text")) customElements.define("mock-text", MockText);
			if (!customElements.get("mock-header")) customElements.define("mock-header", MockHeader);
			if (!customElements.get("mock-nested")) customElements.define("mock-nested", MockNested);
		});

		// Deliberately a change with no layout effect: anything that resizes the host is
		// already caught by the ResizeObserver, so it would not prove the shadow root is
		// observed. An attribute write inside the root is invisible to every other signal.
		it("re-measures on an attribute change inside a pierced shadow root", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading pierce-shadow>
					<mock-nested style="display:block;width:200px;"></mock-nested>
				</phantom-ui>
			`);
			// Let the initial ResizeObserver cascade drain: while measures are still in
			// flight, a later one would pick the change up by coincidence and the test
			// would pass with no shadow observation at all.
			await aTimeout(200);
			await el.updateComplete;

			const widths = () =>
				[...(el.shadowRoot?.querySelectorAll(".shimmer-block") ?? [])].map((b) =>
					Math.round(Number.parseFloat(b.style.width)),
				);
			expect(widths(), "icon measured at its own size").to.include(24);

			const root = shadowOf(query(el, "mock-nested"));
			root.querySelector(".inner-icon")?.setAttribute("data-shimmer-width", "80");

			await aTimeout(200);
			await el.updateComplete;
			expect(widths(), "override inside the shadow root must be picked up").to.include(80);
		});

		it("adopts the hiding stylesheet into shadow roots nested inside shadow roots", async function () {
			if (!SUPPORTS_ADOPTING_STYLESHEETS) this.skip();
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading pierce-shadow>
					<mock-nested style="display:block;width:200px;"></mock-nested>
				</phantom-ui>
			`);
			await nextFrame();
			await el.updateComplete;

			const outer = query(el, "mock-nested");
			const inner = query(shadowOf(outer), "mock-text");
			const adopted = (host: HTMLElement) => host.shadowRoot?.adoptedStyleSheets.length ?? 0;
			expect(adopted(outer)).to.equal(1);
			expect(adopted(inner)).to.equal(1);
			// The same sheet instance is shared, never duplicated per root.
			const shared =
				outer.shadowRoot?.adoptedStyleSheets[0] === inner.shadowRoot?.adoptedStyleSheets[0];
			expect(shared, "both roots must adopt the same sheet instance").to.be.true;

			el.loading = false;
			await el.updateComplete;
			expect(adopted(outer)).to.equal(0);
			expect(adopted(inner)).to.equal(0);
		});

		// Behaviour-level counterpart to the stylesheet-injection test above: whatever
		// mechanism hides pierced shadow content, the computed style is what matters.
		it("hides text inside a pierced shadow root and restores it", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading pierce-shadow>
					<mock-text style="display:block;width:200px;">Hello world</mock-text>
				</phantom-ui>
			`);
			await nextFrame();
			await el.updateComplete;

			const host = query(el, "mock-text");
			const inner = query(shadowOf(host), "p");
			expect(getComputedStyle(inner).webkitTextFillColor).to.equal(TRANSPARENT);

			el.loading = false;
			await el.updateComplete;
			expect(getComputedStyle(inner).webkitTextFillColor).to.not.equal(TRANSPARENT);
		});

		// Deliberately a change with no layout effect: anything that resizes the host is
		// already caught by the ResizeObserver, so it would not prove the shadow root is
		// observed. An attribute write inside the root is invisible to every other signal.
		// Adopting into a root the host component owns means the host can drop our sheet
		// by reassigning its own array (design systems that swap styles on re-render do
		// this). Text stays hidden either way because -webkit-text-fill-color inherits
		// across the boundary, but media opacity does not, so the next measure pass has
		// to put the sheet back.
		it("re-adopts the hiding sheet when the host replaces its own stylesheets", async function () {
			if (!SUPPORTS_ADOPTING_STYLESHEETS) this.skip();
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading pierce-shadow>
					<mock-nested style="display:block;width:200px;"></mock-nested>
				</phantom-ui>
			`);
			await nextFrame();
			await el.updateComplete;

			const host = query(el, "mock-nested");
			const root = shadowOf(host);
			expect(root.adoptedStyleSheets.length, "adopted while loading").to.equal(1);

			root.adoptedStyleSheets = [];
			expect(root.adoptedStyleSheets.length, "host wiped it").to.equal(0);

			// A light-DOM mutation is what the host observes, so it drives the next pass.
			el.appendChild(document.createElement("span"));
			await nextFrame();
			await nextFrame();
			await el.updateComplete;
			expect(root.adoptedStyleSheets.length, "restored by the next measure").to.equal(1);
		});

		it("marks mask-image icons living inside a shadow root", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading pierce-shadow>
					<mock-nested style="display:block;width:200px;"></mock-nested>
				</phantom-ui>
			`);
			await nextFrame();
			await el.updateComplete;

			const outer = query(el, "mock-nested");
			const icon = query(shadowOf(outer), ".inner-icon");
			expect(icon.hasAttribute("data-phantom-graphic")).to.be.true;

			el.loading = false;
			await el.updateComplete;
			expect(icon.hasAttribute("data-phantom-graphic")).to.be.false;
		});

		it("does not pierce shadow by default (single block at host boundary)", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading>
					<mock-text style="display:block;width:200px;">Hello world</mock-text>
				</phantom-ui>
			`);
			await nextFrame();
			await el.updateComplete;
			const blocks = el.shadowRoot?.querySelectorAll(".shimmer-block");
			// Without piercing, mock-text has no light element children -> measured as one leaf
			expect(blocks?.length).to.equal(1);
		});

		it("measures the inner text box when pierce-shadow is set", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading pierce-shadow>
					<mock-text style="display:block;width:200px;">Hello world</mock-text>
				</phantom-ui>
			`);
			await nextFrame();
			await el.updateComplete;
			const blocks = el.shadowRoot?.querySelectorAll(".shimmer-block");
			expect(blocks?.length).to.be.greaterThanOrEqual(1);
		});

		it("measures inner elements of a shadow component with named slots", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading pierce-shadow>
					<mock-header style="display:block;width:600px;">
						<button slot="start" style="width:32px;height:32px;">M</button>
					</mock-header>
				</phantom-ui>
			`);
			await nextFrame();
			await el.updateComplete;
			const blocks = el.shadowRoot?.querySelectorAll(".shimmer-block");
			// At least the logo anchor + the projected hamburger button
			expect(blocks?.length).to.be.greaterThanOrEqual(2);
		});

		it("reflects pierce-shadow as a property", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading pierce-shadow>
					<div style="width:100px;height:40px;">x</div>
				</phantom-ui>
			`);
			expect(el.pierceShadow).to.equal(true);
		});
	});

	describe("inline SVG with text layer", () => {
		it("data-shimmer-no-children collapses an SVG-with-text wrapper to one block", async () => {
			const svg = `<svg width="120" height="32" viewBox="0 0 120 32" xmlns="http://www.w3.org/2000/svg">
				<rect width="120" height="32" rx="4"/>
				<text x="10" y="20" font-size="14">LOGO</text>
			</svg>`;

			// Without the escape hatch: the wrapper recurses and can yield multiple blocks
			const without = await fixture<PhantomUi>(html`
				<phantom-ui loading>
					<a class="logo" style="display:inline-block;width:120px;height:32px;">
						<span class="logo-mark" .innerHTML=${svg}></span>
					</a>
				</phantom-ui>
			`);
			await nextFrame();
			await without.updateComplete;
			const withoutBlocks = without.shadowRoot?.querySelectorAll(".shimmer-block");

			// With data-shimmer-no-children: exactly one block for the whole logo
			const withHatch = await fixture<PhantomUi>(html`
				<phantom-ui loading>
					<a class="logo" data-shimmer-no-children style="display:inline-block;width:120px;height:32px;">
						<span class="logo-mark" .innerHTML=${svg}></span>
					</a>
				</phantom-ui>
			`);
			await nextFrame();
			await withHatch.updateComplete;
			const withBlocks = withHatch.shadowRoot?.querySelectorAll(".shimmer-block");

			expect(withBlocks?.length).to.equal(1);
			expect(withoutBlocks?.length ?? 0).to.be.greaterThanOrEqual(1);
		});
	});

	// Asserted through computed style only, never through the stylesheet that produces it:
	// the rules reach the page as an adopted sheet, a <style> fallback, a sheet adopted
	// into each pierced root, or ssr.css. These stay valid whichever one does the work.
	describe("content hiding while loading", () => {
		const IMG_SRC =
			"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

		async function hidingFixture(loading = true): Promise<PhantomUi> {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui ?loading=${loading}>
					<p class="direct" style="width:150px;height:20px;">Direct child</p>
					<div style="width:200px;">
						<p class="nested" style="width:150px;height:20px;">Nested descendant</p>
						<img class="nested-img" style="width:48px;height:48px;" src="${IMG_SRC}" />
					</div>
					<img class="direct-img" style="width:48px;height:48px;" src="${IMG_SRC}" />
					<button class="direct-btn" style="width:80px;height:24px;">Go</button>
					<span class="fake-btn" role="button" style="display:block;width:80px;height:24px;">Go</span>
					<svg class="direct-svg" width="24" height="24"><rect width="24" height="24" /></svg>
				</phantom-ui>
			`);
			await nextFrame();
			await el.updateComplete;
			return el;
		}

		const styleOf = (el: PhantomUi, sel: string) => getComputedStyle(queryEl(el, sel));

		// Nested text is only reached through the descendant combinator, so covering both
		// depths catches a rule that matches direct children alone.
		for (const sel of [".direct", ".nested"]) {
			it(`makes text in ${sel} invisible and unselectable while loading`, async () => {
				const el = await hidingFixture();
				const style = styleOf(el, sel);
				expect(style.webkitTextFillColor).to.equal(TRANSPARENT);
				expect(style.pointerEvents).to.equal("none");
			});
		}

		for (const sel of [".direct-img", ".nested-img", ".direct-btn", ".fake-btn", ".direct-svg"]) {
			it(`hides the graphic ${sel} while loading`, async () => {
				const el = await hidingFixture();
				expect(getComputedStyle(queryEl(el, sel)).opacity).to.equal("0");
			});
		}

		it("applies nothing when not loading", async () => {
			const el = await hidingFixture(false);
			expect(styleOf(el, ".direct").webkitTextFillColor).to.not.equal(TRANSPARENT);
			expect(styleOf(el, ".nested").webkitTextFillColor).to.not.equal(TRANSPARENT);
			expect(styleOf(el, ".direct-img").opacity).to.equal("1");
			expect(styleOf(el, ".nested-img").opacity).to.equal("1");
		});

		it("restores everything when loading ends", async () => {
			const el = await hidingFixture();
			el.loading = false;
			await el.updateComplete;
			expect(styleOf(el, ".direct").webkitTextFillColor).to.not.equal(TRANSPARENT);
			expect(styleOf(el, ".nested").webkitTextFillColor).to.not.equal(TRANSPARENT);
			expect(styleOf(el, ".direct").pointerEvents).to.not.equal("none");
			expect(styleOf(el, ".direct-img").opacity).to.equal("1");
			expect(styleOf(el, ".nested-img").opacity).to.equal("1");
			expect(styleOf(el, ".direct-svg").opacity).to.equal("1");
		});

		// A CSP without `unsafe-inline` blocks <style> elements but not constructed
		// stylesheets, so the delivery mechanism is load-bearing, not an implementation
		// detail. Going back to an injected <style> would silently break strict-CSP hosts.
		// Assert on booleans, never on the node itself: chai inspects the value it was
		// given to build the failure message, and a live DOM node stalls the runner
		// instead of reporting.
		// Idempotency is keyed on the sheet being present, not on a "already ran" flag, so
		// anything that replaces document.adoptedStyleSheets wholesale (view transitions,
		// SPA head managers) is repaired the next time an instance connects.
		it("delivers the rules as an adopted stylesheet, never a <style> element", async function () {
			if (!SUPPORTS_ADOPTING_STYLESHEETS) this.skip();
			await hidingFixture();
			const injected = document.querySelector("style#phantom-ui-loading-styles") !== null;
			expect(injected, "must not inject a <style> element").to.be.false;

			const adopted = document.adoptedStyleSheets.some((sheet) =>
				[...sheet.cssRules].some((rule) => rule.selectorText?.includes("phantom-ui[loading]")),
			);
			expect(adopted, "hiding rules must be adopted on the document").to.be.true;
		});

		it("re-adopts the document sheet after it is replaced wholesale", async function () {
			if (!SUPPORTS_ADOPTING_STYLESHEETS) this.skip();
			await hidingFixture();
			const ours = () =>
				document.adoptedStyleSheets.filter((s) =>
					[...s.cssRules].some((r) => r.selectorText?.includes("phantom-ui[loading]")),
				).length;
			expect(ours(), "adopted once loading").to.equal(1);

			document.adoptedStyleSheets = [];
			expect(ours(), "wiped").to.equal(0);

			await hidingFixture();
			expect(ours(), "restored on the next connect").to.equal(1);
		});

		it("leaves content alone in overlay mode", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading mode="overlay">
					<p class="direct" style="width:150px;height:20px;">Still readable</p>
					<img class="direct-img" style="width:48px;height:48px;" src="${IMG_SRC}" />
				</phantom-ui>
			`);
			await nextFrame();
			await el.updateComplete;
			expect(styleOf(el, ".direct").webkitTextFillColor).to.not.equal(TRANSPARENT);
			expect(styleOf(el, ".direct-img").opacity).to.not.equal("0");
		});
	});

	describe("masked graphic icons", () => {
		it("hides mask-image icons while loading and restores them after", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading>
					<div style="display:flex;gap:8px;">
						<span
							class="icon"
							style="display:inline-block;width:24px;height:24px;
								-webkit-mask-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22><rect width=%2224%22 height=%2224%22/></svg>');
								mask-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22><rect width=%2224%22 height=%2224%22/></svg>');
								background-color:#7aa2f7;"
						></span>
						<span style="width:120px;height:16px;display:inline-block;">Label</span>
					</div>
				</phantom-ui>
			`);
			await nextFrame();
			await el.updateComplete;

			const icon = query(el, ".icon");
			expect(icon.hasAttribute("data-phantom-graphic")).to.be.true;

			el.loading = false;
			await el.updateComplete;
			expect(icon.hasAttribute("data-phantom-graphic")).to.be.false;
		});

		it("detects mask-image on ::before pseudo-elements", async () => {
			const style = document.createElement("style");
			style.textContent = `
				.pseudo-icon::before {
					content: "";
					display: block;
					width: 24px;
					height: 24px;
					background-color: #7aa2f7;
					-webkit-mask-image: url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22><rect width=%2224%22 height=%2224%22/></svg>');
					mask-image: url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22><rect width=%2224%22 height=%2224%22/></svg>');
				}
			`;
			document.head.appendChild(style);

			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading>
					<div style="display:flex;">
						<i class="pseudo-icon"></i>
					</div>
				</phantom-ui>
			`);
			await nextFrame();
			await el.updateComplete;
			const icon = query(el, ".pseudo-icon");
			expect(icon.hasAttribute("data-phantom-graphic")).to.be.true;

			document.head.removeChild(style);
		});

		it("does not mark plain elements as graphics", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading>
					<div class="plain" style="width:100px;height:40px;background:#1a1b26;">Text</div>
				</phantom-ui>
			`);
			await nextFrame();
			await el.updateComplete;
			const plain = query(el, ".plain");
			expect(plain.hasAttribute("data-phantom-graphic")).to.be.false;
		});
	});

	describe("theming via CSS custom properties", () => {
		async function overlayOf(el: PhantomUi): Promise<HTMLElement> {
			await nextFrame();
			await el.updateComplete;
			return query(shadowOf(el), ".shimmer-overlay");
		}

		it("does not write default custom properties inline on the overlay", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading>
					<div style="width:100px;height:40px;">Text</div>
				</phantom-ui>
			`);
			const overlay = await overlayOf(el);
			expect(overlay.style.getPropertyValue("--shimmer-color")).to.equal("");
			expect(overlay.style.getPropertyValue("--shimmer-bg")).to.equal("");
			expect(overlay.style.getPropertyValue("--shimmer-duration")).to.equal("");
		});

		it("lets a value set on the host inherit down to the overlay", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading>
					<div style="width:100px;height:40px;">Text</div>
				</phantom-ui>
			`);
			el.style.setProperty("--shimmer-color", "rgb(255, 0, 0)");
			const overlay = await overlayOf(el);
			expect(getComputedStyle(overlay).getPropertyValue("--shimmer-color").trim()).to.equal(
				"rgb(255, 0, 0)",
			);
		});

		it("writes the value inline when customized per-instance via attribute", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading shimmer-color="rgb(0, 128, 0)" duration="3">
					<div style="width:100px;height:40px;">Text</div>
				</phantom-ui>
			`);
			const overlay = await overlayOf(el);
			expect(overlay.style.getPropertyValue("--shimmer-color")).to.equal("rgb(0, 128, 0)");
			expect(overlay.style.getPropertyValue("--shimmer-duration")).to.equal("3s");
		});

		it("a per-instance attribute overrides an inherited host value", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading shimmer-color="rgb(0, 128, 0)">
					<div style="width:100px;height:40px;">Text</div>
				</phantom-ui>
			`);
			el.style.setProperty("--shimmer-color", "rgb(255, 0, 0)");
			const overlay = await overlayOf(el);
			expect(getComputedStyle(overlay).getPropertyValue("--shimmer-color").trim()).to.equal(
				"rgb(0, 128, 0)",
			);
		});

		it("removing a numeric attribute restores the default instead of a stale inline value", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading duration="3">
					<div style="width:100px;height:40px;">Text</div>
				</phantom-ui>
			`);
			let overlay = await overlayOf(el);
			expect(overlay.style.getPropertyValue("--shimmer-duration")).to.equal("3s");

			el.removeAttribute("duration");
			overlay = await overlayOf(el);
			// Lit's Number converter yields null on removal — it must not be
			// serialized as "--shimmer-duration: nulls" (which computes to 0s
			// and shadows inherited theming).
			expect(overlay.style.getPropertyValue("--shimmer-duration")).to.equal("");
		});

		it("removing a numeric attribute lets an inherited host value apply again", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading duration="3">
					<div style="width:100px;height:40px;">Text</div>
				</phantom-ui>
			`);
			el.style.setProperty("--shimmer-duration", "9s");
			let overlay = await overlayOf(el);
			expect(getComputedStyle(overlay).getPropertyValue("--shimmer-duration").trim()).to.equal(
				"3s",
			);

			el.removeAttribute("duration");
			overlay = await overlayOf(el);
			expect(getComputedStyle(overlay).getPropertyValue("--shimmer-duration").trim()).to.equal(
				"9s",
			);
		});

		it("an invalid numeric attribute does not emit a broken custom property", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading duration="oops">
					<div style="width:100px;height:40px;">Text</div>
				</phantom-ui>
			`);
			const overlay = await overlayOf(el);
			// NaN must not be serialized as "--shimmer-duration: NaNs".
			expect(overlay.style.getPropertyValue("--shimmer-duration")).to.equal("");
		});

		it("removing the reveal attribute does not leave a stale --reveal-duration", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading reveal="2">
					<div style="width:100px;height:40px;">Text</div>
				</phantom-ui>
			`);
			let overlay = await overlayOf(el);
			expect(overlay.style.getPropertyValue("--reveal-duration")).to.equal("2s");

			el.removeAttribute("reveal");
			overlay = await overlayOf(el);
			expect(overlay.style.getPropertyValue("--reveal-duration")).to.equal("");
		});

		// The animation shorthands reference --shimmer-duration with no fallback, so the
		// :host declaration is the only thing keeping them from resolving to 0s.
		it("resolves the default duration from :host into the block animations", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading>
					<div style="width:100px;height:40px;">Text</div>
				</phantom-ui>
			`);
			await overlayOf(el);
			const block = query(shadowOf(el), ".shimmer-block");
			expect(getComputedStyle(block, "::after").animationDuration).to.equal("1.5s");

			el.animation = "pulse";
			await el.updateComplete;
			expect(getComputedStyle(block).animationDuration).to.equal("1.5s");
		});
	});

	describe("block border radius", () => {
		it("keeps the measured radius of an element that has one", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading>
					<div style="width:100px;height:40px;border-radius:8px;">Text</div>
				</phantom-ui>
			`);
			const [block] = await blocksOf(el);
			expect(block.style.borderRadius).to.equal("8px");
		});

		it("falls back to fallback-radius when the element has none", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading fallback-radius="6">
					<div style="width:100px;height:40px;">Text</div>
				</phantom-ui>
			`);
			const [block] = await blocksOf(el);
			expect(block.style.borderRadius).to.equal("6px");
		});
	});

	// A table cell stretches to its column, so measuring the cell box would draw a
	// full-width bar for two characters of text. The engine measures the text instead.
	describe("table cells", () => {
		const table = (cell: string, width = 600) =>
			`<table style="width:${width}px;table-layout:fixed;border-collapse:collapse;"><tbody><tr>${cell}</tr></tbody></table>`;

		async function widthsOfTable(markup: string): Promise<number[]> {
			const host = document.createElement("phantom-ui");
			host.setAttribute("loading", "");
			host.innerHTML = markup;
			document.body.appendChild(host);
			const widths = await widthsOf(host);
			host.remove();
			return widths;
		}

		for (const tag of ["td", "th"] as const) {
			it(`measures the text width, not the column width, in a <${tag}>`, async () => {
				const [width] = await widthsOfTable(
					table(`<${tag} style="width:600px;padding:0;">Hi</${tag}>`),
				);
				expect(width).to.be.greaterThan(0);
				expect(width).to.be.lessThan(100);
			});
		}

		it("clamps to the cell width when the text overflows it", async () => {
			const [width] = await widthsOfTable(
				table(
					'<td style="width:40px;padding:0;overflow:hidden;">Far more text than forty pixels can hold</td>',
					40,
				),
			);
			expect(width).to.equal(40);
		});

		it("lets data-shimmer-width override the text measurement", async () => {
			const [width] = await widthsOfTable(
				table('<td style="width:600px;padding:0;" data-shimmer-width="200">Hi</td>'),
			);
			expect(width).to.equal(200);
		});

		it("leaves non-cell elements at their full box width", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading>
					<div style="width:600px;height:20px;">Hi</div>
				</phantom-ui>
			`);
			const [width] = await widthsOf(el);
			expect(width).to.equal(600);
		});
	});

	describe("attribute-based loading (React 18)", () => {
		it('strips loading="false" set as an attribute and reveals content', async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading>
					<p style="width:150px;height:20px;">Hello after load</p>
				</phantom-ui>
			`);
			await nextFrame();
			await el.updateComplete;

			// React 18 sets the attribute (not the property) on update.
			el.setAttribute("loading", "false");
			await el.updateComplete;

			expect(el.loading).to.be.false;
			expect(el.hasAttribute("loading")).to.be.false;
			expect(el.shadowRoot?.querySelector(".shimmer-overlay")).to.not.exist;

			const p = query(el, "p");
			const style = getComputedStyle(p);
			expect(style.webkitTextFillColor).to.not.equal(TRANSPARENT);
			expect(style.pointerEvents).to.not.equal("none");
		});

		it('treats static loading="false" markup as not loading', async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading="false">
					<p style="width:150px;height:20px;">Visible</p>
				</phantom-ui>
			`);
			await nextFrame();
			await el.updateComplete;

			expect(el.loading).to.be.false;
			expect(el.hasAttribute("loading")).to.be.false;
			const p = query(el, "p");
			expect(getComputedStyle(p).pointerEvents).to.not.equal("none");
		});

		it("still removes the attribute when loading is cleared via the property", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading>
					<p style="width:150px;height:20px;">Hello</p>
				</phantom-ui>
			`);
			await nextFrame();
			await el.updateComplete;

			el.loading = false;
			await el.updateComplete;

			expect(el.hasAttribute("loading")).to.be.false;
		});
	});

	describe("accessibility: inert during loading", () => {
		it("makes slotted content inert (out of tab order) while loading", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading>
					<div><button id="btn">Action</button></div>
				</phantom-ui>
			`);
			await nextFrame();
			await el.updateComplete;
			const btn = queryAs(el, "#btn", HTMLButtonElement);
			btn.focus();
			expect(document.activeElement).to.not.equal(btn);
		});

		it("keeps data-shimmer-ignore elements interactive", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading>
					<div>
						<button id="hidden">Hidden</button>
						<button id="keep" data-shimmer-ignore>Cancel</button>
					</div>
				</phantom-ui>
			`);
			await nextFrame();
			await el.updateComplete;
			const keep = queryAs(el, "#keep", HTMLButtonElement);
			const hidden = queryAs(el, "#hidden", HTMLButtonElement);
			keep.focus();
			expect(document.activeElement).to.equal(keep);
			hidden.focus();
			expect(document.activeElement).to.not.equal(hidden);
		});

		it("restores interactivity when loading ends", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading>
					<div><button id="btn">Action</button></div>
				</phantom-ui>
			`);
			await nextFrame();
			await el.updateComplete;
			el.loading = false;
			await el.updateComplete;
			const btn = queryAs(el, "#btn", HTMLButtonElement);
			btn.focus();
			expect(document.activeElement).to.equal(btn);
		});

		it("does not clobber a consumer's own inert on restore", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading>
					<div id="wrap" inert><button>Action</button></div>
				</phantom-ui>
			`);
			await nextFrame();
			await el.updateComplete;
			el.loading = false;
			await el.updateComplete;
			const wrap = query(el, "#wrap");
			expect(wrap.hasAttribute("inert")).to.be.true;
		});

		it("inerts content added during loading", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading>
					<div id="wrap"><button id="first">First</button></div>
				</phantom-ui>
			`);
			await nextFrame();
			await el.updateComplete;
			const wrap = query(el, "#wrap");
			const late = document.createElement("button");
			late.id = "late";
			wrap.appendChild(late);
			await nextFrame();
			await nextFrame();
			await el.updateComplete;
			late.focus();
			expect(document.activeElement).to.not.equal(late);
		});
	});

	describe("reconnection", () => {
		it("re-initializes observers and inert when moved in the DOM while loading", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading>
					<div id="card"><button id="btn">Action</button></div>
				</phantom-ui>
			`);
			await nextFrame();
			await el.updateComplete;
			const before =
				el.shadowRoot?.querySelectorAll(".shimmer-block, .shimmer-container-block").length ?? 0;

			const host = document.createElement("div");
			document.body.appendChild(host);
			host.appendChild(el);
			await nextFrame();
			await el.updateComplete;

			const btn = queryAs(el, "#btn", HTMLButtonElement);
			btn.focus();
			expect(document.activeElement).to.not.equal(btn);

			const card = query(el, "#card");
			const p = document.createElement("p");
			p.style.cssText = "width:120px;height:20px;";
			card.appendChild(p);
			await nextFrame();
			await nextFrame();
			await el.updateComplete;
			const after =
				el.shadowRoot?.querySelectorAll(".shimmer-block, .shimmer-container-block").length ?? 0;
			expect(after).to.be.greaterThan(before);

			host.remove();
		});
	});

	describe("overlay mode", () => {
		it("keeps slotted content visible and keyboard-reachable but not clickable while loading", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading mode="overlay">
					<div><button id="btn">Action</button><p>Stale row</p></div>
				</phantom-ui>
			`);
			await nextFrame();
			await el.updateComplete;

			const p = query(el, "p");
			expect(getComputedStyle(p).webkitTextFillColor).to.not.equal(TRANSPARENT);

			// Stale content is dimmed and non-clickable during the refresh, but stays
			// in the a11y tree and keyboard-reachable (aria-busy announces the update).
			const div = query(el, "div");
			expect(getComputedStyle(div).pointerEvents).to.equal("none");

			const btn = queryAs(el, "#btn", HTMLButtonElement);
			btn.focus();
			expect(document.activeElement).to.equal(btn);
		});

		it("measures the content and renders glint blocks over it", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading mode="overlay">
					<div style="width:200px;height:60px;">Grid</div>
				</phantom-ui>
			`);
			await nextFrame();
			await el.updateComplete;

			// Overlay is structure-aware: it still measures and renders blocks, which
			// become transparent glints (via --shimmer-bg: transparent) over the
			// visible content rather than opaque placeholders.
			expect(el.shadowRoot?.querySelectorAll(".shimmer-block").length).to.be.greaterThan(0);
			expect(el.getAttribute("aria-busy")).to.equal("true");
		});

		it("removes the overlay when loading ends", async () => {
			const el = await fixture<PhantomUi>(html`
				<phantom-ui loading mode="overlay">
					<div style="width:200px;height:60px;">Grid</div>
				</phantom-ui>
			`);
			await nextFrame();
			await el.updateComplete;
			el.loading = false;
			await el.updateComplete;

			expect(el.shadowRoot?.querySelector(".shimmer-overlay")).to.not.exist;
		});
	});
});
