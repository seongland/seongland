import texonom from '@/public/icon/texonom.png'
import legacy from '@/public/image/legacy.png'
import pointland from '@/public/image/pointland.jpg'

import rtsum from '@/public/image/rtsum.png'
import resrer from '@/public/image/resrer.png'

import intuiter from '@/public/icon/intuiter.png'
import spotify from '@/public/icon/2spotify.png'
import screencast from '@/public/image/screencast.gif'
import angryface from '@/public/image/angryface.png'
import mbtigpt from '@/public/image/mbtigpt.png'

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
    ais,
    webapps,
  }
}

const ais: Card[] = [
  {
    title: 'ReSRer',
    subtitle: 'Retriever-Summarizer-Reader pipeline for LLM ODQA(Open-Domain Question Answering)',
    url: 'https://github.com/seonglae/ReSRer',
    theme: '#0e1118',
    color: 'white',
    ratio: '125%',
    image: resrer,
  },
  {
    title: 'RTSum',
    subtitle: 'Relation Triple-based Interpretable Summarization with Multi-level Salience Visualization',
    url: 'https://arxiv.org/html/2310.13895v2',
    theme: '#fff',
    color: '#000',
    ratio: '110%',
    image: rtsum,
  },
  {
    title: 'LLaMa2GPTQ',
    subtitle: 'Angryface chatbot with a knowledge base on the Texonom AI knowledge system',
    url: 'https://llama2gptq.nuxt.space',
    theme: '#20232c',
    color: '#000',
    ratio: '100%',
    image: angryface,
  },
]

const webapps: Card[] = [
  {
    title: 'Texonom',
    subtitle: 'Zettelkasten-style knowledge system with Recommender System and Search',
    url: 'https://texonom.com',
    theme: '#202229',
    color: 'white',
    ratio: '75%',
    image: texonom,
  },
  {
    title: '',
    subtitle: '',
    url: 'https://mbti.texonom.com',
    theme: '#1e1e1e',
    color: 'white',
    ratio: '800%',
    image: mbtigpt,
  },
]

const applications: Card[] = [
  {
    title: 'Intuiter',
    subtitle: 'A globally applicable Vim-like productivity app for Windows',
    url: 'https://intuiter.vercel.app',
    theme: '#ddd',
    color: 'black',
    ratio: '100%',
    image: intuiter,
  },
  {
    title: 'Pointland',
    subtitle: 'Navigable 3D space walker with smooth interaction and pointclouds',
    url: 'https://point.seongland.com',
    theme: 'black',
    color: 'white',
    ratio: '500%',
    image: pointland,
  },
  {
    title: 'Screencast',
    subtitle: 'On-screen Key press display app for PPT presentation',
    url: 'https://github.com/seonglae/screencast',
    theme: '#2f3437',
    color: 'white',
    ratio: '400%',
    image: screencast,
  },
  {
    title: 'Legacyland',
    subtitle: 'Interactive earth: the first version of Seongland',
    url: 'https://legacy.seongland.com',
    theme: '#1e1e1e',
    color: 'white',
    ratio: '200%',
    image: legacy,
  },
  {
    title: 'To Spotify',
    subtitle: 'Library for Migrating from Korean Streaming Platforms to Spotify',
    url: 'https://2spotify.vercel.app',
    theme: '#111111',
    color: 'white',
    ratio: '100%',
    image: spotify,
  },
]
