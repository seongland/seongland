import React from 'react'

import dynamic from 'next/dynamic'

import { dynamicImgCards } from '~/scripts/cards'
import { TypeTitle } from '@/components/atoms/TypeTitle'
import { PageTitle } from '@/components/atoms/PageTitle'
import { Cards } from '@/components/organisms/Cards'

import type { Card } from '~/scripts/cards'

export const CenterPage = dynamic(async () => import('@/components/atoms/CenterPage'))
export const ScrollPage = dynamic(async () => import('@/components/templates/ScrollPage'))

const HEIGHT = 7
const PAGES = 4

const Index: React.FC<{ applications: Card[]; publications: Card[]; webapps: Card[] }> = ({
  applications,
  publications,
  webapps,
}) => {
  return (
    <ScrollPage height={HEIGHT}>
      <CenterPage page={1} pages={PAGES}>
        <TypeTitle />
      </CenterPage>
      <CenterPage page={2} pages={PAGES}>
        <PageTitle title="Web Pages" />
        <Cards cards={webapps} />
      </CenterPage>
      <CenterPage page={3} pages={PAGES}>
        <PageTitle title="Publication" />
        <Cards cards={publications} />
      </CenterPage>
      <CenterPage page={4} pages={PAGES}>
        <PageTitle title="Applications" />
        <Cards cards={applications} />
      </CenterPage>
    </ScrollPage>
  )
}

export async function getStaticProps() {
  return {
    props: await dynamicImgCards(),
  }
}

export default Index
