import { NotionAPI } from 'notion-client'
import { ExtendedRecordMap, SearchParams, SearchResults } from 'notion-types'

import { getPreviewImages } from './get-preview-images'
import { mapNotionImageUrl } from './map-image-url'
import { getSiteConfig, getEnv } from './get-config-value'

export const activeUser: string | null = getSiteConfig('notionUserId', null)

export const notion = new NotionAPI({
  apiBaseUrl: process.env.NOTION_API_BASE_URL,
  authToken: getEnv('NOTION_API_AUTH_TOKEN', null),
  activeUser,
})

export async function getPage(pageId: string): Promise<ExtendedRecordMap> {
  const recordMap = await notion.getPage(pageId)
  const blockIds = Object.keys(recordMap.block)

  const imageUrls: string[] = blockIds
    .map(blockId => {
      const block = recordMap.block[blockId]?.value
      if (block) {
        if (block.type === 'image') {
          const source = block.properties?.source?.[0]?.[0]
          if (source) return { block, url: source }
        }
        if ((block.format as any)?.page_cover) {
          const source = (block.format as any).page_cover
          return { block, url: source }
        }
      }
      return null
    })
    .filter(Boolean)
    .map(({ block, url }) => mapNotionImageUrl(url, block))
    .filter(Boolean)

  const urls = Array.from(new Set(imageUrls))
  const previewImageMap = await getPreviewImages(urls)
  const map = recordMap as any
  map.preview_images = previewImageMap
  return map
}

export async function search(params: SearchParams): Promise<SearchResults> {
  return notion.search(params)
}
