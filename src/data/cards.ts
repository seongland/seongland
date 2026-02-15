export interface CardData {
  title: string
  subtitle: string
  url: string
  image: string
  tags?: string[]
  description?: string
  links?: { label: string; url: string }[]
}

export const publications: CardData[] = [
  {
    title: 'CRL',
    subtitle: 'arXiv 2026',
    url: 'https://arxiv.org/abs/2602.10437',
    image: '/image/crl.png',
    tags: ['Interpretability', 'SAE'],
  },
  {
    title: 'Confidence Manifold',
    subtitle: 'arXiv 2026',
    url: 'https://arxiv.org/abs/2602.08159',
    image: '/image/manifold.png',
    tags: ['LLM Safety', 'Confidence'],
  },
  {
    title: 'CorrSteer',
    subtitle: 'arXiv 2025',
    url: 'https://arxiv.org/abs/2508.12535',
    image: '/image/corrsteer.png',
    tags: ['Steering', 'Interpretability'],
  },
  {
    title: 'FaithfulSAE',
    subtitle: 'ACL 2025 SRW',
    url: 'https://huggingface.co/papers/2506.17673',
    image: '/image/faithful.png',
    tags: ['SAE', 'Faithfulness'],
  },
  {
    title: 'LibVulnWatch',
    subtitle: 'ICML 2025 TAIG',
    url: 'https://arxiv.org/abs/2505.08842',
    image: '/image/libvuln.png',
    tags: ['Security', 'LLM'],
  },
  {
    title: 'SAE Dataset',
    subtitle: 'LessWrong & AI Alignment Forum',
    url: 'https://www.lesswrong.com/posts/ATsvzF77ZsfWzyTak/dataset-sensitivity-in-feature-matching-and-a-hypothesis-on-1',
    image: '/image/saedataset.png',
    tags: ['SAE', 'Dataset'],
  },
  {
    title: 'RTSum',
    subtitle: 'NAACL 2024 Demo',
    url: 'https://aclanthology.org/2024.naacl-demo.5/',
    image: '/image/rtsum.png',
    tags: ['Summarization', 'Demo'],
  },
  {
    title: 'Hermes',
    subtitle: 'Steering Vector from SAE',
    url: 'https://github.com/seonglae/emgsd-hermes',
    image: '/image/emgsd.png',
    tags: ['Steering', 'SAE'],
  },
  {
    title: 'ReSRer',
    subtitle: 'Summarization-driven LLM Optimization',
    url: 'https://github.com/seonglae/ReSRer',
    image: '/image/resrer.png',
    tags: ['Summarization', 'Optimization'],
  },
]

export const projects: CardData[] = [
  {
    title: 'Texonom',
    subtitle: 'Zettelkasten-style knowledge system with Recommender System and Search',
    url: 'https://texonom.com',
    image: '/icon/texonom.png',
    tags: ['Knowledge', 'Web'],
  },
  {
    title: 'MBTI GPT',
    subtitle: 'MBTI personality chatbot',
    url: 'https://mbti.texonom.com',
    image: '/image/mbtigpt.png',
    tags: ['LLM', 'Chat'],
  },
  {
    title: 'LLaMa2GPTQ',
    subtitle: 'Angryface chatbot with knowledge base on Texonom AI',
    url: 'https://llama2gptq.nuxt.space',
    image: '/image/angryface.png',
    tags: ['LLM', 'Chat'],
  },
]

export const apps: CardData[] = [
  {
    title: 'Intuiter',
    subtitle: 'A globally applicable Vim-like productivity app for Windows',
    url: 'https://intuiter.vercel.app',
    image: '/icon/intuiter.png',
    tags: ['Productivity', 'Windows'],
  },
  {
    title: 'Pointland',
    subtitle: 'Navigable 3D space walker with smooth interaction and pointclouds',
    url: 'https://point.seongland.com',
    image: '/image/pointland.jpg',
    tags: ['3D', 'WebGL'],
  },
  {
    title: 'Screencast',
    subtitle: 'On-screen Key press display app for PPT presentation',
    url: 'https://github.com/seonglae/screencast',
    image: '/image/screencast.gif',
    tags: ['Utility', 'Presentation'],
  },
  {
    title: 'Legacyland',
    subtitle: 'Interactive earth: the first version of Seongland',
    url: 'https://legacy.seongland.com',
    image: '/image/legacy.png',
    tags: ['3D', 'Portfolio'],
  },
  {
    title: 'To Spotify',
    subtitle: 'Library for Migrating from Korean Streaming Platforms to Spotify',
    url: 'https://2spotify.vercel.app',
    image: '/icon/2spotify.png',
    tags: ['Music', 'Migration'],
  },
  {
    title: 'To Smooth',
    subtitle: "Chaikin's smoothing algorithm extended to a multidimensional library",
    url: 'https://github.com/seonglae/to-smooth',
    image: '/image/smooth.png',
    tags: ['Algorithm', 'Library'],
  },
]
