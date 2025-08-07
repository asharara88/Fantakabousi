import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sentryVitePlugin } from '@sentry/vite-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({
      org: 'biowell',
      project: 'biowell-app',
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourceMaps: {
        include: ['./dist'],
        ignore: ['node_modules'],
      },
    }),
  ],
  build: {
    outDir: 'dist',
    sourcemap: true, // Enable for Sentry
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react', '@radix-ui/react-dialog'],
          utils: ['date-fns', 'clsx', 'tailwind-merge'],
          charts: ['recharts', 'd3', '@visx/visx'],
          forms: ['react-hook-form', 'zod'],
          query: ['@tanstack/react-query'],
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react', '@tanstack/react-query'],
  },
  server: {
    port: 5173,
    host: true
  },
  define: {
    __SENTRY_DEBUG__: false,
  },
});
