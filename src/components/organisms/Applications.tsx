import React from 'react'
import dynamic from 'next/dynamic'

export const CardGrid = dynamic(async () => import('@/components/molecules/CardGrid'))

const cards = [
  {
    title: 'Intuiter',
    subtitle: 'productivity app for Windows',
    url: 'https://intuiter.vercel.app',
    background: '/icon/intuiter.png',
    theme: '#ddd',
    color: 'black',
    ratio: '50%',
  },
  {
    title: 'To Spotify',
    subtitle: 'web 3d explorer',
    url: 'https://2spotify.vercel.app',
    background: '/icon/2spotify.svg',
    theme: '#111111',
    color: 'white',
    ratio: '50%',
  },
  {
    title: 'Screencast',
    subtitle: 'status of my web services',
    url: 'https://github.com/seonglae/screencast',
    background: '/image/screencast.gif',
    theme: '#2f3437',
    color: 'white',
    ratio: '100%',
  },
]

export const Applications: React.FC = () => {
  return <CardGrid cards={cards} />
}
