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

			const icon = el.querySelector(".icon") as HTMLElement;
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
			const icon = el.querySelector(".pseudo-icon") as HTMLElement;
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
			const plain = el.querySelector(".plain") as HTMLElement;
			expect(plain.hasAttribute("data-phantom-graphic")).to.be.false;
		});
	});

	describe("theming via CSS custom properties", () => {
		async function overlayOf(el: PhantomUi): Promise<HTMLElement> {
			await nextFrame();
			await el.updateComplete;
			return el.shadowRoot?.querySelector(".shimmer-overlay") as HTMLElement;
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

			const p = el.querySelector("p") as HTMLElement;
			const style = getComputedStyle(p);
			expect(style.webkitTextFillColor).to.not.equal("transparent");
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
			const p = el.querySelector("p") as HTMLElement;
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
			const btn = el.querySelector("#btn") as HTMLButtonElement;
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
			const keep = el.querySelector("#keep") as HTMLButtonElement;
			const hidden = el.querySelector("#hidden") as HTMLButtonElement;
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
			const btn = el.querySelector("#btn") as HTMLButtonElement;
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
			const wrap = el.querySelector("#wrap") as HTMLElement;
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
			const wrap = el.querySelector("#wrap") as HTMLElement;
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

			const btn = el.querySelector("#btn") as HTMLButtonElement;
			btn.focus();
			expect(document.activeElement).to.not.equal(btn);

			const card = el.querySelector("#card") as HTMLElement;
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
});
