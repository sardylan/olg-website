import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api/public': {
        target: 'http://172.29.10.208:7000',
        changeOrigin: true,
      },
      '/usermaps_images': {
        target: 'http://172.29.10.208',
        changeOrigin: true,
      },
    },
  },
})
