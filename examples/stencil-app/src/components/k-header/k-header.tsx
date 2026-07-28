import { Component, Host, h, Prop } from '@stencil/core';

const logoSvg = `
<svg viewBox="0 0 140 36" xmlns="http://www.w3.org/2000/svg">
  <rect width="140" height="36" rx="6" fill="#7aa2f7"/>
  <text x="70" y="24" font-size="15" font-family="system-ui" font-weight="700" fill="#0a0b10" text-anchor="middle">LOGO</text>
</svg>`;

/**
 * Header component mirroring a real design-system header:
 * shadow: true, named slots (start / end), an inner logo with inline SVG.
 */
@Component({
  tag: 'k-header',
  styleUrl: 'k-header.css',
  shadow: true,
})
export class KHeader {
  @Prop() logoAriaLabel = 'Home';

  render() {
    return (
      <Host>
        <header role="banner">
          <div class="start">
            <slot name="start" />
          </div>
          <a class="logo" href="./" aria-label={this.logoAriaLabel}>
            <span class="logo-mark" innerHTML={logoSvg} />
          </a>
          <div class="end">
            <slot name="end" />
          </div>
        </header>
      </Host>
    );
  }
}
