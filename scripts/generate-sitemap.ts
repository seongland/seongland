import { readFile as read, writeFile as write } from 'fs/promises'
import { resolve as join } from 'path'
import { getSiteMaps } from '../lib/get-site-maps'
import prettier from 'prettier'

import type { SiteMap } from '../lib/types'

export default async () => {
  const pkg = await read('package.json')
    .then(json => JSON.parse(String(json)))
    .catch(() => null)
  const host = `https://${pkg.domain}`
  const prettierConfig = await prettier.resolveConfig(join('prettierrc.js'))
  const siteMaps = await getSiteMaps()
  const sitemap = createSitemap(siteMaps[0], host)
  const formatted = prettier.format(sitemap, {
    ...prettierConfig,
    parser: 'html',
  })
  return write(join('public', 'sitemap.xml'), formatted)
}

const createSitemap = (siteMap: SiteMap, host: string) => `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${host}</loc>
      </url>

      <url>
        <loc>${host}/</loc>
      </url>

      ${Object.keys(siteMap.canonicalPageMap)
        .map(canonicalPagePath =>
          `
            <url>
              <loc>${host}/${canonicalPagePath}</loc>
            </url>
          `.trim()
        )
        .join('')}
    </urlset>
    `
