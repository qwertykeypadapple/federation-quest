import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5174 },
  // `npm run start` (vite preview) is used by host platforms like Render.
  // Allow their generated domains so the preview server doesn't reject the Host header.
  preview: { host: true, allowedHosts: true },
})
