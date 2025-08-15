// scripts/download-wasm.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const WASM_URL = `https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web@${pkg.version}/dist/dotlottie-player.wasm`;
const ASSETS_DIR = path.resolve(__dirname, '../assets');
const OUTPUT_FILE = path.join(ASSETS_DIR, 'dotlottie-player.wasm.base64.txt');

await fs.promises.mkdir(ASSETS_DIR, { recursive: true });

console.log('🔽 Downloading dotlottie-player.wasm...');
https.get(WASM_URL, (res) => {
  if (res.statusCode !== 200) {
    console.error('Failed to download WASM:', res.statusCode);
    process.exit(1);
  }

  const chunks = [];
  res.on('data', (chunk) => chunks.push(chunk));
  res.on('end', () => {
    const buffer = Buffer.concat(chunks);
    const base64 = buffer.toString('base64');
    fs.writeFileSync(OUTPUT_FILE, base64);
    console.log('✅ WASM saved as base64:', OUTPUT_FILE);
  });
}).on('error', (err) => {
  console.error('❌ Download error:', err);
  process.exit(1);
});
