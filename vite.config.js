import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    port: 5173,
    open: true,

    proxy: {
      '/weatherapi': {
        target: 'https://api.weatherapi.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/weatherapi/, ''),
      },
    },
  },

  build: {
    sourcemap: process.env.NODE_ENV !== 'production',
  },
})