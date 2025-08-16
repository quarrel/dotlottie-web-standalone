# dotLottie Web Standalone

A self-contained JavaScript bundle of [`@lottiefiles/dotlottie-web`](https://github.com/LottieFiles/dotlottie-web), designed for environments where external WASM fetching is problematic, such as userscripts or strict Content Security Policy (CSP) sites.

This repository provides two main builds:

-   `dotlottie-web-standalone.js`: Includes the WASM file inlined as base64, intercepting `fetch()` calls to serve it locally. Ideal for CSP-restricted environments.
-   `dotlottie-web-iife.js`: A standard IIFE bundle that fetches the WASM file externally, similar to the official library's behavior.

## Why use this?

The official `@lottiefiles/dotlottie-web` library:

-   Primarily ships as an ES Module (ESM).
-   Dynamically fetches its WebAssembly (WASM) file, which can be blocked by Content Security Policies (CSP) in certain environments.

This project addresses these limitations by:

-   Bundling everything into a single IIFE (`.js`) file.
-   For the `standalone` version:
    -   Inlining the WASM as a base64 string directly into the JavaScript bundle.
    -   Intercepting `fetch()` calls to serve the inlined WASM, ensuring it loads even under strict CSPs.

## Usage

You can use the bundles directly from jsDelivr. Choose the `standalone` version for CSP-restricted environments or the `iife` version for standard use cases.

### Via CDN (Recommended)

Include the script in your HTML:

```html
<!-- For CSP-safe, inlined WASM version -->
<script src="https://cdn.jsdelivr.net/gh/quarrel/dotlottie-web-standalone@v0.50.0/build/dotlottie-web-standalone.js"></script>

<!-- For standard IIFE version (WASM fetched externally) -->
<script src="https://cdn.jsdelivr.net/gh/quarrel/dotlottie-web-standalone@v0.50.0/build/dotlottie-web-iife.js"></script>
```

### `DotLottieReady` Event

After the WASM has been successfully ingested (only relevant for the `standalone` version), the script dispatches a custom event on `document`:

```js
document.dispatchEvent(new CustomEvent('DotLottieReady'));
```

You can listen for this event to ensure `DotLottie` and `DotLottieWorker` are available globally:

```js
document.addEventListener('DotLottieReady', () => {
    console.log('dotLottie is ready!');
    // Now you can safely use window.DotLottie and window.DotLottieWorker
    // Example:
    // const dotlottie = new window.DotLottie({
    //   canvas: document.getElementById('myCanvas'),
    //   src: 'animation.lottie',
    // });
});
```

### Example Userscript

This project was originally used in the UserScript [animate-web-emoji](https://github.com/quarrel/animate-web-emoji), which caches the `.wasm` itself, allowing it to be used on all CSP sites after being loaded once on a non-CSP site.

## Development

To build the project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/quarrel/dotlottie-web-standalone.git
    cd dotlottie-web-standalone
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Build the bundles:**
    ```bash
    npm run build
    ```
    This will generate `dotlottie-web-standalone.js` and `dotlottie-web-iife.js` in the `build/` directory.

## License

`@lottiefiles/dotlottie-web` is generously licensed under the MIT License.

All `dotlottie-web` files, including the generated JavaScript bundles in this repository, are Copyright (c) 2023 LottieFiles.com.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
