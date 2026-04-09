/**
 * Core DOM measurement engine.
 * Walks the slotted DOM tree and extracts leaf element positions/sizes
 * to generate shimmer overlay blocks.
 *
 * Based on a well-established technique (getBoundingClientRect overlay skeletons)
 * with prior art from page-skeleton-webpack-plugin (2018),
 * @findify/skeleton-generator (~2019), and shimmer-from-structure (2026).
 */

export interface ElementInfo {
	x: number;
	y: number;
	width: number;
	height: number;
	tag: string;
	borderRadius: string;
}

const ALWAYS_LEAF_TAGS = new Set([
	"IMG",
	"SVG",
	"VIDEO",
	"CANVAS",
	"IFRAME",
	"INPUT",
	"TEXTAREA",
	"BUTTON",
	"HR",
]);

const VOID_TAGS = new Set(["BR", "WBR", "HR"]);

function isLeafElement(element: Element): boolean {
	if (ALWAYS_LEAF_TAGS.has(element.tagName)) {
		return true;
	}

	for (const child of element.children) {
		if (!VOID_TAGS.has(child.tagName)) {
			return false;
		}
	}

	return true;
}

function hasTextContent(element: Element): boolean {
	for (const node of element.childNodes) {
		if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
			return true;
		}
	}
	return false;
}

export function extractElementInfo(element: Element, parentRect: DOMRect): ElementInfo[] {
	const results: ElementInfo[] = [];

	function walk(el: Element): void {
		const rect = el.getBoundingClientRect();

		const overrideW = Number(el.getAttribute("data-shimmer-width")) || 0;
		const overrideH = Number(el.getAttribute("data-shimmer-height")) || 0;
		const w = overrideW || rect.width;
		const h = overrideH || rect.height;

		if (w === 0 || h === 0) {
			return;
		}

		if (el.hasAttribute("data-shimmer-ignore")) {
			return;
		}

		const shouldCapture = el.hasAttribute("data-shimmer-no-children") || isLeafElement(el);

		if (shouldCapture) {
			const style = getComputedStyle(el);
			const borderRadius = style.borderRadius;

			// For table cells with text, measure actual text width
			if ((el.tagName === "TD" || el.tagName === "TH") && hasTextContent(el) && !overrideW) {
				const span = document.createElement("span");
				span.style.visibility = "hidden";
				span.style.position = "absolute";
				span.textContent = el.textContent;
				el.appendChild(span);
				const spanRect = span.getBoundingClientRect();
				el.removeChild(span);

				results.push({
					x: rect.left - parentRect.left,
					y: rect.top - parentRect.top,
					width: Math.min(spanRect.width, rect.width),
					height: h,
					tag: el.tagName.toLowerCase(),
					borderRadius: borderRadius === "0px" ? "" : borderRadius,
				});
				return;
			}

			results.push({
				x: rect.left - parentRect.left,
				y: rect.top - parentRect.top,
				width: w,
				height: h,
				tag: el.tagName.toLowerCase(),
				borderRadius: borderRadius === "0px" ? "" : borderRadius,
			});
			return;
		}

		for (const child of el.children) {
			walk(child);
		}
	}

	walk(element);

	return results;
}

export function createResizeObserver(element: Element, callback: () => void): ResizeObserver {
	let rafId: number | null = null;

	const observer = new ResizeObserver(() => {
		if (rafId !== null) {
			cancelAnimationFrame(rafId);
		}
		rafId = requestAnimationFrame(() => {
			rafId = null;
			callback();
		});
	});

	observer.observe(element);
	return observer;
}
