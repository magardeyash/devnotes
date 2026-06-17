import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Output directory Netlify will be pointed at
    outDir: 'dist',
    // Emit a warning (not an error) for large chunks
    chunkSizeWarningLimit: 600,
  },
  server: {
    // Local dev proxy so you never need CORS during development
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
