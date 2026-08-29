import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // vite-react-ssg: keep React runtime modules bundled for SSR.
  ssr: {
    noExternal: ['framer-motion', 'lucide-react', 'react-router-dom'],
  },
  css: {
    // Tailwind v4 is processed by @tailwindcss/postcss on the client build.
    // For the SSR pass we don't need rendered CSS — the prerendered HTML
    // links to the same client-emitted stylesheet, so we skip CSS import
    // resolution in SSR to avoid the `tailwindcss` package lookup.
    preprocessorOptions: {
      css: {},
    },
  },
  // vite-react-ssg options
  ssgOptions: {
    mock: true,
    formatting: 'none',
    // `nested` so /ko/docs → dist/ko/docs/index.html (nginx serves index.html
    // for directory requests automatically, matching the SPA fallback pattern).
    dirStyle: 'nested',
  },
})
