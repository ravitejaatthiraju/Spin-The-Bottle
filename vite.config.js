import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Spin-The-Bottle/',
  plugins: [react()],
  server: {
    host: true
  }
})