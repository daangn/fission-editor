import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const root = resolve(__dirname, 'src/examples');

export default defineConfig({
  root,
  test: {},
  plugins: [
    react(),
  ],
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        demo: resolve(root, 'demo/index.html'),
      },
    },
  },
});
