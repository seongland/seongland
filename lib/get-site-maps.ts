import pMap from 'p-map'

import { getAllPages } from './get-all-pages'
import { getSites } from './get-sites'
import * as types from './types'

let siteMap: types.SiteMap[] = null

export async function getSiteMaps(): Promise<types.SiteMap[]> {
  if (siteMap) return siteMap
  const sites = await getSites()
  const siteMaps = await pMap(
    sites,
    async (site, index) => {
      try {
        console.log('getSiteMap', `${index + 1}/${sites.length}`, `(${(((index + 1) / sites.length) * 100) | 0}%)`, site)
        return { site, ...(await getAllPages(site.rootNotionPageId, site.rootNotionSpaceId)) } as types.SiteMap
      } catch (err) {
        console.warn('site build error', index, site, err)
      }
    },
    { concurrency: 1 }
  )
  siteMap = siteMaps.filter(Boolean)
  return siteMap
}
