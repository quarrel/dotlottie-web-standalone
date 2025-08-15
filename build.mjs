// build.mjs
import * as esbuild from "esbuild";
import fs from "fs";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const BASE64_FILE = path.resolve(
  __dirname,
  "assets/dotlottie-player.wasm.base64.txt"
);

// Read and sanitize base64
let base64Wasm;
try {
  base64Wasm = fs
    .readFileSync(BASE64_FILE, "utf-8")
    .replace(/\s/g, "") // Remove ALL whitespace (critical!)
    .trim();

  // Validate base64 format
  if (!/^[A-Za-z0-9+/=]+$/.test(base64Wasm)) {
    throw new Error("Invalid characters in base64");
  }

  // Check padding
  const pad = base64Wasm.length % 4;
  if (pad !== 0) {
    base64Wasm += "=".repeat(4 - pad); // Fix padding
  }

  console.log("✅ Base64 loaded and sanitized. Length:", base64Wasm.length);
} catch (err) {
  console.error("❌ Failed to load or validate base64:", err.message);
  process.exit(1);
}

// Generate safe JS string injection
const base64Safe = JSON.stringify(base64Wasm);

// Fetch-intercept wrapper
const wrapper = `(() => {
  try {
    const bin = Uint8Array.from(atob(${base64Safe}), c => c.charCodeAt(0)).buffer;

    const origFetch = window.fetch;
    window.fetch = new Proxy(window.fetch, {
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

// Build
await esbuild.build({
  entryPoints: ["src/loader.js"],
  bundle: true,
  format: "iife",
  outfile: "build/dotlottie-web-standalone.js",
  external: [],
  banner: { js: wrapper },
  minify: true,
  sourcemap: false,
  logLevel: "info",
});

console.log("✅ Built: build/dotlottie-web-standalone.js");
