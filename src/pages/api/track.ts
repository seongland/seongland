import type { APIRoute } from 'astro'
import { ConvexHttpClient } from 'convex/browser'
import { trackedArticleIds } from '@/data/articles.ts'
import { eventsApi } from '@/lib/convexApi.ts'

// The one server-rendered route on the site. It exists so events can be stamped
// with the Vercel edge geo headers, which a browser-to-Convex post cannot carry.
export const prerender = false

const MAX_BODY_BYTES = 64 * 1024
const MAX_EVENTS = 100
const ALLOWED = new Set(trackedArticleIds)
const KNOWN_TYPES = new Set(['pageview', 'scroll', 'section', 'dwell', 'click', 'outbound', 'copy', 'bibtex_copy', 'exit'])

interface IncomingEvent {
  type: string
  ts: number
  target?: string
  value?: number | string
  meta?: unknown
}

function header(request: Request, name: string): string | undefined {
  const raw = request.headers.get(name)
  if (!raw) return undefined
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

function parseEvents(input: unknown): IncomingEvent[] {
  if (!Array.isArray(input)) return []
  const now = Date.now()
  return input
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
    .filter(item => typeof item.type === 'string' && KNOWN_TYPES.has(item.type))
    .filter(item => typeof item.ts === 'number' && Number.isFinite(item.ts) && item.ts <= now + 60_000)
    .slice(0, MAX_EVENTS)
    .map(item => ({
      type: item.type as string,
      ts: item.ts as number,
      target: typeof item.target === 'string' ? item.target : undefined,
      value: typeof item.value === 'number' || typeof item.value === 'string' ? item.value : undefined,
      meta: item.meta,
    }))
}

/** Always 204, so a probe learns nothing about the backend or its state. */
const noContent = () => new Response(null, { status: 204 })

export const POST: APIRoute = async ({ request }) => {
  try {
    const raw = await request.text()
    if (raw.length > MAX_BODY_BYTES) return noContent()

    const payload = JSON.parse(raw) as Record<string, unknown>
    const articleId = typeof payload.articleId === 'string' ? payload.articleId : ''
    const sessionId = typeof payload.sessionId === 'string' ? payload.sessionId : ''
    const visitorId = typeof payload.visitorId === 'string' ? payload.visitorId : ''
    if (!ALLOWED.has(articleId) || !sessionId || !visitorId) return noContent()

    const events = parseEvents(payload.events)
    if (events.length === 0) return noContent()

    const convexUrl = process.env.CONVEX_URL ?? process.env.PUBLIC_CONVEX_URL
    const ingestKey = process.env.TRACK_INGEST_KEY
    if (!convexUrl || !ingestKey) return noContent()

    const client = new ConvexHttpClient(convexUrl)
    await client.mutation(eventsApi.ingest, {
      ingestKey,
      articleId,
      sessionId,
      visitorId,
      country: header(request, 'x-vercel-ip-country'),
      region: header(request, 'x-vercel-ip-country-region'),
      city: header(request, 'x-vercel-ip-city'),
      events,
    })
  } catch {
    // Telemetry is best effort; a bad batch must never surface to the reader.
  }
  return noContent()
}
