import Head from 'next/head'
import * as React from 'react'

import { PageHead } from './PageHead'
import { ErrorPage } from '@/components'
import * as types from 'lib/types'

export const NotionError: React.FC<types.PageProps> = ({ site, pageId, error }) => {
  const title = site ? site?.name : pageId

  return (
    <>
      <PageHead site={site} />

      <Head>
        <meta property="og:site_name" content={title} />
        <meta property="og:title" content={title} />
        <title>{title}</title>
      </Head>

      <ErrorPage statusCode={error.statusCode} title={title} subtitle={error.message} />
    </>
  )
}
