import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import viteCompression from 'vite-plugin-compression';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteCompression({ algorithm: 'gzip' })],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      '/image': 'http://localhost:3000',
    },
  },
})
