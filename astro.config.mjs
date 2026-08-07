import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import vercel from '@astrojs/vercel'
import { existsSync } from 'node:fs'
import { URL, fileURLToPath } from 'node:url'
import { spaceArticleIds } from './src/data/articles.ts'

// Vercel resolves /article/<name>/ to the index.html that build-articles.sh
// copies into public/, but Astro's dev server does not, so previewing an article
// locally 404s where production works. Rewrite only when the file is really
// there, so MDX article routes keep resolving normally.
function articleDirectoryIndex() {
  return {
    name: 'article-directory-index',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        const [path, query] = (request.url ?? '').split('?')
        if (/^\/article\/[^?]+\/$/.test(path)) {
          const file = fileURLToPath(new URL(`./public${path}index.html`, import.meta.url))
          if (existsSync(file)) request.url = `${path}index.html${query ? `?${query}` : ''}`
        }
        next()
      })
    },
  }
}

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
    plugins: [tailwindcss(), articleDirectoryIndex()],
    esbuild: {
      drop: ['debugger'],
      pure: ['console.log', 'console.debug'],
    },
  },
})
