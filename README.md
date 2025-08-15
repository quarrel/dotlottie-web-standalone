# dotlottie-web-standalone

A self-contained, CSP-safe JavaScript bundle of [`@lottiefiles/dotlottie-web`](https://github.com/LottieFiles/dotlottie-web) with the WASM file inlined.

Perfect for:
- 🧩 **Userscripts** (Tampermonkey, Violentmonkey)
- 🔒 **CSP-restricted sites** (GitHub, Twitter, etc.)
- 📦 Embedding without external requests
- 🚀 Reliable, versioned CDN access

## Why?
The official @lottiefiles/dotlottie-web:

### Only ships ESM
### Dynamically fetches WASM → which may be blocked by CSP

### This repo fixes that by:

Bundling everything into one .js file
Inlining the WASM as base64
Intercepting fetch() calls
Making it work anywhere

@lottiefiles generously licenses dotlottie-web under the MIT License.

All dotlottie-web files, including the generated javascript here are Copyright (c) 2023 LottieFiles.com.

## Usage

Use directly from jsDelivr:

```js
// @resource DOTLOTTIE https://cdn.jsdelivr.net/gh/quarrel/dotlottie-web-standalone@v0.50.0/build/dotlottie-web-standalone.js
// @grant        GM_getResourceText
