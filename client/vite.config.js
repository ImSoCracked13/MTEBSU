import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import UnoCSS from 'unocss/vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    solidPlugin(),
    UnoCSS(),
  ],
  server: {
    port: 5173,
    hmr: {
      overlay: false
    }
  },
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
    minify: 'esbuild'
  },
  optimizeDeps: {
    include: ['solid-js', '@solidjs/router']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});