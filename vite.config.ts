import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React
          'vendor-react': ['react', 'react-dom', 'react-router'],
          // UI Libraries
          'vendor-ui': ['motion', 'lucide-react'],
          // Data fetching
          'vendor-query': ['@tanstack/react-query', 'zustand'],
          // Socket
          'vendor-socket': ['socket.io-client'],
          // Charts
          'vendor-charts': ['recharts'],
          // Utils
          'vendor-utils': ['date-fns'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
