// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.js";
import { sentryVitePlugin } from "file:///home/project/node_modules/@sentry/vite-plugin/dist/esm/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({
      org: "biowell",
      project: "biowell-app",
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourceMaps: {
        include: ["./dist"],
        ignore: ["node_modules"]
      }
    })
  ],
  build: {
    outDir: "dist",
    sourcemap: true,
    // Enable for Sentry
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["framer-motion", "lucide-react", "@radix-ui/react-dialog"],
          utils: ["date-fns", "clsx", "tailwind-merge"],
          charts: ["recharts", "d3", "@visx/visx"],
          forms: ["react-hook-form", "zod"],
          query: ["@tanstack/react-query"]
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ["lucide-react", "@tanstack/react-query"]
  },
  server: {
    port: 5173,
    host: true
  },
  define: {
    __SENTRY_DEBUG__: false
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyBzZW50cnlWaXRlUGx1Z2luIH0gZnJvbSAnQHNlbnRyeS92aXRlLXBsdWdpbic7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBzZW50cnlWaXRlUGx1Z2luKHtcbiAgICAgIG9yZzogJ2Jpb3dlbGwnLFxuICAgICAgcHJvamVjdDogJ2Jpb3dlbGwtYXBwJyxcbiAgICAgIGF1dGhUb2tlbjogcHJvY2Vzcy5lbnYuU0VOVFJZX0FVVEhfVE9LRU4sXG4gICAgICBzb3VyY2VNYXBzOiB7XG4gICAgICAgIGluY2x1ZGU6IFsnLi9kaXN0J10sXG4gICAgICAgIGlnbm9yZTogWydub2RlX21vZHVsZXMnXSxcbiAgICAgIH0sXG4gICAgfSksXG4gIF0sXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiAnZGlzdCcsXG4gICAgc291cmNlbWFwOiB0cnVlLCAvLyBFbmFibGUgZm9yIFNlbnRyeVxuICAgIG1pbmlmeTogJ3RlcnNlcicsXG4gICAgdGVyc2VyT3B0aW9uczoge1xuICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgZHJvcF9jb25zb2xlOiB0cnVlLFxuICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICB2ZW5kb3I6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3JlYWN0LXJvdXRlci1kb20nXSxcbiAgICAgICAgICB1aTogWydmcmFtZXItbW90aW9uJywgJ2x1Y2lkZS1yZWFjdCcsICdAcmFkaXgtdWkvcmVhY3QtZGlhbG9nJ10sXG4gICAgICAgICAgdXRpbHM6IFsnZGF0ZS1mbnMnLCAnY2xzeCcsICd0YWlsd2luZC1tZXJnZSddLFxuICAgICAgICAgIGNoYXJ0czogWydyZWNoYXJ0cycsICdkMycsICdAdmlzeC92aXN4J10sXG4gICAgICAgICAgZm9ybXM6IFsncmVhY3QtaG9vay1mb3JtJywgJ3pvZCddLFxuICAgICAgICAgIHF1ZXJ5OiBbJ0B0YW5zdGFjay9yZWFjdC1xdWVyeSddLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBleGNsdWRlOiBbJ2x1Y2lkZS1yZWFjdCcsICdAdGFuc3RhY2svcmVhY3QtcXVlcnknXSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogNTE3MyxcbiAgICBob3N0OiB0cnVlXG4gIH0sXG4gIGRlZmluZToge1xuICAgIF9fU0VOVFJZX0RFQlVHX186IGZhbHNlLFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsb0JBQW9CO0FBQ3RQLE9BQU8sV0FBVztBQUNsQixTQUFTLHdCQUF3QjtBQUdqQyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixpQkFBaUI7QUFBQSxNQUNmLEtBQUs7QUFBQSxNQUNMLFNBQVM7QUFBQSxNQUNULFdBQVcsUUFBUSxJQUFJO0FBQUEsTUFDdkIsWUFBWTtBQUFBLFFBQ1YsU0FBUyxDQUFDLFFBQVE7QUFBQSxRQUNsQixRQUFRLENBQUMsY0FBYztBQUFBLE1BQ3pCO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBO0FBQUEsSUFDWCxRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsTUFDYixVQUFVO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxlQUFlO0FBQUEsTUFDakI7QUFBQSxJQUNGO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUEsVUFDWixRQUFRLENBQUMsU0FBUyxhQUFhLGtCQUFrQjtBQUFBLFVBQ2pELElBQUksQ0FBQyxpQkFBaUIsZ0JBQWdCLHdCQUF3QjtBQUFBLFVBQzlELE9BQU8sQ0FBQyxZQUFZLFFBQVEsZ0JBQWdCO0FBQUEsVUFDNUMsUUFBUSxDQUFDLFlBQVksTUFBTSxZQUFZO0FBQUEsVUFDdkMsT0FBTyxDQUFDLG1CQUFtQixLQUFLO0FBQUEsVUFDaEMsT0FBTyxDQUFDLHVCQUF1QjtBQUFBLFFBQ2pDO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsZ0JBQWdCLHVCQUF1QjtBQUFBLEVBQ25EO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sa0JBQWtCO0FBQUEsRUFDcEI7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
