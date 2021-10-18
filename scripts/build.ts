import copyPublicAssets from './copy-public-assets'
import generateFavicons from './generate-favicons'
import generateSitemap from './generate-sitemap'

async function build() {
  const promises = []
  promises.push(await generateFavicons())
  promises.push(await copyPublicAssets())
  promises.push(await generateSitemap())
  await Promise.all(promises)
}

build()
