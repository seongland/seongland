import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import cs from 'classnames'
import { useRouter } from 'next/router'
import { useSearchParam } from 'react-use'
import BodyClassName from 'react-body-classname'
import useDarkMode from 'use-dark-mode'
import { PageBlock } from 'notion-types'

// core notion renderer
import { NotionRenderer, Code, Collection, CollectionRow } from 'react-notion-x'

// utils
import { getBlockTitle } from 'notion-utils'
import { mapPageUrl, getCanonicalPageUrl } from 'lib/map-page-url'
import { mapNotionImageUrl } from 'lib/map-image-url'
import { getPageDescription } from 'lib/get-page-description'
import { searchNotion } from 'lib/search-notion'
import * as types from 'lib/types'
import * as config from 'lib/config'

// components
import { CustomFont } from '../molecules/CustomFont'
import { Loading } from '../molecules/Loading'
import { Page404 } from '../organisms/Page404'
import { PageHead } from '../organisms/PageHead'
import { Footer } from '../molecules/Footer'
import { PageSocial } from '../organisms/PageSocial'
import { ReactUtterances } from '../molecules/ReactUtterances'

import styles from '../styles.module.css'

const Pdf = dynamic(() => import('react-notion-x').then(notion => notion.Pdf))
const Equation = dynamic(() => import('react-notion-x').then(notion => notion.Equation))
const Modal = dynamic(() => import('react-notion-x').then(notion => notion.Modal), { ssr: false })

// Main
export const NotionPage: React.FC<types.PageProps> = ({ site, recordMap, error, pageId }) => {
  const router = useRouter()
  const lite = useSearchParam('lite')

  const params: any = {}
  if (lite) params.lite = lite

  // lite mode is for oembed
  const isLiteMode = lite === 'true'
  const searchParams = new URLSearchParams(params)

  const darkMode = useDarkMode(false, { classNameDark: 'dark-mode' })

  if (router.isFallback) {
    return <Loading />
  }

  const keys = Object.keys(recordMap?.block || {})
  const block = recordMap?.block?.[keys[0]]?.value

  if (error || !site || !keys.length || !block) return <Page404 site={site} pageId={pageId} error={error} />
  const title = getBlockTitle(block, recordMap) || site.name

  if (!config.isServer) {
    // add important objects to the window global for easy debugging
    const g = window as any
    g.pageId = pageId
    g.recordMap = recordMap
    g.block = block
  }

  const siteMapPageUrl = mapPageUrl(site, recordMap, searchParams)

  const canonicalPageUrl = !config.isDev && getCanonicalPageUrl(site, recordMap)(pageId)
  const isBlogPost = block.type === 'page' && block.parent_table === 'collection'
  const showTableOfContents = !!isBlogPost
  const minTableOfContentsItems = 3

  const socialImage = mapNotionImageUrl((block as PageBlock).format?.page_cover || config.defaultPageCover, block)

  const socialDescription = getPageDescription(block, recordMap) ?? config.description

  let comments: React.ReactNode = null
  let pageAside: React.ReactChild = null

  // only display comments and page actions on blog post pages
  if (isBlogPost)
    if (config.utterancesGitHubRepo)
      comments = (
        <ReactUtterances
          repo={config.utterancesGitHubRepo}
          issueMap="issue-term"
          issueTerm="title"
          theme={darkMode.value ? 'photon-dark' : 'github-light'}
        />
      )

  pageAside = <PageSocial />

  return (
    <>
      <PageHead site={site} />

      <Head>
        <meta property="og:title" content={title} />
        <meta property="og:site_name" content={site.name} />

        <meta name="twitter:title" content={title} />
        <meta property="twitter:domain" content={site.domain} />

        {config.twitter && <meta name="twitter:creator" content={`@${config.twitter}`} />}

        {socialDescription && (
          <>
            <meta name="description" content={socialDescription} />
            <meta property="og:description" content={socialDescription} />
            <meta name="twitter:description" content={socialDescription} />
          </>
        )}

        {socialImage ? (
          <>
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:image" content={socialImage} />
            <meta property="og:image" content={socialImage} />
          </>
        ) : (
          <meta name="twitter:card" content="summary" />
        )}

        {canonicalPageUrl && (
          <>
            <link rel="canonical" href={canonicalPageUrl} />
            <meta property="og:url" content={canonicalPageUrl} />
            <meta property="twitter:url" content={canonicalPageUrl} />
          </>
        )}

        <title>{title}</title>
      </Head>

      <CustomFont site={site} />

      {isLiteMode && <BodyClassName className="notion-lite" />}

      <NotionRenderer
        bodyClassName={cs(styles.notion, pageId === site.rootNotionPageId && 'index-page')}
        components={{
          pageLink: ({ href, as, passHref, prefetch, replace, scroll, shallow, locale, ...props }) => (
            <Link
              href={href}
              as={as}
              passHref={passHref}
              prefetch={prefetch}
              replace={replace}
              scroll={scroll}
              shallow={shallow}
              locale={locale}
            >
              <a {...props} />
            </Link>
          ),
          code: Code,
          collection: Collection,
          collectionRow: CollectionRow,
          modal: Modal,
          pdf: Pdf,
          equation: Equation,
        }}
        recordMap={recordMap}
        rootPageId={site.rootNotionPageId}
        fullPage={!isLiteMode}
        darkMode={darkMode.value}
        previewImages={site.previewImages !== false}
        showCollectionViewDropdown={false}
        showTableOfContents={showTableOfContents}
        minTableOfContentsItems={minTableOfContentsItems}
        defaultPageIcon={config.defaultPageIcon}
        defaultPageCover={config.defaultPageCover}
        defaultPageCoverPosition={config.defaultPageCoverPosition}
        mapPageUrl={siteMapPageUrl}
        mapImageUrl={mapNotionImageUrl}
        searchNotion={searchNotion}
        pageFooter={comments}
        pageAside={pageAside}
        footer={<Footer isDarkMode={darkMode.value} toggleDarkMode={darkMode.toggle} />}
      />
    </>
  )
}
