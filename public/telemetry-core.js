/**
 * Pure helpers for the article tracker. Kept free of DOM globals and side
 * effects so they can be unit tested in node; telemetry.js does the wiring.
 */

export const LIMITS = {
  maxBatch: 40,
  maxTargetLength: 64,
  flushIntervalMs: 15000,
  maxAncestorWalk: 4,
}

export const SCROLL_MILESTONES = [25, 50, 75, 100]

const BOT_PATTERN =
  /bot|crawler|spider|crawling|slurp|bingpreview|headlesschrome|phantomjs|lighthouse|pingdom|gtmetrix|facebookexternalhit|embedly|preview/i

export function randomId(random = Math.random) {
  let out = ''
  for (let i = 0; i < 4; i++) out += Math.floor(random() * 0x100000000).toString(36)
  return out.slice(0, 22)
}

/**
 * "/article/corrsteer/" -> "corrsteer", "/article/asg/browser/" -> "asg/browser".
 * Anything outside /article/ is not tracked.
 */
export function articleIdFromPath(pathname) {
  const match = /^\/article\/([^?#]*)/.exec(String(pathname || ''))
  if (!match) return null
  const id = match[1].replace(/index\.html$/, '').replace(/^\/+|\/+$/g, '')
  return id ? id : null
}

export function isBotAgent(userAgent, webdriver = false) {
  if (webdriver) return true
  return BOT_PATTERN.test(String(userAgent || ''))
}

export function deviceClass(width) {
  if (!Number.isFinite(width) || width <= 0) return 'unknown'
  if (width < 640) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

export function sanitizeText(value, max = LIMITS.maxTargetLength) {
  if (value === null || value === undefined) return undefined
  const text = String(value).replace(/\s+/g, ' ').trim()
  if (!text) return undefined
  return text.length > max ? text.slice(0, max) : text
}

/**
 * Best available human-readable name for whatever was clicked. Walks a few
 * ancestors because the click usually lands on an inner span or svg, not on the
 * element that carries the identity.
 */
export function labelTarget(element, maxWalk = LIMITS.maxAncestorWalk) {
  let node = element
  for (let depth = 0; node && depth <= maxWalk; depth++) {
    const attr = name => (typeof node.getAttribute === 'function' ? node.getAttribute(name) : null)
    const label =
      attr('data-sl-label') || attr('data-track') || node.id || attr('aria-label') || attr('name') || attr('data-testid')
    if (label) return sanitizeText(label)
    node = node.parentElement
  }
  const tag = element && element.tagName ? String(element.tagName).toLowerCase() : undefined
  return sanitizeText(tag)
}

export function elementRole(element) {
  if (!element || !element.tagName) return undefined
  const tag = String(element.tagName).toLowerCase()
  const type = typeof element.getAttribute === 'function' ? element.getAttribute('type') : null
  return type ? `${tag}:${sanitizeText(type, 16)}` : tag
}

export function isOutbound(href, currentHost) {
  if (typeof href !== 'string' || !/^https?:\/\//i.test(href)) return false
  try {
    return new URL(href).host !== currentHost
  } catch {
    return false
  }
}

/** Milestones newly crossed by this scroll position, in ascending order. */
export function nextScrollMilestones(previousMax, ratio) {
  const percent = Math.max(0, Math.min(100, Math.round(ratio * 100)))
  return SCROLL_MILESTONES.filter(m => m > previousMax && m <= percent)
}

export function scrollRatio(scrollY, viewportHeight, documentHeight) {
  const scrollable = documentHeight - viewportHeight
  if (!Number.isFinite(scrollable) || scrollable <= 0) return 1
  return Math.max(0, Math.min(1, (scrollY + viewportHeight) / documentHeight))
}

export function utmFromSearch(search) {
  const out = {}
  if (!search) return out
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    const value = sanitizeText(params.get(key), 48)
    if (value) out[key.slice(4)] = value
  }
  return out
}

/** Time the tab was actually visible, so a tab left open overnight reads as it should. */
export function createActiveTimer() {
  let accumulated = 0
  let startedAt = null
  return {
    start(now) {
      if (startedAt === null) startedAt = now
    },
    stop(now) {
      if (startedAt === null) return
      accumulated += Math.max(0, now - startedAt)
      startedAt = null
    },
    total(now) {
      return startedAt === null ? accumulated : accumulated + Math.max(0, now - startedAt)
    },
  }
}

/** Buffers events and hands them to onFlush in batches. */
export function createQueue({ limit = LIMITS.maxBatch, onFlush } = {}) {
  let buffer = []
  let seq = 0
  return {
    push(event) {
      buffer.push({ ...event, seq: seq++ })
      if (buffer.length >= limit) this.flush()
    },
    flush() {
      if (buffer.length === 0) return []
      const batch = buffer
      buffer = []
      if (onFlush) onFlush(batch)
      return batch
    },
    get size() {
      return buffer.length
    },
    get sequence() {
      return seq
    },
  }
}
