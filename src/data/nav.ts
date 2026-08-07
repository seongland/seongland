// Shared by Nav.astro / Footer.astro and by the chrome injected into prebuilt
// article HTML, so site navigation and article navigation cannot drift apart.

export interface NavTab {
  label: string
  href: string
}

export interface FooterLink {
  label: string
  href: string
}

export const siteName = 'Seongland'

export const navTabs: NavTab[] = [
  { label: 'About', href: '/' },
  { label: 'Articles', href: '/article' },
  { label: 'Publications', href: '/publications' },
  { label: 'Projects', href: '/projects' },
]

export const footerLinks: FooterLink[] = [
  { label: 'GitHub', href: 'https://github.com/seonglae' },
  { label: 'Scholar', href: 'https://scholar.google.com/citations?user=XIMB1PoAAAAJ' },
  { label: 'CV', href: '/cv.pdf' },
  { label: 'Resume', href: '/resume.pdf' },
]

export function isActiveTab(href: string, pathname: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname.startsWith(href)
}
