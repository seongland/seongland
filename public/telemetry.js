/**
 * Article tracker. Injected into every prebuilt article page at build time by
 * scripts/inject-article-chrome.ts, so it must stay dependency free and must
 * never throw into the page it is measuring.
 */
import {
  LIMITS,
  articleIdFromPath,
  createActiveTimer,
  createQueue,
  deviceClass,
  elementRole,
  isBotAgent,
  isOutbound,
  labelTarget,
  nextScrollMilestones,
  randomId,
  sanitizeText,
  scrollRatio,
  utmFromSearch,
} from '/telemetry-core.js'

const ENDPOINT = '/api/track'
const SESSION_KEY = 'sl.session'
const VISITOR_KEY = 'sl.visitor'
const OWNER_KEY = 'sl.owner'
const INTERACTIVE = 'button, input, select, textarea, summary, canvas, [role="button"], [data-sl-event]'

function readStore(store, key) {
  try {
    return window[store].getItem(key)
  } catch {
    return null
  }
}

function writeStore(store, key, value) {
  try {
    window[store].setItem(key, value)
  } catch {
    /* private mode: fall back to an in-memory id for this page only */
  }
}

function stableId(store, key) {
  const existing = readStore(store, key)
  if (existing) return existing
  const id = randomId()
  writeStore(store, key, id)
  return id
}

function shouldTrack(articleId) {
  if (!articleId) return false
  if (window.__slTelemetryDisabled) return false
  if (navigator.globalPrivacyControl === true) return false
  if (isBotAgent(navigator.userAgent, navigator.webdriver)) return false
  const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)
  return !isLocal || new URLSearchParams(location.search).get('sltrack') === '1'
}

function boot() {
  const articleId = articleIdFromPath(location.pathname)
  if (!shouldTrack(articleId)) return

  const sessionId = stableId('sessionStorage', SESSION_KEY)
  const visitorId = stableId('localStorage', VISITOR_KEY)
  const timer = createActiveTimer()
  const seenSections = new Set()
  let maxScroll = 0
  let deepestSection = null
  let ended = false

  // Set by /admin once the owner gate passes, so the dashboard can tell the
  // owner's own reading apart from real traffic.
  const owner = readStore('localStorage', OWNER_KEY) === '1'

  const send = batch => {
    const body = JSON.stringify({ articleId, sessionId, visitorId, owner, events: batch })
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }))) return
      fetch(ENDPOINT, { method: 'POST', body, keepalive: true, headers: { 'content-type': 'application/json' } }).catch(
        () => {},
      )
    } catch {
      /* a dropped batch is preferable to a broken article */
    }
  }

  const queue = createQueue({ onFlush: send })
  const track = (type, fields) => queue.push({ type, ts: Date.now(), ...fields })

  track('pageview', {
    meta: {
      referrer: sanitizeText(document.referrer, 200) ?? null,
      title: sanitizeText(document.title, 120) ?? null,
      language: sanitizeText(navigator.language, 12) ?? null,
      device: deviceClass(window.innerWidth),
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      utm: utmFromSearch(location.search),
    },
  })

  timer.start(Date.now())

  let scrollPending = false
  const onScroll = () => {
    if (scrollPending) return
    scrollPending = true
    requestAnimationFrame(() => {
      scrollPending = false
      const ratio = scrollRatio(window.scrollY, window.innerHeight, document.documentElement.scrollHeight)
      for (const milestone of nextScrollMilestones(maxScroll, ratio)) {
        maxScroll = milestone
        track('scroll', { value: milestone })
      }
    })
  }
  window.addEventListener('scroll', onScroll, { passive: true })

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const id = entry.target.id
          if (!id || seenSections.has(id)) continue
          seenSections.add(id)
          deepestSection = id
          track('section', { target: sanitizeText(id) })
        }
      },
      { threshold: 0.35 },
    )
    document.querySelectorAll('section[id], h2[id], h3[id]').forEach(el => observer.observe(el))
  }

  document.addEventListener(
    'click',
    event => {
      const anchor = event.target.closest?.('a[href]')
      if (anchor) {
        const href = anchor.getAttribute('href') ?? ''
        if (isOutbound(anchor.href, location.host)) {
          track('outbound', { target: labelTarget(anchor), value: sanitizeText(anchor.href, 200) })
        } else if (href.startsWith('#')) {
          track('click', { target: sanitizeText(href, 80), meta: { role: 'anchor' } })
        }
        return
      }
      const el = event.target.closest?.(INTERACTIVE)
      if (!el) return
      const custom = el.getAttribute('data-sl-event')
      track(custom || 'click', { target: labelTarget(el), meta: { role: elementRole(el) } })
    },
    { capture: true, passive: true },
  )

  document.addEventListener('copy', () => {
    const length = String(window.getSelection?.() ?? '').length
    if (length > 0) track('copy', { value: length })
  })

  const onVisibility = () => {
    const now = Date.now()
    if (document.visibilityState === 'hidden') {
      timer.stop(now)
      end()
    } else {
      timer.start(now)
    }
  }
  document.addEventListener('visibilitychange', onVisibility)

  function end() {
    if (ended) return
    ended = true
    track('exit', {
      value: Math.round(timer.total(Date.now())),
      meta: { maxScroll, deepestSection, sections: seenSections.size },
    })
    queue.flush()
  }

  window.addEventListener('pagehide', end)
  setInterval(() => queue.flush(), LIMITS.flushIntervalMs)
}

try {
  boot()
} catch {
  /* telemetry must never break the article */
}
