import threetrees from '@/public/icon/3trees.png'
import legacy from '@/public/image/legacy.png'
import pointland from '@/public/image/pointland.jpg'

import npm from '@/public/icon/npm.png'
import vscode from '@/public/icon/vscode.png'
import github from '@/public/icon/github.png'

import intuiter from '@/public/icon/intuiter.png'
import spotify from '@/public/icon/2spotify.png'
import screencast from '@/public/image/screencast.gif'

export interface Card {
  title: string
  subtitle: string
  url: string
  theme: string
  color: string
  ratio: string
  image: {
    src?: string
    height?: number
    width?: number
    blurDataURL?: string
    blurWidth?: number
    blurHeight?: number
  }
}

export async function dynamicImgCards() {
  return {
    applications,
    publications,
    webapps,
  }
}

const webapps: Card[] = [
  {
    title: '3 Trees',
    subtitle: 'Knowledge Taxonomy storage',
    url: 'https://threetrees.cloud',
    theme: '#2f3437',
    color: 'white',
    ratio: '75%',
    image: threetrees,
  },
  {
    title: 'Legacyland',
    subtitle: 'Seongland version 1',
    url: 'https://legacy.seongland.com',
    theme: '#1e1e1e',
    color: 'white',
    ratio: '200%',
    image: legacy,
  },
  {
    title: 'Pointland',
    subtitle: 'Web 3D Pointcloud walker',
    url: 'https://point.seongland.com',
    theme: 'black',
    color: 'white',
    ratio: '500%',
    image: pointland,
  },
]

const publications: Card[] = [
  {
    title: 'NPM',
    subtitle: 'Module Develop Experience',
    url: 'https://www.npmjs.com/~seonglae',
    theme: '#222',
    color: 'fff',
    ratio: '100%',
    image: npm,
  },
  {
    title: 'VSCode',
    subtitle: 'Extension Develop Experience',
    url: 'https://marketplace.visualstudio.com/search?term=seonglae&target=VSCode',
    theme: '#232730',
    color: 'white',
    ratio: '100%',
    image: vscode,
  },
  {
    title: 'Gihub',
    subtitle: 'Template Repositories',
    url: 'https://github.com/seonglae?tab=repositories&q=&type=template',
    theme: '#777',
    color: '#fff',
    ratio: '100%',
    image: github,
  },
]

const applications: Card[] = [
  {
    title: 'Intuiter',
    subtitle: 'productivity app for Windows',
    url: 'https://intuiter.vercel.app',
    theme: '#ddd',
    color: 'black',
    ratio: '100%',
    image: intuiter,
  },
  {
    title: 'To Spotify',
    subtitle: 'Spotify migration tool',
    url: 'https://2spotify.vercel.app',
    theme: '#111111',
    color: 'white',
    ratio: '100%',
    image: spotify,
  },
  {
    title: 'Screencast',
    subtitle: 'Global screencast mode for Windows',
    url: 'https://github.com/seonglae/screencast',
    theme: '#2f3437',
    color: 'white',
    ratio: '400%',
    image: screencast,
  },
]
