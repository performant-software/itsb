import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import dns from 'dns';

// serve dev on "localhost" instead of resolving to 127.0.0.1
dns.setDefaultResultOrder('verbatim');

export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  resolve: {
    alias: {
      'mapbox-gl': 'maplibre-gl',
    },
  },
  // optimizeDeps: {
  //   exclude: ['@peripleo/peripleo']
  // },
  server: {
    open: '/',
  },
  build: {
    rollupOptions: {
      input: 'index.html',
    },
  },
});
