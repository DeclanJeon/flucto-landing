import React from 'react'
import { ViteReactSSG } from 'vite-react-ssg'
import App from './App.tsx'

// Tailwind v4 is processed on the client build; we don't need its CSS during
// the SSR pass (the prerendered HTML links the same client stylesheet), so
// skip the import on the server to avoid the `tailwindcss` package lookup.
if (!import.meta.env.SSR) {
  await import('./index.css')
}

export const routes = [
  {
    path: '/',
    element: <App initialRoute="home" initialLang="en" />,
    entry: 'src/App.tsx',
  },
  {
    path: '/ko',
    element: <App initialRoute="home" initialLang="ko" />,
    entry: 'src/App.tsx',
  },
  {
    path: '/docs',
    element: <App initialRoute="docs" initialLang="en" />,
    entry: 'src/App.tsx',
  },
  {
    path: '/ko/docs',
    element: <App initialRoute="docs" initialLang="ko" />,
    entry: 'src/App.tsx',
  },
]

export const createRoot = ViteReactSSG({ routes }, () => {})
