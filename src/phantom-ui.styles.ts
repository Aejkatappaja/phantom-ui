import { css } from "lit";

export const phantomUiStyles = css`
	:host {
		display: block;
		position: relative;
		--shimmer-color: rgba(255, 255, 255, 0.3);
		--shimmer-duration: 1.5s;
		--shimmer-bg: rgba(255, 255, 255, 0.08);
	}

	:host([loading]) ::slotted(*) {
		color: transparent !important;
		-webkit-text-fill-color: transparent !important;
		pointer-events: none;
		user-select: none;
	}

	:host([loading]) ::slotted(img),
	:host([loading]) ::slotted(svg),
	:host([loading]) ::slotted(video),
	:host([loading]) ::slotted(canvas) {
		opacity: 0 !important;
	}

	.shimmer-overlay {
		position: absolute;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
	}

	.shimmer-block {
		position: absolute;
		overflow: hidden;
	}

	.shimmer-block::after {
		content: "";
		position: absolute;
		inset: 0;
		animation: shimmer-sweep var(--shimmer-duration, 1.5s) ease-in-out infinite;
	}

	@keyframes shimmer-sweep {
		0% {
			background: linear-gradient(
				90deg,
				transparent 0%,
				var(--shimmer-color) 50%,
				transparent 100%
			);
			background-size: 200% 100%;
			background-position: -100% 0;
		}
		100% {
			background: linear-gradient(
				90deg,
				transparent 0%,
				var(--shimmer-color) 50%,
				transparent 100%
			);
			background-size: 200% 100%;
			background-position: 200% 0;
		}
	}
`;
