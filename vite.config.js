import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/blackhole/', // <-- add this line (replace 'stars' with your repo name)
  plugins: [react()],
})
