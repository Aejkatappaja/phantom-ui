import { css } from "lit";

export const phantomUiStyles = css`
	:host {
		display: block;
		position: relative;
		overflow: hidden;
		--shimmer-color: rgba(128, 128, 128, 0.3);
		--shimmer-duration: 1.5s;
		--shimmer-bg: rgba(128, 128, 128, 0.2);
	}

	:host([loading]:not([mode="overlay"])) ::slotted(*) {
		-webkit-text-fill-color: transparent !important;
		pointer-events: none;
		user-select: none;
	}

	:host([loading]:not([mode="overlay"])) ::slotted(img),
	:host([loading]:not([mode="overlay"])) ::slotted(svg),
	:host([loading]:not([mode="overlay"])) ::slotted(video),
	:host([loading]:not([mode="overlay"])) ::slotted(canvas),
	:host([loading]:not([mode="overlay"])) ::slotted(button),
	:host([loading]:not([mode="overlay"])) ::slotted([role="button"]) {
		opacity: 0 !important;
	}

	/*
	 * Overlay mode: keep the content visible and dimmed, and turn each measured
	 * block into a transparent glint that sweeps over the matching element (a
	 * structure-aware stale-while-revalidate refresh). Setting --shimmer-bg to
	 * transparent makes both the block fill and the gradient edges transparent, so
	 * the same block + direction + reduced-motion rules become a pure light sweep.
	 */
	:host([mode="overlay"]) {
		--shimmer-bg: transparent;
	}

	:host([loading][mode="overlay"]) ::slotted(*) {
		opacity: var(--phantom-content-opacity, 0.5);
		pointer-events: none;
		transition: opacity 0.2s ease-out;
	}

	/* Container blocks replicate card backgrounds for count > 1, which would cover
	   the visible content. Overlay never duplicates rows, so hide them. */
	:host([mode="overlay"]) .shimmer-container-block {
		display: none;
	}

	.shimmer-overlay {
		position: absolute;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
		transition: opacity var(--reveal-duration, 0s) ease-out;
	}

	.shimmer-overlay.revealing {
		opacity: 0;
	}

	.shimmer-block {
		position: absolute;
		overflow: hidden;
	}

	.shimmer-container-block {
		position: absolute;
		box-sizing: border-box;
	}

	/* Shimmer mode (default) — ltr */
	.shimmer-block::after {
		content: "";
		position: absolute;
		inset: 0;
		background: linear-gradient(
			90deg,
			var(--shimmer-bg) 30%,
			var(--shimmer-color) 50%,
			var(--shimmer-bg) 70%
		);
		background-size: 200% 100%;
		animation: shimmer-ltr var(--shimmer-duration, 1.5s) linear infinite;
	}

	@keyframes shimmer-ltr {
		0% { background-position: 200% 0; }
		100% { background-position: -200% 0; }
	}

	/* Shimmer rtl */
	:host([shimmer-direction="rtl"]) .shimmer-block::after {
		animation-name: shimmer-rtl;
	}

	@keyframes shimmer-rtl {
		0% { background-position: -200% 0; }
		100% { background-position: 200% 0; }
	}

	/* Shimmer ttb */
	:host([shimmer-direction="ttb"]) .shimmer-block::after {
		background: linear-gradient(
			180deg,
			var(--shimmer-bg) 30%,
			var(--shimmer-color) 50%,
			var(--shimmer-bg) 70%
		);
		background-size: 100% 200%;
		animation-name: shimmer-ttb;
	}

	@keyframes shimmer-ttb {
		0% { background-position: 0 200%; }
		100% { background-position: 0 -200%; }
	}

	/* Shimmer btt */
	:host([shimmer-direction="btt"]) .shimmer-block::after {
		background: linear-gradient(
			180deg,
			var(--shimmer-bg) 30%,
			var(--shimmer-color) 50%,
			var(--shimmer-bg) 70%
		);
		background-size: 100% 200%;
		animation-name: shimmer-btt;
	}

	@keyframes shimmer-btt {
		0% { background-position: 0 -200%; }
		100% { background-position: 0 200%; }
	}

	/* Pulse mode */
	:host([animation="pulse"]) .shimmer-block {
		animation: phantom-pulse var(--shimmer-duration, 1.5s) ease-in-out infinite;
	}

	:host([animation="pulse"]) .shimmer-block::after {
		display: none;
	}

	@keyframes phantom-pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.4;
		}
	}

	/* Breathe mode - subtle scale + fade */
	:host([animation="breathe"]) .shimmer-block {
		animation: phantom-breathe var(--shimmer-duration, 1.5s) ease-in-out infinite;
	}

	:host([animation="breathe"]) .shimmer-block::after {
		display: none;
	}

	@keyframes phantom-breathe {
		0%,
		100% {
			opacity: 0.6;
			transform: scale(1);
		}
		50% {
			opacity: 1;
			transform: scale(1.02);
		}
	}

	/* Solid mode */
	:host([animation="solid"]) .shimmer-block::after {
		display: none;
	}

	/* Debug mode */
	:host([debug]) .shimmer-block {
		outline: 1px dashed rgba(247, 118, 142, 0.9);
		outline-offset: -1px;
	}

	:host([debug]) .shimmer-container-block {
		outline: 1px dashed rgba(122, 162, 247, 0.9);
		outline-offset: -1px;
	}

	.debug-label {
		position: absolute;
		top: 2px;
		left: 2px;
		font: 600 10px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
		color: #fff;
		background: rgba(247, 118, 142, 0.95);
		padding: 2px 5px;
		border-radius: 3px;
		pointer-events: none;
		z-index: 1;
	}

	.debug-label[data-kind="container"] {
		background: rgba(122, 162, 247, 0.95);
	}

	/* Reduced motion — degrade every animation mode to the static solid look
	   (WCAG 2.3.3: the infinite shimmer/pulse/breathe animations stop; blocks
	   keep their static background, exactly like animation="solid"). */
	@media (prefers-reduced-motion: reduce) {
		.shimmer-block,
		:host([animation]) .shimmer-block {
			animation: none;
		}

		.shimmer-block::after {
			display: none;
		}
	}
`;
