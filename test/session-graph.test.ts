import { describe, expect, it } from 'vitest'
import { buildSessionGraph, describe as describeEvent } from '../src/components/admin/sessionGraph.tsx'
import type { SessionJourney } from '../src/lib/convexApi.ts'

function journey(events: SessionJourney['events'], pages: SessionJourney['pages'] = []): SessionJourney {
  return { sessionId: 's', startedAt: 0, activeMs: 0, pages, events }
}

describe('buildSessionGraph', () => {
  it('lays out one lane per page in the order they were visited', () => {
    const graph = buildSessionGraph(
      journey([
        { seq: 0, ts: 1, type: 'pageview', page: 'home' },
        { seq: 1, ts: 2, type: 'pageview', page: 'publications' },
        { seq: 2, ts: 3, type: 'pageview', page: 'corrsteer' },
      ]),
    )
    const pages = graph.nodes.filter(node => node.id.startsWith('page-'))
    expect(pages.map(node => node.id)).toEqual(['page-0', 'page-1', 'page-2'])
    expect(graph.edges.filter(edge => edge.id.startsWith('hop-'))).toHaveLength(2)
  })

  it('collapses a repeated pageview so a reload is not a second lane', () => {
    const graph = buildSessionGraph(
      journey([
        { seq: 0, ts: 1, type: 'pageview', page: 'home' },
        { seq: 1, ts: 2, type: 'pageview', page: 'home' },
      ]),
    )
    expect(graph.nodes.filter(node => node.id.startsWith('page-'))).toHaveLength(1)
  })

  it('keeps a page revisited later as its own lane, since the order matters', () => {
    const graph = buildSessionGraph(
      journey([
        { seq: 0, ts: 1, type: 'pageview', page: 'home' },
        { seq: 1, ts: 2, type: 'pageview', page: 'corrsteer' },
        { seq: 2, ts: 3, type: 'pageview', page: 'home' },
      ]),
    )
    expect(graph.nodes.filter(node => node.id.startsWith('page-'))).toHaveLength(3)
  })

  it('attaches only meaningful events, and only to their own page', () => {
    const graph = buildSessionGraph(
      journey([
        { seq: 0, ts: 1, type: 'pageview', page: 'publications' },
        { seq: 1, ts: 2, type: 'filter', page: 'publications', target: 'Agent' },
        { seq: 2, ts: 3, type: 'scroll', page: 'publications', value: 50 },
        { seq: 3, ts: 4, type: 'pageview', page: 'corrsteer' },
        { seq: 4, ts: 5, type: 'bibtex_copy', page: 'corrsteer' },
      ]),
    )
    // scroll is noise in a journey view and must not become a node.
    expect(graph.nodes.filter(node => node.id === 'page-0-e0')).toHaveLength(1)
    expect(graph.nodes.filter(node => node.id === 'page-0-e1')).toHaveLength(0)
    expect(graph.nodes.filter(node => node.id === 'page-1-e0')).toHaveLength(1)
  })

  it('falls back to the visited pages when no pageview survived the window', () => {
    const graph = buildSessionGraph(journey([], [{ page: 'asg', startedAt: 1, activeMs: 10, maxScroll: 50 }]))
    expect(graph.nodes.filter(node => node.id.startsWith('page-'))).toHaveLength(1)
  })
})

describe('describe', () => {
  it('reads as a sentence rather than an event name', () => {
    expect(describeEvent({ seq: 0, ts: 0, type: 'filter', page: 'p', target: 'Agent' })).toBe('filtered Agent')
    expect(describeEvent({ seq: 0, ts: 0, type: 'bibtex_copy', page: 'p' })).toBe('copied the BibTeX')
    expect(describeEvent({ seq: 0, ts: 0, type: 'section', page: 'p', target: 'Method' })).toBe('read “Method”')
  })
})
