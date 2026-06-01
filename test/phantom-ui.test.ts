import { aTimeout, expect, fixture, html } from "@open-wc/testing";
import type { PhantomUi } from "../src/phantom-ui.js";
import "../src/phantom-ui.js";

function nextFrame(): Promise<void> {
	return new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
}

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
		const secondStyle = (blocks[1] as HTMLElement).getAttribute("style") || "";
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
		const block = el.shadowRoot?.querySelector(".shimmer-block") as HTMLElement;
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
		const p = el.querySelector("[data-shimmer-ignore]") as HTMLElement;
		const style = getComputedStyle(p);
		expect(style.webkitTextFillColor).to.not.equal("transparent");
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
		const img = el.querySelector("[data-shimmer-ignore] img") as HTMLElement;
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
		before(() => {
			if (!customElements.get("mock-text")) customElements.define("mock-text", MockText);
			if (!customElements.get("mock-header")) customElements.define("mock-header", MockHeader);
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
});
