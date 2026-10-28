import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // The backend only trusts the origins listed in CORS_ALLOWED_ORIGINS, so the
    // dev server must keep a fixed port instead of falling back to another one.
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
})
