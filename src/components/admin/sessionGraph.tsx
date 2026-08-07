import type { Edge, Node } from '@xyflow/react'
import type { JourneyEvent, SessionJourney } from '@/lib/convexApi.ts'
import { FLOW_HUES, pageLabel } from './palette.ts'
import { formatDuration } from './ui.tsx'

const PAGE_X = 40
const EVENT_X = 300
const ROW_H = 52
const EVENT_H = 30
const MAX_EVENTS_PER_PAGE = 12

/** Events that say something about intent; the rest is noise in a journey view. */
const INTERESTING = new Set(['section', 'click', 'filter', 'card', 'outbound', 'bibtex_copy', 'copy'])

export function describe(event: JourneyEvent): string {
  if (event.type === 'section') return `read “${event.target ?? '?'}”`
  if (event.type === 'filter') return `filtered ${event.target ?? ''}`
  if (event.type === 'card') return `opened ${event.target ?? ''}`
  if (event.type === 'outbound') return `left to ${event.target ?? ''}`
  if (event.type === 'bibtex_copy') return 'copied the BibTeX'
  if (event.type === 'copy') return `copied ${event.value ?? ''} chars`
  return `${event.type} ${event.target ?? ''}`.trim()
}

/**
 * One lane per page in visit order, with that page's events stacked beside it.
 * Pages come from the ordered pageview stream rather than from the session rows,
 * because the rows are keyed per page and lose the order they were visited in.
 */
export function buildSessionGraph(journey: SessionJourney): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = []
  const edges: Edge[] = []

  const order: string[] = []
  for (const event of journey.events) {
    if (event.type !== 'pageview') continue
    if (order[order.length - 1] !== event.page) order.push(event.page)
  }
  if (order.length === 0) for (const page of journey.pages) order.push(page.page)

  let y = 0
  order.forEach((page, index) => {
    const id = `page-${index}`
    const hue = FLOW_HUES[index % FLOW_HUES.length]
    const visit = journey.pages.find(p => p.page === page)
    nodes.push({
      id,
      position: { x: PAGE_X, y },
      data: {
        label: (
          <div className="text-left">
            <div className="text-[11px] font-medium">{pageLabel(page)}</div>
            <div className="mono text-[9px] opacity-70">
              {visit ? `${formatDuration(visit.activeMs)} · ${visit.maxScroll}%` : 'visited'}
            </div>
          </div>
        ),
      },
      style: {
        background: 'var(--color-paper)',
        border: `2px solid ${hue}`,
        borderRadius: 8,
        padding: '6px 10px',
        width: 190,
        color: 'var(--color-ink)',
      },
      sourcePosition: 'right' as const,
      targetPosition: 'left' as const,
    })

    if (index > 0) {
      edges.push({
        id: `hop-${index}`,
        source: `page-${index - 1}`,
        target: id,
        animated: true,
        style: { stroke: 'var(--color-ink-4)' },
      })
    }

    const own = journey.events.filter(e => e.page === page && INTERESTING.has(e.type)).slice(0, MAX_EVENTS_PER_PAGE)
    own.forEach((event, step) => {
      const eventId = `${id}-e${step}`
      nodes.push({
        id: eventId,
        position: { x: EVENT_X, y: y + step * EVENT_H },
        data: { label: <span className="text-[10px]">{describe(event)}</span> },
        style: {
          background: 'var(--color-paper-warm)',
          border: '1px solid var(--color-rule)',
          borderRadius: 6,
          padding: '3px 8px',
          width: 250,
          color: 'var(--color-ink-2)',
          fontSize: 10,
        },
        targetPosition: 'left' as const,
        sourcePosition: 'right' as const,
      })
      edges.push({
        id: `${eventId}-link`,
        source: id,
        target: eventId,
        style: { stroke: 'var(--color-rule)', strokeWidth: 1 },
      })
    })

    y += Math.max(ROW_H, own.length * EVENT_H + 16)
  })

  return { nodes, edges }
}
