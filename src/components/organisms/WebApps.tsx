import React from 'react'
import CardGrid from '@/components/molecules/CardGrid'

const cards = [
  {
    title: '3 Trees',
    subtitle: 'knowledge archive with debates',
    url: 'https://threetrees.cloud',
    icon: 'icon/3trees.svg',
    background: '#2f3437',
    color: 'white',
    ratio: '50%',
  },
  {
    title: 'Pointland',
    subtitle: 'web 3d explorer',
    url: 'https://point.seongland.com',
    icon: 'image/pointland.jpg',
    background: 'black',
    color: 'white',
    ratio: '333%',
  },
  {
    title: 'Legacyland',
    subtitle: 'legacy  project of this app',
    url: 'https://legacy.seongland.com',
    icon: 'seongland.svg',
    background: '#2f3437',
    color: 'white',
    ratio: '175%',
  },
]

export const WebApps: React.FC = () => {
  return <CardGrid cards={cards} />
}
