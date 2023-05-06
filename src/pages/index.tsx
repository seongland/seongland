import React from 'react'
import type { NextPage } from 'next'

import dynamic from 'next/dynamic'

import { TypeTitle } from '@/components/atoms/TypeTitle'
import { PageTitle } from '@/components/atoms/PageTitle'
import { Applications } from '@/components/organisms/Applications'
import { Publication } from '@/components/organisms/Publication'
import { WebPages } from '@/components/organisms/WebPages'

export const CenterPage = dynamic(async () => import('@/components/atoms/CenterPage'))
export const ScrollPage = dynamic(async () => import('@/components/templates/ScrollPage'))

const HEIGHT = 7
const PAGES = 4

const Index: NextPage = () => {
  return (
    <ScrollPage height={HEIGHT}>
      <CenterPage page={1} pages={PAGES}>
        <TypeTitle />
      </CenterPage>
      <CenterPage page={2} pages={PAGES}>
        <PageTitle title="Web Pages" />
        <WebPages />
      </CenterPage>
      <CenterPage page={3} pages={PAGES}>
        <PageTitle title="Publication" />
        <Publication />
      </CenterPage>
      <CenterPage page={4} pages={PAGES}>
        <PageTitle title="Applications" />
        <Applications />
      </CenterPage>
    </ScrollPage>
  )
}

export default Index
