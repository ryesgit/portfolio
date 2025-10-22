import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  root: './',
  publicDir: 'public',
  build: {
    outDir: 'dist-blog',
    rollupOptions: {
      input: './blog.html'
    }
  },
  server: {
    port: 5175
  },
  define: {
    'import.meta.env.VITE_APP_MODE': '"blog"'
  }
})