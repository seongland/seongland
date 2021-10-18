import pMemoize from 'p-memoize'
import { getAllPagesInSpace } from 'notion-utils'

import * as types from './types'
import { includeNotionIdInUrls } from './config'
import { notion } from './notion'
import { getCanonicalPageId } from './get-canonical-page-id'

const OPTIMIZED_CONCURRENCY = 1000

const uuid = !!includeNotionIdInUrls

export const getAllPages = pMemoize(getAllPagesImpl, { maxAge: 60000 * 5 })

export async function getAllPagesImpl(rootNotionPageId: string, rootNotionSpaceId: string): Promise<Partial<types.SiteMap>> {
  const pageMap = await getAllPagesInSpace(rootNotionPageId, rootNotionSpaceId, notion.getPage.bind(notion), {
    concurrency: OPTIMIZED_CONCURRENCY,
  })
  for (const uuid in pageMap) if (pageMap[uuid] === null) delete pageMap[uuid]

  const canonicalPageMap: types.CanonicalPageMap = Object.keys(pageMap).reduce(
    (map: types.CanonicalPageMap, pageId: string) => {
      const recordMap = pageMap[pageId]
      if (!recordMap) return map
      const canonicalPageId = getCanonicalPageId(pageId, recordMap, { uuid })
      if (map[canonicalPageId]) {
        console.error('error duplicate canonical page id', canonicalPageId, pageId, map[canonicalPageId])
        return map
      } else {
        map[canonicalPageId] = pageId
        return map
      }
    },
    <types.CanonicalPageMap>{}
  )

  return { pageMap, canonicalPageMap }
}
