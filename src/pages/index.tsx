import React from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'

import { dynamicImgCards } from '~/scripts/cards'
import { TypeTitle } from '@/components/atoms/TypeTitle'
import { GridTitle } from '@/components/atoms/GridTitle'
import { Cards } from '@/components/organisms/Cards'
import { Footer } from '@/components/molecules/Footer'
import { Header } from '@/components/molecules/Header'
import { description, url, title, domain, twitter } from '~/site-config'

import type { Card } from '~/scripts/cards'

export const CenterPage = dynamic(async () => import('@/components/atoms/CenterPage'))
export const ScrollPage = dynamic(async () => import('@/components/templates/ScrollPage'))

const HEIGHT = 6
const PAGES = 4

const Index: React.FC<{ applications: Card[]; ais: Card[]; webapps: Card[] }> = ({ applications, ais, webapps }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta name="twitter:title" content={title} />
        <meta property="og:site_name" content={title} />

        <meta property="og:image" content="/ogtag.png" />
        <meta name="twitter:image" content="/ogtag.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content={twitter} />

        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta name="twitter:description" content={description} />

        <link rel="canonical" href={url} />
        <meta property="og:url" content={url} />
        <meta property="twitter:url" content={url} />
        <meta property="twitter:domain" content={domain} />
      </Head>

      <ScrollPage height={HEIGHT}>
        <CenterPage page={1} pages={PAGES}>
          <TypeTitle />
        </CenterPage>
        <CenterPage page={2} pages={PAGES}>
          <GridTitle title="AI Research" />
          <Cards cards={ais} />
        </CenterPage>
        <CenterPage page={3} pages={PAGES}>
          <GridTitle title="Projects" />
          <Cards cards={applications} />
        </CenterPage>
        <CenterPage page={3.95} pages={PAGES}>
          <GridTitle title="AI Services" />
          <Cards cards={webapps} />
        </CenterPage>
      </ScrollPage>
      <div className="fixed top-0 <sm:left-20vw" w="full <sm:80vw">
        <Header />
      </div>
      <div className="fixed bottom-0 <sm:left-20vw" w="full <sm:60vw">
        <Footer />
      </div>
    </>
  )
}

export async function getStaticProps() {
  return {
    props: await dynamicImgCards(),
  }
}

export default Index
