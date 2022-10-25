import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  resolve: {
    alias: {
      'mapbox-gl': 'maplibre-gl',
    },
  },
  optimizeDeps: {
    exclude: ['@peripleo/peripleo'],
  },
  server: {
    open: '/public/index.html',
  },
  build: {
    rollupOptions: {
      input: 'index.html',
    },
  },
});
