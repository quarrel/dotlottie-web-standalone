# dotlottie-web-standalone

A self-contained JavaScript bundle of [`@lottiefiles/dotlottie-web`](https://github.com/LottieFiles/dotlottie-web) with the WASM file inlined.

Perfect for:

- 🧩 **Userscripts** (Tampermonkey, Violentmonkey)
- 📦 Embedding without external requests
- 🚀 Reliable, versioned CDN access

## Why?

The official @lottiefiles/dotlottie-web:

- Only ships ESM
- Dynamically fetches WASM → which may be blocked by CSP

This repo fixes that by:

Bundling everything into one .js file
Inlining the WASM as base64
Intercepting fetch() calls
Making it work anywhere

@lottiefiles generously licenses dotlottie-web under the MIT License.

All dotlottie-web files, including the generated javascript here are Copyright (c) 2023 LottieFiles.com.

## Usage

Use directly from jsDelivr:

```js
https://cdn.jsdelivr.net/gh/quarrel/dotlottie-web-standalone@v0.50.0/build/dotlottie-web-standalone.js
```

The script sends:

```js
document.dispatchEvent(new CustomEvent("DotLottieReady"));
```

after the WASM has been successfully ingested, if needed.
