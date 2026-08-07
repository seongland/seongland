import { describe, expect, it } from 'vitest'
import {
  articleIdFromPath,
  createActiveTimer,
  createQueue,
  deviceClass,
  isBotAgent,
  isOutbound,
  labelTarget,
  nextScrollMilestones,
  randomId,
  sanitizeText,
  scrollRatio,
  utmFromSearch,
} from '../public/telemetry-core.js'

describe('articleIdFromPath', () => {
  it('reads the article id, including nested apps', () => {
    expect(articleIdFromPath('/article/corrsteer/')).toBe('corrsteer')
    expect(articleIdFromPath('/article/corrsteer/index.html')).toBe('corrsteer')
    expect(articleIdFromPath('/article/asg/browser/')).toBe('asg/browser')
  })

  it('ignores everything outside /article', () => {
    expect(articleIdFromPath('/')).toBeNull()
    expect(articleIdFromPath('/publications')).toBeNull()
    expect(articleIdFromPath('/article/')).toBeNull()
  })
})

describe('isBotAgent', () => {
  it('catches crawlers and automation', () => {
    expect(isBotAgent('Mozilla/5.0 (compatible; Googlebot/2.1)')).toBe(true)
    expect(isBotAgent('HeadlessChrome/120')).toBe(true)
    expect(isBotAgent('Mozilla/5.0 Safari/605', true)).toBe(true)
  })

  it('leaves real browsers alone', () => {
    expect(isBotAgent('Mozilla/5.0 (Macintosh) Safari/605.1.15')).toBe(false)
  })
})

describe('labelTarget', () => {
  const element = (attrs: Record<string, string>, parent: unknown = null) => ({
    tagName: attrs.tagName ?? 'DIV',
    id: attrs.id ?? '',
    getAttribute: (name: string) => attrs[name] ?? null,
    parentElement: parent,
  })

  it('prefers an explicit label over an id', () => {
    expect(labelTarget(element({ 'data-sl-label': 'bibtex', id: 'x' }))).toBe('bibtex')
  })

  it('walks up to the ancestor that carries the identity', () => {
    const parent = element({ id: 'steering-slider' })
    expect(labelTarget(element({ tagName: 'SPAN' }, parent))).toBe('steering-slider')
  })

  it('falls back to the tag name', () => {
    expect(labelTarget(element({ tagName: 'BUTTON' }))).toBe('button')
  })
})

describe('scroll tracking', () => {
  it('reports only newly crossed milestones', () => {
    expect(nextScrollMilestones(0, 0.6)).toEqual([25, 50])
    expect(nextScrollMilestones(50, 0.6)).toEqual([])
    expect(nextScrollMilestones(50, 1)).toEqual([75, 100])
  })

  it('treats a page shorter than the viewport as fully read', () => {
    expect(scrollRatio(0, 900, 700)).toBe(1)
    expect(scrollRatio(0, 500, 2000)).toBeCloseTo(0.25)
  })
})

describe('createActiveTimer', () => {
  it('counts only the visible stretches', () => {
    const timer = createActiveTimer()
    timer.start(1000)
    timer.stop(3000)
    expect(timer.total(9000)).toBe(2000)
    timer.start(9000)
    expect(timer.total(10_000)).toBe(3000)
  })

  it('ignores a second start while already running', () => {
    const timer = createActiveTimer()
    timer.start(0)
    timer.start(500)
    expect(timer.total(1000)).toBe(1000)
  })
})

describe('createQueue', () => {
  it('numbers events and flushes on demand', () => {
    const flushed: unknown[][] = []
    const queue = createQueue({ onFlush: batch => flushed.push(batch) })
    queue.push({ type: 'pageview' })
    queue.push({ type: 'scroll' })
    expect(queue.size).toBe(2)
    queue.flush()
    expect(flushed[0]).toEqual([
      { type: 'pageview', seq: 0 },
      { type: 'scroll', seq: 1 },
    ])
    expect(queue.size).toBe(0)
  })

  it('auto-flushes at the limit and never flushes empty', () => {
    const flushed: unknown[][] = []
    const queue = createQueue({ limit: 2, onFlush: batch => flushed.push(batch) })
    queue.push({ type: 'a' })
    queue.push({ type: 'b' })
    expect(flushed).toHaveLength(1)
    queue.flush()
    expect(flushed).toHaveLength(1)
  })
})

describe('small helpers', () => {
  it('classifies devices by width', () => {
    expect(deviceClass(390)).toBe('mobile')
    expect(deviceClass(800)).toBe('tablet')
    expect(deviceClass(1440)).toBe('desktop')
    expect(deviceClass(0)).toBe('unknown')
  })

  it('detects outbound links only', () => {
    expect(isOutbound('https://arxiv.org/abs/1', 'seongland.com')).toBe(true)
    expect(isOutbound('https://seongland.com/cv.pdf', 'seongland.com')).toBe(false)
    expect(isOutbound('#section', 'seongland.com')).toBe(false)
  })

  it('collapses and clips text', () => {
    expect(sanitizeText('  a   b  ')).toBe('a b')
    expect(sanitizeText('x'.repeat(80))).toHaveLength(64)
    expect(sanitizeText('   ')).toBeUndefined()
  })

  it('extracts utm parameters without the prefix', () => {
    expect(utmFromSearch('?utm_source=x&utm_medium=y&other=z')).toEqual({ source: 'x', medium: 'y' })
    expect(utmFromSearch('')).toEqual({})
  })

  it('generates ids without collisions', () => {
    const ids = new Set(Array.from({ length: 200 }, () => randomId()))
    expect(ids.size).toBe(200)
  })
})
