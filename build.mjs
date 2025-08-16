// build.mjs
import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const BASE64_FILE = path.resolve(
    __dirname,
    'assets/dotlottie-player.wasm.base64.txt'
);

// ================================
// Option 1: Load and sanitize base64 for standalone build
// ================================

let base64Wasm = null;

try {
    base64Wasm = fs
        .readFileSync(BASE64_FILE, 'utf-8')
        .replace(/\s/g, '')
        .trim();

    if (!/^[A-Za-z0-9+/=]+$/.test(base64Wasm)) {
        throw new Error('Invalid characters in base64');
    }

    const pad = base64Wasm.length % 4;
    if (pad !== 0) {
        base64Wasm += '='.repeat(4 - pad);
    }

    console.log('✅ Base64 loaded and sanitized. Length:', base64Wasm.length);
} catch (err) {
    console.warn('⚠️  Could not load WASM for standalone build:', err.message);
    console.log('⏭️  Skipping dotlottie-web-standalone.js');
}

// ================================
// Build 1: Standalone (with embedded WASM)
// ================================

if (base64Wasm) {
    const base64Safe = JSON.stringify(base64Wasm);

    const wrapper = `(() => {
    try {
      const bin = Uint8Array.from(atob(${base64Safe}), c => c.charCodeAt(0)).buffer;
      const origFetch = window.fetch;
      window.fetch = new Proxy(origFetch, {
        apply(target, thisArg, args) {
          const [url] = args;
          if (typeof url === 'string' && url.endsWith('dotlottie-player.wasm')) {
            return Promise.resolve(new Response(bin, {
              status: 200,
              headers: { 'Content-Type': 'application/wasm' }
            }));
          }
          return Reflect.apply(target, thisArg, args);
        }
      });
      document.dispatchEvent(new CustomEvent('DotLottieReady'));
    } catch (e) {
      console.error('❌ dotlottie-web: Failed to inject WASM', e);
      throw e;
    }
  })();`;

    await esbuild.build({
        entryPoints: ['src/loader.js'],
        bundle: true,
        format: 'iife',
        outfile: 'build/dotlottie-web-standalone.js',
        external: [],
        banner: { js: wrapper },
        minify: true,
        sourcemap: false,
        logLevel: 'info',
    });

    console.log('✅ Built: build/dotlottie-web-standalone.js');
}

// ================================
// Build 2: Normal (vanilla, no embedded WASM)
// ================================

await esbuild.build({
    entryPoints: ['src/loader.js'],
    bundle: true,
    format: 'iife',
    outfile: 'build/dotlottie-web-iife.js',
    external: [],
    minify: true,
    sourcemap: false,
    logLevel: 'info',
});

console.log('✅ Built: build/dotlottie-web.js');
console.log('✨ Outputs:');
console.log('   • dotlottie-web-standalone.js — with embedded WASM (CSP-safe)');
console.log(
    '   • dotlottie-web-iife.js — normal version (uses external WASM fetch)'
);
