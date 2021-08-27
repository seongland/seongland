import { readFile as read,writeFile as write } from 'fs/promises'
import { resolve as join } from 'path'
import prettier from 'prettier'

export default async () => {
  const pkg = await read('package.json')
    .then(json => JSON.parse(String(json)))
    .catch(() => null)
  const pages = []
  const prettierConfig = await prettier.resolveConfig(join('prettierrc.js'))
  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${pages
          .map((page) => {
            const route = page
              .replace('pages', '')
              .replace('data', '')
              .replace('.js', '')
              .replace('.mdx', '')
            return `
              <url>
                  <loc>${`https://${pkg.domain}${route}`}</loc>
              </url>
            `;
          })
          .join('')}
    </urlset>
    `;

  const formatted = prettier.format(sitemap, {
    ...prettierConfig,
    parser: 'html'
  })
  return write(join('public', 'sitemap.xml'), formatted)
}
