import copyPublicAssets from './copy-public-assets'
import generateFavicons from './generate-favicons'

async function build() {
  await copyPublicAssets()
  await generateFavicons()
}

build()
