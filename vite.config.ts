import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['matrix-js-sdk'],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  define: {
    'process.env': {},
    'global': 'globalThis'
  },
  resolve: {
    alias: {
      'process': 'process/browser',
      'util': 'util'
    }
  },
  build: {
    commonjsOptions: {
      include: [/matrix-js-sdk/, /node_modules/]
    }
  }
});