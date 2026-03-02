export interface CardData {
  title: string
  subtitle: string
  url: string
  image: string
  year?: number
  category?: 'App' | 'Demo' | 'Library'
  tags?: string[]
  description?: string
  links?: { label: string; url: string }[]
  imageClass?: string
}

export const publications: CardData[] = [
  {
    title: 'ControlRL: Concept Bottleneck Sparse Autoencoders for Scalable Concept Representation Learning',
    subtitle: 'ICLR 2026 Trustworthy AI',
    url: 'https://arxiv.org/abs/2602.10437',
    image: '/image/crl.png',
    tags: ['Mechanistic Interpretability', 'Sparse Autoencoders', 'Steering Vectors', 'LLM Safety'],
    links: [{ label: 'Article', url: '/article/crl' }],
  },
  {
    title: 'Confidence Manifold: Revealing LLM Internal States via Topological Inconsistency Analysis',
    subtitle: 'ICLR 2026 Reliable Autonomy',
    url: 'https://arxiv.org/abs/2602.08159',
    image: '/image/manifold.png',
    tags: ['LLM Safety', 'Mechanistic Interpretability'],
    links: [{ label: 'Article', url: '/article/confidence-manifold' }],
  },
  {
    title: 'CorrSteer: Steering LLMs via Correlation-based Corrections',
    subtitle: 'ICLR 2026 RE-Align',
    url: 'https://arxiv.org/abs/2508.12535',
    image: '/image/corrsteer.png',
    tags: ['Steering Vectors', 'Mechanistic Interpretability', 'LLM Safety'],
    links: [{ label: 'Article', url: '/article/corrsteer' }],
  },
  {
    title: 'FaithfulSAE: Evaluating Faithfulness of Sparse Autoencoders in Large Language Models',
    subtitle: 'ACL 2025 SRW',
    url: 'https://aclanthology.org/2025.acl-srw.20/',
    image: '/image/faithful.png',
    tags: ['Sparse Autoencoders', 'Mechanistic Interpretability'],
  },
  {
    title: 'LibVulnWatch: Automated Vulnerability Monitoring Using LLMs for Open-Source Libraries',
    subtitle: 'ICML 2025 TAIG',
    url: 'https://arxiv.org/abs/2505.08842',
    image: '/image/libvuln.png',
    tags: ['LLM Safety'],
  },
  {
    title: 'RTSum: Relation Triple-based Interpretable Summarization with Multi-level Salience Visualization',
    subtitle: 'NAACL 2024 Demo',
    url: 'https://aclanthology.org/2024.naacl-demo.5/',
    image: '/image/rtsum.png',
    tags: ['Summarization'],
  },
]

export const projects: CardData[] = [
  // Apps
  {
    title: 'Conference Arena',
    subtitle: 'Rating leaderboard by making papers fight each other',
    url: 'https://confarena.com',
    image: '/icon/conference-arena.svg',
    year: 2026,
    category: 'App',
    tags: ['AI'],
  },
  {
    title: 'MBTI GPT',
    subtitle: 'In-memory RAG Conversation-based MBTI Analyser · Yonsei GenAI Competition Grand Prize',
    url: 'https://mbti.texonom.com',
    image: '/image/mbtigpt.png',
    year: 2025,
    category: 'App',
    tags: ['LLM'],
  },
  {
    title: 'LLaMa2GPTQ',
    subtitle: 'Angryface chatbot with knowledge base on Texonom AI',
    url: 'https://llama2gptq.nuxt.space',
    image: '/image/angryface.png',
    year: 2023,
    category: 'App',
    tags: ['LLM'],
  },
  {
    title: 'Pointland',
    subtitle: 'Navigable 3D space walker with smooth interaction and pointclouds · Refactored 2025 Tokyo',
    url: 'https://point.seongland.com',
    image: '/image/pointland.jpg',
    year: 2022,
    category: 'App',
    tags: ['3D'],
  },
  {
    title: 'Screencast',
    subtitle: 'On-screen Key press display app for PPT presentation',
    url: 'https://github.com/seonglae/screencast',
    image: '/image/screencast.gif',
    year: 2021,
    category: 'App',
    tags: ['Utility'],
  },
  {
    title: 'Texonom',
    subtitle: 'Zettelkasten-style knowledge system with Recommender System and Search',
    url: 'https://texonom.com',
    image: '/icon/texonom.png',
    year: 2020,
    category: 'App',
    tags: ['Web'],
  },
  {
    title: 'Intuiter',
    subtitle: 'A globally applicable Vim-like productivity app for Windows',
    url: 'https://intuiter.vercel.app',
    image: '/icon/intuiter.png',
    year: 2019,
    category: 'App',
    tags: ['Utility'],
    imageClass: 'object-contain p-1.5',
  },
  {
    title: 'Legacyland',
    subtitle: 'Interactive earth: the first version of Seongland',
    url: 'https://legacy.seongland.com',
    image: '/image/legacy.png',
    year: 2019,
    category: 'App',
    tags: ['3D'],
    imageClass: 'object-cover scale-125',
  },
  // Demos
  {
    title: 'Hermes',
    subtitle: 'Bias Amplification and Mitigation Using Correlated SAE Features · Holistic AI Hackathon 2024 Grand Prize',
    url: 'https://github.com/seonglae/emgsd-hermes',
    image: '/image/emgsd.png',
    year: 2024,
    category: 'Demo',
    tags: ['AI'],
  },
  {
    title: 'ReSRer',
    subtitle: 'Summarization-driven LLM Question Answering Optimization',
    url: 'https://github.com/seonglae/ReSRer',
    image: '/image/resrer.png',
    year: 2024,
    category: 'Demo',
    tags: ['LLM'],
  },
  // Libraries
  {
    title: 'To Smooth',
    subtitle: "Chaikin's smoothing algorithm extended to a multidimensional library",
    url: 'https://github.com/seonglae/to-smooth',
    image: '/image/smooth.png',
    year: 2023,
    category: 'Library',
    tags: ['Algorithm'],
  },
  {
    title: 'To Spotify',
    subtitle: 'Library for Migrating from Korean Streaming Platforms to Spotify',
    url: 'https://2spotify.vercel.app',
    image: '/icon/2spotify.png',
    year: 2021,
    category: 'Library',
    tags: ['Web'],
  },
]
