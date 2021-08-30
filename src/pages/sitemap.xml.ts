import { host } from '~/lib/config'
import { getSiteMaps } from '~/lib/get-site-maps'

import type { GetStaticProps } from 'next'
import type { SiteMap } from '~/lib/types'

let sitemap: string

const SiteMapComponent = () => {}

const createSitemap = (siteMap: SiteMap) => `<?xml version="1.0" encoding="UTF-8"?>
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

export const getStaticProps: GetStaticProps = async () => {
  const siteMaps = await getSiteMaps()
  sitemap = createSitemap(siteMaps[0])
  return { props: {} }
}

export const getInitialProps = async ({ res }) => {
  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Cache-Control', 'public, s-maxage=3600, max-age=3600, stale-while-revalidate=3600')
  res.write(sitemap)
  res.end()
}

export default SiteMapComponent
