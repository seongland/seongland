import React from 'react'
import dynamic from 'next/dynamic'

export const CardGrid = dynamic(async () => import('@/components/molecules/CardGrid'))

const cards = [
  {
    title: 'NPM',
    subtitle: 'Module Develop Experience',
    url: 'https://www.npmjs.com/~seonglae',
    background: '/icon/npm.svg',
    theme: '#222',
    color: 'fff',
    ratio: '35%',
  },
  {
    title: 'VSCode',
    subtitle: 'Extension Develop Experience',
    url: 'https://marketplace.visualstudio.com/search?term=seonglae&target=VSCode',
    background: '/icon/vscode.png',
    theme: '#232730',
    color: 'white',
    ratio: '50%',
  },
  {
    title: 'Gihub',
    subtitle: 'Template Repositories',
    url: 'https://github.com/seonglae?tab=repositories&q=&type=template',
    background: '/icon/github.svg',
    theme: '#777',
    color: '#fff',
    ratio: '50%',
  },
]

export const Publication: React.FC = () => {
  return <CardGrid cards={cards} />
}
