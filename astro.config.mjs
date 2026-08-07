import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import vercel from '@astrojs/vercel'
import { spaceArticleIds } from './src/data/articles.ts'

export default defineConfig({
  site: 'https://seongland.com',
  output: 'static',
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  integrations: [
    react(),
    mdx(),
    sitemap({
      customPages: spaceArticleIds.map(id => `https://seongland.com/article/${id}/`),
      filter: page => !page.includes('/login') && !page.includes('/admin'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    esbuild: {
      drop: ['debugger'],
      pure: ['console.log', 'console.debug'],
    },
  },
})
