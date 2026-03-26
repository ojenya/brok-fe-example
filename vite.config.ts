import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: './', // для загрузки из Electron (file://)
  plugins: [react()],
  server: mode === 'development' ? {
    proxy: {
      '/core': { target: 'http://localhost:21815', changeOrigin: true },
      '/actuator': { target: 'http://localhost:21815', changeOrigin: true },
    },
  } : undefined,
}))
