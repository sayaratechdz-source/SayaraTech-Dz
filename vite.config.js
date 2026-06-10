import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'out',
  },
  server: {
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:1337',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
