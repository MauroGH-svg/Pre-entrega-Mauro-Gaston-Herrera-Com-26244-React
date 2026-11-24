
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/Pre-entrega-Mauro-Gaston-Herrera-Com-26244-React/',
  plugins: [
    react(),
    tailwindcss(),
  ],
})
