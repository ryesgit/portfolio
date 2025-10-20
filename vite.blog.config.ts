import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist-blog',
    rollupOptions: {
      input: {
        main: './blog.html'
      }
    }
  },
  define: {
    'import.meta.env.VITE_APP_MODE': '"blog"'
  }
})