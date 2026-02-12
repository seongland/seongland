import texonom from '@/public/icon/texonom.png'
import legacy from '@/public/image/legacy.png'
import pointland from '@/public/image/pointland.jpg'

import rtsum from '@/public/image/rtsum.png'
import resrer from '@/public/image/resrer.png'
import saedataset from '@/public/image/saedataset.png'
import faithful from '@/public/image/faithful.png'
import libvuln from '@/public/image/libvuln.png'
import crl from '@/public/image/crl.png'
import manifold from '@/public/image/manifold.png'
import corrsteer from '@/public/image/corrsteer.png'

import intuiter from '@/public/icon/intuiter.png'
import spotify from '@/public/icon/2spotify.png'
import screencast from '@/public/image/screencast.gif'
import angryface from '@/public/image/angryface.png'
import mbtigpt from '@/public/image/mbtigpt.png'
import emgsd from '@/public/image/emgsd.png'
import smooth from '@/public/image/smooth.png'

export interface Card {
  title: string
  subtitle: string
  url: string
  theme: string
  color: string
  ratio: string
  alt?: string
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
    title: 'CRL',
    subtitle: 'ICLR 2026',
    url: 'https://arxiv.org/abs/2602.10437',
    theme: '#fff',
    color: 'black',
    ratio: '200%',
    image: crl,
  },
  {
    title: 'Confidence Manifold',
    subtitle: 'ICLR 2026',
    url: 'https://arxiv.org/abs/2602.08159',
    theme: '#fff',
    color: 'black',
    ratio: '150%',
    image: manifold,
  },
  {
    title: 'CorrSteer',
    subtitle: 'EMNLP 2025',
    url: 'https://arxiv.org/abs/2508.12535',
    theme: '#fff',
    color: 'black',
    ratio: '200%',
    image: corrsteer,
  },
  {
    title: 'FaithfulSAE',
    subtitle: 'ACL 2025 SRW',
    url: 'https://huggingface.co/papers/2506.17673',
    theme: '#fff',
    color: 'black',
    ratio: '200%',
    image: faithful,
  },
  {
    title: 'LibVulnWatch',
    subtitle: 'ICML 2025 TAIG',
    url: 'https://arxiv.org/abs/2505.08842',
    theme: '#fff',
    color: '#000',
    ratio: '150%',
    image: libvuln,
  },
  {
    title: 'SAE Dataset',
    subtitle: 'LessWrong & AI Alignment Forum',
    url: 'https://www.lesswrong.com/posts/ATsvzF77ZsfWzyTak/dataset-sensitivity-in-feature-matching-and-a-hypothesis-on-1',
    theme: '#fff',
    color: 'black',
    ratio: '150%',
    image: saedataset,
  },
  {
    title: 'RTSum',
    subtitle: 'NAACL 2024 Demo',
    url: 'https://aclanthology.org/2024.naacl-demo.5/',
    theme: '#fff',
    color: '#000',
    ratio: '150%',
    image: rtsum,
  },
  {
    title: 'Hermes',
    subtitle: 'Steering Vector from SAE',
    url: 'https://github.com/seonglae/emgsd-hermes',
    theme: '#21242b',
    color: 'white',
    ratio: '300%',
    image: emgsd,
  },
  {
    title: 'ReSRer',
    subtitle: 'LLM QA pipeline',
    url: 'https://github.com/seonglae/ReSRer',
    theme: '#0e1118',
    color: 'white',
    ratio: '200%',
    image: resrer,
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
    alt: 'MBTI GPT',
    url: 'https://mbti.texonom.com',
    theme: '#18171c',
    color: 'white',
    ratio: '400%',
    image: mbtigpt,
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
  {
    title: 'To Smooth',
    subtitle: "Chaikin's smoothing algorithm extended to a multidimensional library",
    url: 'https://github.com/seonglae/to-smooth',
    theme: '#c3d7de',
    color: 'black',
    ratio: '150%',
    image: smooth,
  },
]
