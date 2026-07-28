import { expect } from "@open-wc/testing";
import { SHADOW_HIDE_CSS } from "../src/hiding-css.js";
import { hideShadowRoot, injectLightDomStyles, unhideShadowRoot } from "../src/light-dom-styles.js";

/**
 * Exercises the `<style>` delivery that browsers without constructed stylesheets
 * (Safari < 16.4) fall back to. Removing the two properties the source feature-tests is
 * the only way to reach it, and without this the whole branch never runs in CI.
 *
 * The delivery functions are called directly rather than through the element: the
 * component's lifecycle resolves its own stylesheets during construction, which the
 * prototype surgery would also disturb.
 */
describe("stylesheet delivery fallback", () => {
	const docDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, "adoptedStyleSheets");
	const sheetDescriptor = Object.getOwnPropertyDescriptor(CSSStyleSheet.prototype, "replace");

	beforeEach(() => {
		Reflect.deleteProperty(Document.prototype, "adoptedStyleSheets");
		Reflect.deleteProperty(CSSStyleSheet.prototype, "replace");
	});

	afterEach(() => {
		if (docDescriptor) {
			Object.defineProperty(Document.prototype, "adoptedStyleSheets", docDescriptor);
		}
		if (sheetDescriptor) {
			Object.defineProperty(CSSStyleSheet.prototype, "replace", sheetDescriptor);
		}
		document.getElementById("phantom-ui-loading-styles")?.remove();
		globalThis.litNonce = undefined;
	});

	it("appends a <style> carrying the hiding rules to the document head", () => {
		injectLightDomStyles(document);

		const injected = document.getElementById("phantom-ui-loading-styles");
		if (!(injected instanceof HTMLStyleElement)) throw new Error("no <style> injected");
		expect(injected.parentElement).to.equal(document.head);
		expect(injected.textContent).to.contain("phantom-ui[loading]");
	});

	it("does not inject a second time", () => {
		injectLightDomStyles(document);
		injectLightDomStyles(document);
		expect(document.querySelectorAll("style#phantom-ui-loading-styles").length).to.equal(1);
	});

	it("carries litNonce so a nonce-based CSP still accepts the element", () => {
		globalThis.litNonce = "test-nonce";
		injectLightDomStyles(document);
		expect(document.getElementById("phantom-ui-loading-styles")?.getAttribute("nonce")).to.equal(
			"test-nonce",
		);
	});

	it("adds, deduplicates and removes the sheet inside a shadow root", () => {
		const host = document.createElement("div");
		const root = host.attachShadow({ mode: "open" });
		document.body.appendChild(host);
		try {
			hideShadowRoot(root);
			hideShadowRoot(root);
			const styles = root.querySelectorAll("style#phantom-ui-shadow-hide");
			expect(styles.length, "added once").to.equal(1);
			expect(styles[0].textContent).to.equal(SHADOW_HIDE_CSS);

			unhideShadowRoot(root);
			expect(root.querySelector("#phantom-ui-shadow-hide"), "removed").to.not.exist;
		} finally {
			host.remove();
		}
	});

	it("scopes the rules to a shadow root when the host lives in one", () => {
		const host = document.createElement("div");
		const root = host.attachShadow({ mode: "open" });
		document.body.appendChild(host);
		try {
			injectLightDomStyles(root);
			expect(root.querySelector("#phantom-ui-loading-styles"), "in the root").to.exist;
			expect(document.getElementById("phantom-ui-loading-styles"), "not in head").to.not.exist;
		} finally {
			host.remove();
		}
	});
});
