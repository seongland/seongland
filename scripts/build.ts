import copyPublicAssets from './copy-public-assets'
import generateFavicons from './generate-favicons'

async function build() {
  const promises = []
  promises.push(await generateFavicons())
  promises.push(await copyPublicAssets())
  await Promise.all(promises)
}

build()
