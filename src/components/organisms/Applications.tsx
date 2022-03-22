import React from 'react'
import CardGrid from '@/components/molecules/CardGrid'

const cards = [
  {
    title: 'Intuiter',
    subtitle: 'productivity app for Windows',
    url: 'https://threetrees.cloud',
    icon: 'icon/intuiter.png',
    background: '#ddd',
    color: 'black',
    ratio: '50%',
  },
  {
    title: 'To Spotify',
    subtitle: 'web 3d explorer',
    url: 'https://2spotify.vercel.app',
    icon: 'icon/2spotify.svg',
    background: 'black',
    color: 'white',
    ratio: '50%',
  },
  {
    title: 'Screencast',
    subtitle: 'status of my web services',
    url: 'https://status.seongland.com',
    icon: 'image/screencast.gif',
    background: '#2f3437',
    color: 'white',
    ratio: '300%',
  },
]

export const Applications: React.FC = () => {
  return <CardGrid cards={cards} />
}
