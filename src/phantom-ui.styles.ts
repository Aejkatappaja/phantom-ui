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

	:host([loading]) ::slotted(*) {
		-webkit-text-fill-color: transparent !important;
		pointer-events: none;
		user-select: none;
	}

	:host([loading]) ::slotted(img),
	:host([loading]) ::slotted(svg),
	:host([loading]) ::slotted(video),
	:host([loading]) ::slotted(canvas),
	:host([loading]) ::slotted(button),
	:host([loading]) ::slotted([role="button"]) {
		opacity: 0 !important;
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
`;
