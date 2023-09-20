import texonom from '@/public/icon/texonom.png'
import legacy from '@/public/image/legacy.png'
import pointland from '@/public/image/pointland.jpg'

import npm from '@/public/icon/npm.png'
import vscode from '@/public/icon/vscode.png'
import github from '@/public/icon/github.png'

import intuiter from '@/public/icon/intuiter.png'
import spotify from '@/public/icon/2spotify.png'
import screencast from '@/public/image/screencast.gif'

export interface Activity {
  title: string
  subtitle: string
  url: string
  theme: string
  color: string
  ratio: string
  type?: 'education' | 'experience' | 'project' | 'skill' | 'incident'
  start?: Date
  end?: Date
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
  return timeline
}

const timeline: Activity[] = [
  {
    title: 'Texonom',
    subtitle: 'Knowledge system based on Taxonomy architecture',
    url: 'https://texonom.com',
    theme: '#202229',
    start: new Date(2021),
    color: 'white',
    ratio: '75%',
    image: texonom,
  },
  {
    title: 'Angryface',
    subtitle: 'AI summarization combining explicit and implicit summization using knowledge graph concept',
    url: 'https://angryface.nuxt.space',
    theme: '#1e1e1e',
    color: 'white',
    ratio: '200%',
    image: legacy,
  },
  {
    title: 'SJYYJS',
    subtitle: 'AI summarization combining explicit and implicit summization using knowledge graph concept',
    url: 'https://angryface.nuxt.space',
    theme: '#1e1e1e',
    color: 'white',
    ratio: '200%',
    image: legacy,
  },
  {
    title: 'Huggingface',
    subtitle: 'AI ',
    url: 'https://huggingface.co/seonglae',
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
  {
    title: 'NPM',
    subtitle: 'Module Develop Experience',
    url: 'https://www.npmjs.com/~seonglae',
    theme: '#222',
    color: '#fff',
    ratio: '100%',
    image: npm,
  },
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
  {
    title: 'Pointland',
    subtitle: 'Web 3D Pointcloud walker',
    url: 'https://point.seongland.com',
    theme: 'black',
    color: 'white',
    ratio: '500%',
    image: pointland,
  },
  {
    title: 'To smooth',
    subtitle: "Chaikin's smooth Algorithm multi dimension library",
    url: 'https://point.seongland.com',
    theme: 'black',
    color: 'white',
    ratio: '500%',
    image: pointland,
  },
  {
    title: 'Github Setter',
    subtitle: "Chaikin's smooth Algorithm multi dimension library",
    url: 'https://point.seongland.com',
    theme: 'black',
    color: 'white',
    ratio: '500%',
    image: pointland,
  },
  {
    title: 'Singularity',
    subtitle: "Read a book 'The Singularity Is Near' written by Ray Kurzweil",
    url: 'https://point.seongland.com',
    theme: 'black',
    type: 'incident',
    color: 'white',
    ratio: '500%',
    image: pointland,
  },
]
