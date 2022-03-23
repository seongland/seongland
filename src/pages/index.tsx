import React from 'react'
import type { NextPage } from 'next'

import { ScrollPage } from '@/components/templates/ScrollPage'
import { TypeTitle } from '@/components/atoms/TypeTitle'
import { PageTitle } from '@/components/atoms/PageTitle'
import { CenterPage } from '@/components/atoms/CenterPage'
import { Applications } from '@/components/organisms/Applications'
import { Others } from '@/components/organisms/Others'
import { WebApps } from '@/components/organisms/WebApps'

const HEIGHT = 7
const PAGES = 4

const Index: NextPage = () => {
  return (
    <ScrollPage height={HEIGHT}>
      <CenterPage page={1} pages={PAGES}>
        <TypeTitle />
      </CenterPage>
      <CenterPage page={2} pages={PAGES}>
        <PageTitle title="Web Apps" />
        <WebApps />
      </CenterPage>
      <CenterPage page={3} pages={PAGES}>
        <PageTitle title="Other Results" />
        <Others />
      </CenterPage>
      <CenterPage page={4} pages={PAGES}>
        <PageTitle title="Applications" />
        <Applications />
      </CenterPage>
    </ScrollPage>
  )
}

export default Index
