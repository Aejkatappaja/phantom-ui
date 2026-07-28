import { Component, Host, h, Prop } from '@stencil/core';

export type TextVariant = 'body' | 'heading';

/**
 * Minimal text component mirroring a real Stencil design-system primitive:
 * shadow: true, a styled <p>, and a default <slot>.
 */
@Component({
  tag: 'k-text',
  styleUrl: 'k-text.css',
  shadow: true,
})
export class KText {
  @Prop() variant: TextVariant = 'body';

  render() {
    return (
      <Host>
        <p class={this.variant}>
          <slot />
        </p>
      </Host>
    );
  }
}
