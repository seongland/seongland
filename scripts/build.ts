import copyPublicAssets from './copy-public-assets'
import generateFavicons from './generate-favicons'
import generateSitemap from './generate-sitemap'

async function build() {
  const promises = []
  promises.push(copyPublicAssets())
  promises.push(generateFavicons())
  promises.push(generateSitemap())
  await Promise.all(promises)
}

build()
