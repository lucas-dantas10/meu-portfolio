import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base './' faz o site funcionar em qualquer hospedagem (Vercel, Netlify, GitHub Pages).
export default defineConfig({
  base: './',
  plugins: [vue()],
})
