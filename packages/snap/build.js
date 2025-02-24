const esbuild = require('esbuild');
const plugin = require('node-stdlib-browser/helpers/esbuild/plugin');
let stdLibBrowser = require('node-stdlib-browser');

stdLibBrowser = {
  ...stdLibBrowser,
};

console.log('Building snap with esbuild...');

esbuild.build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/snap.js',
  bundle: true,
  platform: 'browser',
  format: 'cjs',
  target: 'es2020',
  treeShaking: true,
  tsconfig: 'tsconfig.build.json',
  alias: {},
  plugins: [plugin(stdLibBrowser)],
  inject: [require.resolve('node-stdlib-browser/helpers/esbuild/shim')],
  define: {
    global: 'global',
    process: 'process',
    Buffer: 'Buffer',
  },
});

console.log('Finished building snap...');
