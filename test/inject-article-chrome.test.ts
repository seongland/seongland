import { describe, expect, it } from 'vitest'
import { injectArticleChrome } from '../scripts/inject-article-chrome.ts'

const ARTICLE = `<!DOCTYPE html><html lang="en" data-theme="light"> <head><meta charset="utf-8"><title>CorrSteer</title><link rel="canonical" href="http://localhost:4321/article/corrsteer"><meta property="og:url" content="http://localhost:4321/article/corrsteer"></head> <body> <button id="theme-toggle"></button> <main>body</main> </body></html>`

describe('injectArticleChrome', () => {
  const injected = injectArticleChrome(ARTICLE, { articlePath: 'corrsteer', gaId: 'G-TEST', year: 2026 })

  it('adds the base href for the article subdirectory', () => {
    expect(injected).toContain('<base href="/article/corrsteer/">')
  })

  it('keeps the charset meta first in head', () => {
    expect(injected.indexOf('charset')).toBeLessThan(injected.indexOf('<base'))
  })

  it('rewrites the dev origin baked into canonical and og:url', () => {
    expect(injected).not.toContain('localhost:4321')
    expect(injected).toContain('<link rel="canonical" href="https://seongland.com/article/corrsteer">')
  })

  it('injects analytics and telemetry', () => {
    expect(injected).toContain('googletagmanager.com/gtag/js?id=G-TEST')
    expect(injected).toContain('/_vercel/insights/script.js')
    expect(injected).toContain('src="/telemetry.js"')
    expect(injected).toContain('src="/article-chrome.js"')
    expect(injected).toContain('href="/article-chrome.css"')
  })

  it('wraps the body in the shared header and footer', () => {
    expect(injected).toContain('<body><header class="sl-chrome"')
    expect(injected).toContain('aria-current="page"')
    expect(injected).toContain('&copy; 2026 Seonglae Cho')
    expect(injected.indexOf('sl-footer')).toBeGreaterThan(injected.indexOf('<main>'))
  })

  it('is idempotent', () => {
    expect(injectArticleChrome(injected, { articlePath: 'corrsteer', year: 2026 })).toBe(injected)
  })

  it('omits chrome and base for nested apps that manage their own layout', () => {
    const app = injectArticleChrome(ARTICLE, { articlePath: 'asg/browser', chrome: false, base: false })
    expect(app).toContain('src="/telemetry.js"')
    expect(app).not.toContain('sl-chrome')
    expect(app).not.toContain('<base')
  })

  it('does not add a second base href when the template already has one', () => {
    const withBase = ARTICLE.replace('<head>', '<head><base href="/article/corrsteer/">')
    const out = injectArticleChrome(withBase, { articlePath: 'corrsteer' })
    expect(out.match(/<base /g)).toHaveLength(1)
  })

  it('refuses HTML it cannot place chrome in', () => {
    expect(() => injectArticleChrome('<p>no head</p>', { articlePath: 'corrsteer' })).toThrow(/no <head>/)
  })
})
