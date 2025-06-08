import React from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { dynamicImgCards } from '~/scripts/cards'
import type { Card } from '~/scripts/cards'

const HomeScene = dynamic(() => import('@/components/organisms/HomeScene'), {
  ssr: false,
})

const Home: React.FC<{ cards: Card[] }> = ({ cards }) => {
  return (
    <>
      <Head>
        <title>Seongland 3D</title>
      </Head>
      <HomeScene cards={cards} />
    </>
  )
}

export async function getStaticProps() {
  const data = await dynamicImgCards()
  const cards = [...data.applications, ...data.ais, ...data.webapps]
  return { props: { cards } }
}

export default Home
