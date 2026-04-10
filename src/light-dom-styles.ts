const LIGHT_DOM_STYLE_ID = "phantom-ui-loading-styles";

export function injectLightDomStyles(): void {
	if (document.getElementById(LIGHT_DOM_STYLE_ID)) return;
	const style = document.createElement("style");
	style.id = LIGHT_DOM_STYLE_ID;
	style.textContent = `
		phantom-ui[loading] * {
			-webkit-text-fill-color: transparent !important;
			pointer-events: none;
			user-select: none;
		}
		phantom-ui[loading] img,
		phantom-ui[loading] svg,
		phantom-ui[loading] video,
		phantom-ui[loading] canvas,
		phantom-ui[loading] button,
		phantom-ui[loading] [role="button"] {
			opacity: 0 !important;
		}
		phantom-ui[loading] [data-shimmer-ignore],
		phantom-ui[loading] [data-shimmer-ignore] * {
			-webkit-text-fill-color: initial !important;
			pointer-events: auto;
			user-select: auto;
		}
		phantom-ui[loading] [data-shimmer-ignore] img,
		phantom-ui[loading] [data-shimmer-ignore] svg,
		phantom-ui[loading] [data-shimmer-ignore] video,
		phantom-ui[loading] [data-shimmer-ignore] canvas,
		phantom-ui[loading] [data-shimmer-ignore] button,
		phantom-ui[loading] [data-shimmer-ignore] [role="button"] {
			opacity: 1 !important;
		}
	`;
	document.head.appendChild(style);
}
