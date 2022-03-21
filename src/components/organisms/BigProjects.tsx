import React from 'react'
import Deck from '@/components/molecules/Deck'

const cards = [
  {
    title: 'Status',
    subtitle: 'all of my subdomains',
    url: 'https://status.seongland.com',
    icon: '/upptime.svg',
    background: 'white',
    color: 'black',
    ratio: '200%',
  },
  {
    title: 'Live',
    subtitle: 'of seongland broadcast',
    url: 'https://live.seongland.com',
    icon: '/live.svg',
    background: 'black',
    color: 'white',
    ratio: '75%',
  },
  {
    title: 'Account',
    subtitle: 'of seongland services',
    url: 'https://account.seongland.com',
    icon: '/seongland.svg',
    background: '#242526',
    color: 'white',
    ratio: '50%',
  },
  {
    title: 'Pointland',
    subtitle: 'web 3d explorer',
    url: 'https://point.seongland.com',
    icon: '/pointland.svg',
    background: 'black',
    color: 'white',
    ratio: '150%',
  },
]

const BigProjects: React.FC = () => {
  return <Deck cards={cards} />
}

export default BigProjects
