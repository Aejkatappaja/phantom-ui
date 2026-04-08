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
});
