import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['framer-motion', 'lucide-react'],
          utils: ['date-fns', 'clsx', 'tailwind-merge'],
          charts: ['recharts', 'victory', '@visx/visx'],
          forms: ['react-hook-form', '@hookform/resolvers'],
          query: ['@tanstack/react-query', 'react-query']
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'framer-motion']
  },
  server: {
    port: 5173,
    host: true,
    hmr: {
      overlay: false
    }
  }
});
