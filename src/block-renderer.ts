import type { TemplateResult } from "lit";
import { html, nothing } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import type { ElementInfo } from "./dom-measurement.js";

interface RenderBlockOptions {
	/** Border radius applied to blocks measured with none (like text). */
	fallbackRadius: number;
	/** Fallback background when no `--shimmer-bg` is inherited. */
	backgroundColor: string;
	/** Per-block animation delay in seconds (0 = no stagger). */
	stagger: number;
	/** Outline each block with its index for inspection. */
	debug: boolean;
}

/** Render the measured blocks as positioned shimmer/container divs. */
export function renderBlocks(blocks: ElementInfo[], opts: RenderBlockOptions): TemplateResult[] {
	return blocks.map((block, index) => {
		const radius = block.borderRadius || `${opts.fallbackRadius}px`;
		const base = {
			left: `${block.x}px`,
			top: `${block.y}px`,
			width: `${block.width}px`,
			height: `${block.height}px`,
			"border-radius": radius,
		};

		if (block.isContainer) {
			const styles: Record<string, string> = { ...base };
			if (block.containerBg) styles.background = block.containerBg;
			if (block.containerBorder) styles.border = block.containerBorder;
			if (block.containerShadow) styles["box-shadow"] = block.containerShadow;
			return html`<div
        class="shimmer-container-block"
        style=${styleMap(styles)}
      >${opts.debug ? html`<span class="debug-label" data-kind="container">C${index}</span>` : nothing}</div>`;
		}

		const styles: Record<string, string> = {
			...base,
			background: `var(--shimmer-bg, ${opts.backgroundColor})`,
		};
		if (opts.stagger > 0) {
			styles["animation-delay"] = `${index * opts.stagger}s`;
		}
		return html`<div class="shimmer-block" style=${styleMap(styles)}>${opts.debug ? html`<span class="debug-label">${index}</span>` : nothing}</div>`;
	});
}
