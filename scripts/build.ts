import copyPublicAssets from './copy-public-assets'

async function build() {
  await copyPublicAssets()
}

build()
