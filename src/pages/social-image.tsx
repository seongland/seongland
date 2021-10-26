import * as React from 'react'
import Markdown from 'react-markdown'
import { NextSeo } from 'next-seo'

import { baseRenderer } from '@/utils/renderers'
import siteConfig from '~/site-config'

import type { NextPage } from '@/types/next'
import type { GetServerSideProps } from 'next'
import type { SocialImageParams } from '@/types'

const SocialImagePage: NextPage<SocialImageParams> = ({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}) => {
  return (
    <>
      <NextSeo title={title} description={description} titleTemplate="%s" />
      <div>
        <div>
          <div>
            <Markdown renderers={baseRenderer} source={description} />
          </div>

          <div>
            <a href={path}>{path}</a>
          </div>
        </div>
      </div>
    </>
  )
}

SocialImagePage.disableLayout = true

export const getServerSideProps: GetServerSideProps<SocialImageParams> = async ({ query }) => ({
  props: {
    title: (query.title as string) || siteConfig.title,
    description: (query.description as string) || siteConfig.descriptionMd,
    path: `${siteConfig.url}${query.path ?? ''}`,
  },
})

export default SocialImagePage
