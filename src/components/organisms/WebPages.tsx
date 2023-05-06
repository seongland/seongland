import React from 'react'
import dynamic from 'next/dynamic'

export const CardGrid = dynamic(async () => import('@/components/molecules/CardGrid'))

const cards = [
  {
    title: '3 Trees',
    subtitle: 'knowledge archive with debates',
    url: 'https://threetrees.cloud',
    background: '/icon/3trees.svg',
    theme: '#2f3437',
    color: 'white',
    ratio: '50%',
  },
  {
    title: 'Legacyland',
    subtitle: 'legacy  project of this app',
    url: 'https://legacy.seongland.com',
    background: '/image/legacy.png',
    theme: '#2f3437',
    color: 'white',
    ratio: '100%',
  },
  {
    title: 'Pointland',
    subtitle: 'web 3d explorer',
    url: 'https://point.seongland.com',
    background: '/image/pointland.jpg',
    theme: 'black',
    color: 'white',
    ratio: '100%',
  },
]

export const WebPages: React.FC = () => {
  return <CardGrid cards={cards} />
}
