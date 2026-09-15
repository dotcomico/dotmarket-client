import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      '/uploads': 'http://localhost:3000',
      '/ai': {
        target: 'http://localhost:8100',
        rewrite: (path) => path.replace(/^\/ai/, '')
      }
    }
  }
})
