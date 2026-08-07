import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { spaceArticleIds, trackedArticleIds } from '../src/data/articles.ts'

describe('build config', () => {
  it('package.json has required fields', () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf-8'))
    expect(pkg.name).toBe('seongland')
    expect(pkg.scripts.build).toBeDefined()
    expect(pkg.scripts.dev).toBeDefined()
  })

  it('every tracked article is built by the article script', () => {
    const script = readFileSync('scripts/build-articles.sh', 'utf-8')
    expect(script).toContain('node scripts/inject-article-chrome.ts "$dir/app/dist/index.html" "$name"')
    expect(script).toContain('asg/browser --no-chrome --no-base')
    expect(trackedArticleIds).toEqual([...spaceArticleIds, 'asg/browser'])
  })
})

// public/article/ is gitignored build output, so only assert on it when a build
// has actually run here.
describe.skipIf(!existsSync('public/article'))('built articles', () => {
  it.each(spaceArticleIds)('%s carries chrome and telemetry', id => {
    const file = `public/article/${id}/index.html`
    if (!existsSync(file)) return
    const html = readFileSync(file, 'utf-8')
    expect(html).toContain('<base href="/article/')
    expect(html).toContain('googletagmanager.com/gtag/js')
    expect(html).toContain('/_vercel/insights/script.js')
    expect(html).toContain('src="/telemetry.js"')
    expect(html).toContain('class="sl-chrome"')
    expect(html).toContain('class="sl-footer"')
    expect(html).not.toContain('localhost:4321')
  })
})
