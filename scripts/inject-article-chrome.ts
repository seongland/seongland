// Rewrites a built article's index.html for hosting under seongland.com:
// base href, canonical fix, analytics, telemetry, and the shared chrome.
//
// Usage: node scripts/inject-article-chrome.ts <file> <articlePath> [--no-chrome]

import { readFileSync, writeFileSync } from 'node:fs'
import { argv, env, exit } from 'node:process'
import { pathToFileURL } from 'node:url'
import { renderFooter, renderHeader } from './article-chrome.ts'

export interface InjectOptions {
  /** Path under /article, e.g. "corrsteer" or "asg/browser". */
  articlePath: string
  siteUrl?: string
  gaId?: string
  /** asg-browser is a full-viewport app, so it takes telemetry without chrome. */
  chrome?: boolean
  /** Vite-built apps already emit absolute asset paths and need no base href. */
  base?: boolean
  year?: number
  /** The dev origin the article template bakes into canonical and og:url. */
  devOrigin?: string
}

const TELEMETRY_SRC = '/telemetry.js'
const CHROME_MARKER = 'data-sl-chrome'

export function injectArticleChrome(html: string, options: InjectOptions): string {
  const {
    articlePath,
    siteUrl = 'https://seongland.com',
    gaId,
    chrome = true,
    base = true,
    year = new Date().getFullYear(),
    devOrigin = 'http://localhost:4321',
  } = options

  if (html.includes(TELEMETRY_SRC)) return html

  // The article template bakes its dev origin into canonical, og:url and JSON-LD.
  let out = html.split(devOrigin).join(siteUrl)

  const head: string[] = []
  if (base && !out.includes('<base ')) head.push(`<base href="/article/${articlePath}/">`)
  if (chrome) head.push('<link rel="stylesheet" href="/article-chrome.css">')
  if (gaId) {
    head.push(
      `<script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>`,
      `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}` +
        `gtag('js',new Date());gtag('config','${gaId}');</script>`,
    )
  }
  head.push('<script defer src="/_vercel/insights/script.js"></script>')
  head.push(`<script type="module" src="${TELEMETRY_SRC}"></script>`)
  if (chrome) head.push('<script type="module" src="/article-chrome.js"></script>')

  // Insert after the charset meta when there is one, so it stays first in <head>.
  const charset = /<meta[^>]+charset[^>]*>/i.exec(out)
  const headOpen = /<head[^>]*>/i.exec(out)
  if (!headOpen) throw new Error(`no <head> in article "${articlePath}"`)
  const at = charset ? charset.index + charset[0].length : headOpen.index + headOpen[0].length
  out = out.slice(0, at) + head.join('') + out.slice(at)

  if (!chrome || out.includes(CHROME_MARKER)) return out

  const bodyOpen = /<body[^>]*>/.exec(out)
  if (!bodyOpen) throw new Error(`no <body> in article "${articlePath}"`)
  const afterBody = bodyOpen.index + bodyOpen[0].length
  out = out.slice(0, afterBody) + renderHeader(`/article/${articlePath}`) + out.slice(afterBody)

  const bodyClose = out.lastIndexOf('</body>')
  if (bodyClose === -1) throw new Error(`no </body> in article "${articlePath}"`)
  return out.slice(0, bodyClose) + renderFooter(year) + out.slice(bodyClose)
}

function main(args: string[]): void {
  const [file, articlePath] = args.filter(arg => !arg.startsWith('--'))
  if (!file || !articlePath) {
    console.error('usage: node scripts/inject-article-chrome.ts <file> <articlePath> [--no-chrome] [--no-base]')
    exit(1)
  }
  const injected = injectArticleChrome(readFileSync(file, 'utf-8'), {
    articlePath,
    chrome: !args.includes('--no-chrome'),
    base: !args.includes('--no-base'),
    siteUrl: env.SITE_URL,
    gaId: env.PUBLIC_GA_ID ?? 'G-CRRP8E78TC',
  })
  writeFileSync(file, injected)
}

if (argv[1] && import.meta.url === pathToFileURL(argv[1]).href) main(argv.slice(2))
