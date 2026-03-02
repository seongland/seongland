export const profile = {
  name: 'Seonglae Cho',
  title: 'Research Scientist',
  bio: 'Research scientist focused on LLM safety, interpretability, and steering. Building tools to understand and control language model behavior.',
  photo: '/image/yokhal.webp',
  links: {
    scholar: 'https://scholar.google.com/citations?user=XIMB1PoAAAAJ',
    github: 'https://github.com/seonglae',
    linkedin: 'https://www.linkedin.com/in/seonglae/',
    twitter: 'https://twitter.com/SeonglaeC',
    cv: '/cv.pdf',
    resume: '/resume.pdf',
  },
  interests: ['LLM Safety', 'Mechanistic Interpretability', 'Sparse Autoencoders', 'Steering Vectors', 'Summarization'],
  news: [
    {
      date: '2026.03',
      text: '{CRL} accepted at ICLR 2026 Trustworthy AI',
      links: { CRL: '/publications' },
    },
    {
      date: '2026.03',
      text: '{Confidence Manifold} accepted at ICLR 2026 Reliable Autonomy',
      links: { 'Confidence Manifold': '/publications' },
    },
    { date: '2025.08', text: '{CorrSteer} paper published on arXiv', links: { CorrSteer: '/publications' } },
    { date: '2025', text: '{FaithfulSAE} accepted at ACL 2025 SRW', links: { FaithfulSAE: '/publications' } },
    { date: '2025', text: '{LibVulnWatch} accepted at ICML 2025 TAIG', links: { LibVulnWatch: '/publications' } },
  ],
}
