import React from 'react'
import { isDev, domain } from 'lib/config'
import { getSiteMaps } from 'lib/get-site-maps'
import { resolveNotionPage } from 'lib/resolve-notion-page'
import { NotionPage } from '@/components'

export const getStaticProps = async context => {
  const rawPageId = context.params.pageId as string
  try {
    if (rawPageId === 'robots.txt') return { redirect: { destination: `/api/${rawPageId}` } }
    const props = await resolveNotionPage(domain, rawPageId)
    return { props, revalidate: 10 }
  } catch (err) {
    console.error(domain, rawPageId, err)
    return { notFound: true, revalidate: 10 }
  }
}

export async function getStaticPaths() {
  if (isDev) return { paths: [], fallback: true }
  const siteMaps = await getSiteMaps()
  const ret = {
    paths: siteMaps.flatMap(siteMap => Object.keys(siteMap.canonicalPageMap).map(pageId => ({ params: { pageId } }))),
    fallback: true,
  }
  return ret
}

const NotionDomainDynamicPage = props => <NotionPage {...props} />

export default NotionDomainDynamicPage
