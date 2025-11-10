import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/frontend-SRMA-Liver/',
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
}) 