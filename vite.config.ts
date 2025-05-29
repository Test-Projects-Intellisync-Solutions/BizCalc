import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Group vendor dependencies into separate chunks
          if (id.includes('node_modules')) {
            // Group React and React DOM together
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'vendor_react';
            }
            // Group UI components
            if (id.includes('@radix-ui') || id.includes('class-variance-authority') || id.includes('clsx') || id.includes('tailwind-merge')) {
              return 'vendor_ui';
            }
            // Group charting libraries
            if (id.includes('recharts') || id.includes('d3-')) {
              return 'vendor_charts';
            }
            // Group date libraries
            if (id.includes('date-fns') || id.includes('dayjs')) {
              return 'vendor_dates';
            }
            // Default vendor chunk for other node_modules
            return 'vendor';
          }
          // Group calculator components
          if (id.includes('/calculators/')) {
            if (id.includes('/suite/')) {
              const match = id.match(/\/suite\/([^/]+)/);
              return match ? `calculator_${match[1]}` : 'calculator_other';
            }
            if (id.includes('/tools/')) {
              const match = id.match(/\/tools\/([^/]+)/);
              return match ? `tool_${match[1]}` : 'tool_other';
            }
            return 'calculators_other';
          }
        },
        chunkFileNames: (chunkInfo) => {
          // Customize chunk file names for better caching
          if (chunkInfo.name === 'index') {
            return 'assets/[name]-[hash].js';
          }
          return 'assets/[name]-[hash].js';
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit to 1000KB
  },
});