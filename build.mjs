// build.mjs
import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const base64Wasm = fs.readFileSync(path.resolve(__dirname, 'assets/dotlottie-player.wasm.base64.txt'), 'utf-8');

const wrapper = `
(() => {
  // Decode WASM from base64
  const bin = Uint8Array.from(atob(${JSON.stringify(base64Wasm)}), c => c.charCodeAt(0)).buffer;

  // Intercept fetch for dotlottie-player.wasm
  const origFetch = window.fetch;
  window.fetch = new Proxy(origFetch, {
    apply(target, thisArg, args) {
      const [url] = args;
      if (typeof url === 'string' && url.endsWith('dotlottie-player.wasm')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          arrayBuffer: () => Promise.resolve(bin),
          blob: () => Promise.resolve(new Blob([new Uint8Array(bin)], { type: 'application/wasm' })),
        });
      }
      return Reflect.apply(target, thisArg, args);
    }
  });
})();
`;

await esbuild.build({
  entryPoints: ['node_modules/@lottiefiles/dotlottie-web/dist/index.js'],
  bundle: true,
  format: 'iife',
  outfile: 'build/dotlottie-standalone.js',
  external: [],
  banner: {
    js: wrapper
  },
  minify: true,
  sourcemap: false,
});

console.log('✅ Built: build/dotlottie-standalone.js');
