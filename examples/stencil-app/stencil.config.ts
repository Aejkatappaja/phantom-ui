import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'phantom-demo',
  srcDir: 'src',
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null,
      copy: [
        {
          src: '../node_modules/@aejkatappaja/phantom-ui/dist/phantom-ui.cdn.js',
          dest: 'phantom-ui.cdn.js',
        },
      ],
    },
  ],
};
