import { defineConfig } from 'vite'

export default defineConfig({
  // Для vanilla обычно достаточно дефолта
  // Но если нужно — укажи root и base
  root: './src',           // корень проекта (папка, где находится index.html)
  base: './',          // относительные пути в билде (важно для деплоя)

  server: {
    port: 5173,        // или любой другой
    open: true         // открывать браузер автоматически
  },

  build: {
    outDir: 'dist',    // куда складывать собранный проект
    sourcemap: true
  }
})