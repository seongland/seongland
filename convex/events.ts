import { v } from 'convex/values'
import { mutation } from './_generated/server'
import { requireIngestKey } from './auth'

const MAX_EVENTS_PER_CALL = 200
const MAX_STRING = 200

const eventValidator = v.object({
  type: v.string(),
  ts: v.number(),
  target: v.optional(v.string()),
  value: v.optional(v.union(v.number(), v.string())),
  meta: v.optional(v.any()),
})

function clip(value: unknown, max = MAX_STRING): string | undefined {
  if (typeof value !== 'string') return undefined
  const text = value.trim()
  if (!text) return undefined
  return text.length > max ? text.slice(0, max) : text
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
}

function stringMap(value: unknown): Record<string, string> | undefined {
  const source = asRecord(value)
  const out: Record<string, string> = {}
  for (const [key, item] of Object.entries(source)) {
    const text = clip(item, 64)
    if (text) out[key] = text
  }
  return Object.keys(out).length > 0 ? out : undefined
}

/**
 * Called only by /api/track, which holds the ingest key and adds the edge geo.
 * Sequence numbers are assigned here rather than trusted from the client, so
 * batches that arrive out of order still reconstruct one ordered journey.
 */
export const ingest = mutation({
  args: {
    ingestKey: v.string(),
    articleId: v.string(),
    sessionId: v.string(),
    visitorId: v.string(),
    country: v.optional(v.string()),
    region: v.optional(v.string()),
    city: v.optional(v.string()),
    ip: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    timezone: v.optional(v.string()),
    owner: v.optional(v.boolean()),
    events: v.array(eventValidator),
  },
  handler: async (ctx, args) => {
    requireIngestKey(args.ingestKey)

    const events = args.events.slice(0, MAX_EVENTS_PER_CALL)
    if (events.length === 0) return { accepted: 0 }

    const articleId = clip(args.articleId, 64)
    const sessionId = clip(args.sessionId, 64)
    const visitorId = clip(args.visitorId, 64)
    if (!articleId || !sessionId || !visitorId) return { accepted: 0 }

    const session = await ctx.db
      .query('sessions')
      .withIndex('by_session_article', q => q.eq('sessionId', sessionId).eq('articleId', articleId))
      .unique()

    const timestamps = events.map(event => event.ts)
    const firstTs = Math.min(...timestamps)
    const lastTs = Math.max(...timestamps)

    const pageview = events.find(event => event.type === 'pageview')
    const pageviewMeta = asRecord(pageview?.meta)
    const exit = events.filter(event => event.type === 'exit').pop()
    const exitMeta = asRecord(exit?.meta)

    const scrollMarks = events
      .filter(event => event.type === 'scroll')
      .map(event => Number(event.value))
      .filter(Number.isFinite)
    const batchScroll = Math.max(0, Number(exitMeta.maxScroll) || 0, ...scrollMarks)
    const batchActiveMs = Math.max(0, Number(exit?.value) || 0)

    const base = session?.eventCount ?? 0
    for (const [index, event] of events.entries()) {
      await ctx.db.insert('events', {
        sessionId,
        articleId,
        seq: base + index,
        ts: event.ts,
        type: clip(event.type, 32) ?? 'unknown',
        target: clip(event.target, 120),
        value: typeof event.value === 'string' ? clip(event.value) : event.value,
        meta: event.meta,
      })
    }

    const deepestSection = clip(exitMeta.deepestSection, 120)

    if (session) {
      await ctx.db.patch(session._id, {
        lastAt: Math.max(session.lastAt, lastTs),
        eventCount: base + events.length,
        activeMs: Math.max(session.activeMs, batchActiveMs),
        maxScroll: Math.max(session.maxScroll, batchScroll),
        completed: session.completed || batchScroll >= 100,
        deepestSection: deepestSection ?? session.deepestSection,
        country: args.country ?? session.country,
        region: args.region ?? session.region,
        city: args.city ?? session.city,
        ip: args.ip ?? session.ip,
        latitude: args.latitude ?? session.latitude,
        longitude: args.longitude ?? session.longitude,
        timezone: args.timezone ?? session.timezone,
        owner: args.owner || session.owner,
      })
      return { accepted: events.length }
    }

    await ctx.db.insert('sessions', {
      sessionId,
      articleId,
      visitorId,
      startedAt: firstTs,
      lastAt: lastTs,
      country: clip(args.country, 8),
      region: clip(args.region, 64),
      city: clip(args.city, 64),
      ip: clip(args.ip, 64),
      latitude: args.latitude,
      longitude: args.longitude,
      timezone: clip(args.timezone, 64),
      owner: args.owner === true,
      referrer: clip(pageviewMeta.referrer),
      language: clip(pageviewMeta.language, 16),
      device: clip(pageviewMeta.device, 16),
      viewport: clip(pageviewMeta.viewport, 16),
      utm: stringMap(pageviewMeta.utm),
      eventCount: events.length,
      activeMs: batchActiveMs,
      maxScroll: batchScroll,
      deepestSection,
      completed: batchScroll >= 100,
    })
    return { accepted: events.length }
  },
})
