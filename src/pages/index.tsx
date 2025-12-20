import React from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { dynamicImgCards } from '~/scripts/cards'

import type { Card } from '~/scripts/cards'

const SpaceScene = dynamic(() => import('@/components/organisms/SpaceScene'), {
  ssr: false,
})

const Home: React.FC<{ cards: Card[] }> = ({ cards }) => {
  return (
    <>
      <Head>
        <title>Seongland 3D</title>
      </Head>
      <SpaceScene cards={cards} />
    </>
  )
}

export async function getStaticProps() {
  const data = await dynamicImgCards()
  const cards = [...data.applications, ...data.ais, ...data.webapps]
  return { props: { cards } }
}

export default Home
