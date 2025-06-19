import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3004',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      },
      '/api/generate-yearly-report': {
        target: 'http://localhost:3004',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
