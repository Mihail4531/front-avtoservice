import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Теперь это будет работать

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Сопоставляем символ @ с папкой src
      '@': path.resolve(__dirname, './src'),
    },
  },
})