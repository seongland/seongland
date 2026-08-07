import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import type { Doc } from './_generated/dataModel'
import type { QueryCtx } from './_generated/server'
import { requireOwner } from './auth'

// Read caps. Every response reports whether it hit one, so a truncated window
// never reads as a complete one.
const MAX_SESSIONS = 4000
const MAX_EVENTS = 8000
const MAX_SCATTER = 1200
const DAY_MS = 86_400_000
const CONFIG_KEY = 'exclusions'

function since(days: number): number {
  return Date.now() - Math.max(1, Math.min(365, days)) * DAY_MS
}

function median(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? Math.round((sorted[middle - 1] + sorted[middle]) / 2) : sorted[middle]
}

function tally<T>(items: T[], key: (item: T) => string | undefined) {
  const counts = new Map<string, number>()
  for (const item of items) {
    const name = key(item)
    if (!name) continue
    counts.set(name, (counts.get(name) ?? 0) + 1)
  }
  return [...counts.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
}

/** A visit that barely started: shallow and short. */
function isBounce(session: Doc<'sessions'>): boolean {
  return session.maxScroll < 25 && session.activeMs < 10_000
}

function summarize(sessions: Doc<'sessions'>[]) {
  return {
    sessions: sessions.length,
    visitors: new Set(sessions.map(s => s.visitorId)).size,
    medianActiveMs: median(sessions.map(s => s.activeMs).filter(ms => ms > 0)),
    medianScroll: median(sessions.map(s => s.maxScroll)),
    completionRate: sessions.length === 0 ? 0 : sessions.filter(s => s.completed).length / sessions.length,
    bounceRate: sessions.length === 0 ? 0 : sessions.filter(isBounce).length / sessions.length,
    events: sessions.reduce((total, s) => total + s.eventCount, 0),
  }
}

export interface Exclusions {
  excludeOwner: boolean
  excludedIps: string[]
  excludedVisitors: string[]
}

const DEFAULT_EXCLUSIONS: Exclusions = { excludeOwner: true, excludedIps: [], excludedVisitors: [] }

async function loadExclusions(ctx: QueryCtx): Promise<Exclusions> {
  const row = await ctx.db
    .query('config')
    .withIndex('by_key', q => q.eq('key', CONFIG_KEY))
    .unique()
  if (!row) return DEFAULT_EXCLUSIONS
  return {
    excludeOwner: row.excludeOwner,
    excludedIps: row.excludedIps,
    excludedVisitors: row.excludedVisitors,
  }
}

function excludes(rules: Exclusions) {
  const ips = new Set(rules.excludedIps)
  const visitors = new Set(rules.excludedVisitors)
  return (session: Doc<'sessions'>): boolean => {
    if (rules.excludeOwner && session.owner) return true
    if (session.ip && ips.has(session.ip)) return true
    return visitors.has(session.visitorId)
  }
}

/** Ungated on purpose: the sign-in gate needs to tell "not the owner" from "broken". */
export const whoami = query({
  args: {},
  handler: async ctx => {
    const identity = await ctx.auth.getUserIdentity()
    const configured = Boolean(process.env.SEONGLAND_OWNER_EMAIL || process.env.SEONGLAND_OWNER_USER_ID)
    if (!identity) return { authenticated: false, isOwner: false, configured }
    let isOwner = true
    try {
      await requireOwner(ctx)
    } catch {
      isOwner = false
    }
    return {
      authenticated: true,
      isOwner,
      configured,
      subject: identity.subject,
      email: typeof identity.email === 'string' ? identity.email : undefined,
      name: typeof identity.name === 'string' ? identity.name : undefined,
    }
  },
})

export const getExclusions = query({
  args: {},
  handler: async ctx => {
    await requireOwner(ctx)
    return loadExclusions(ctx)
  },
})

export const setExclusions = mutation({
  args: {
    excludeOwner: v.boolean(),
    excludedIps: v.array(v.string()),
    excludedVisitors: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await requireOwner(ctx)
    const clean = {
      excludeOwner: args.excludeOwner,
      excludedIps: [...new Set(args.excludedIps.map(ip => ip.trim()).filter(Boolean))].slice(0, 100),
      excludedVisitors: [...new Set(args.excludedVisitors.map(id => id.trim()).filter(Boolean))].slice(0, 100),
    }
    const row = await ctx.db
      .query('config')
      .withIndex('by_key', q => q.eq('key', CONFIG_KEY))
      .unique()
    if (row) await ctx.db.patch(row._id, clean)
    else await ctx.db.insert('config', { key: CONFIG_KEY, ...clean })
    return clean
  },
})

export const overview = query({
  args: { days: v.number(), includeExcluded: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    await requireOwner(ctx)
    const from = since(args.days)
    const rules = await loadExclusions(ctx)
    const isExcluded = excludes(rules)

    const all = await ctx.db
      .query('sessions')
      .withIndex('by_started', q => q.gte('startedAt', from))
      .order('desc')
      .take(MAX_SESSIONS)

    const excludedCount = all.filter(isExcluded).length
    const sessions = args.includeExcluded ? all : all.filter(session => !isExcluded(session))

    const byArticle = new Map<string, Doc<'sessions'>[]>()
    for (const session of sessions) {
      const bucket = byArticle.get(session.articleId) ?? []
      bucket.push(session)
      byArticle.set(session.articleId, bucket)
    }

    const days = new Map<string, number>()
    for (const session of sessions) {
      const day = new Date(session.startedAt).toISOString().slice(0, 10)
      days.set(day, (days.get(day) ?? 0) + 1)
    }

    // Weekday by hour, in UTC so the numbers do not shift with the viewer.
    const hourly = Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => 0))
    for (const session of sessions) {
      const at = new Date(session.startedAt)
      hourly[at.getUTCDay()][at.getUTCHours()] += 1
    }

    // Merge nearby coordinates so a city reads as one dot rather than a smear.
    const places = new Map<string, { lat: number; lon: number; city?: string; country?: string; sessions: number }>()
    for (const session of sessions) {
      if (session.latitude === undefined || session.longitude === undefined) continue
      const key = `${session.latitude.toFixed(1)},${session.longitude.toFixed(1)}`
      const place = places.get(key) ?? {
        lat: session.latitude,
        lon: session.longitude,
        city: session.city,
        country: session.country,
        sessions: 0,
      }
      place.sessions += 1
      places.set(key, place)
    }

    const visitorSessions = new Map<string, number>()
    for (const session of sessions) {
      visitorSessions.set(session.visitorId, (visitorSessions.get(session.visitorId) ?? 0) + 1)
    }
    const returning = [...visitorSessions.values()].filter(count => count > 1).length

    const depthBuckets = [0, 25, 50, 75, 100]
    const depth = depthBuckets.map((bucket, index) => {
      const next = depthBuckets[index + 1] ?? 101
      return {
        bucket,
        count: sessions.filter(s => s.maxScroll >= bucket && (index === depthBuckets.length - 1 || s.maxScroll < next))
          .length,
      }
    })

    return {
      from,
      truncated: all.length === MAX_SESSIONS,
      excludedCount,
      totals: summarize(sessions),
      articles: [...byArticle.entries()]
        .map(([articleId, rows]) => ({ articleId, ...summarize(rows) }))
        .sort((a, b) => b.sessions - a.sessions),
      countries: tally(sessions, s => s.country),
      cities: tally(sessions, s => (s.city ? `${s.city}${s.country ? `, ${s.country}` : ''}` : undefined)).slice(0, 20),
      referrers: tally(sessions, s => {
        if (!s.referrer) return 'direct'
        try {
          return new URL(s.referrer).host
        } catch {
          return 'unknown'
        }
      }).slice(0, 20),
      devices: tally(sessions, s => s.device),
      languages: tally(sessions, s => s.language).slice(0, 12),
      timezones: tally(sessions, s => s.timezone).slice(0, 12),
      daily: [...days.entries()].map(([day, count]) => ({ day, count })).sort((a, b) => a.day.localeCompare(b.day)),
      hourly,
      places: [...places.values()].sort((a, b) => b.sessions - a.sessions),
      scatter: sessions
        .slice(0, MAX_SCATTER)
        .map(s => ({ activeMs: s.activeMs, maxScroll: s.maxScroll, articleId: s.articleId })),
      depth,
      visitors: { returning, fresh: visitorSessions.size - returning },
      recent: all.slice(0, 40).map(s => ({
        _id: s._id,
        articleId: s.articleId,
        startedAt: s.startedAt,
        activeMs: s.activeMs,
        maxScroll: s.maxScroll,
        completed: s.completed,
        city: s.city,
        region: s.region,
        country: s.country,
        ip: s.ip,
        device: s.device,
        referrer: s.referrer,
        language: s.language,
        visitorId: s.visitorId,
        owner: s.owner === true,
        excluded: isExcluded(s),
      })),
    }
  },
})

export const articleDetail = query({
  args: { articleId: v.string(), days: v.number(), includeExcluded: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    await requireOwner(ctx)
    const from = since(args.days)
    const rules = await loadExclusions(ctx)
    const isExcluded = excludes(rules)

    const all = await ctx.db
      .query('sessions')
      .withIndex('by_article_started', q => q.eq('articleId', args.articleId).gte('startedAt', from))
      .order('desc')
      .take(MAX_SESSIONS)
    const sessions = args.includeExcluded ? all : all.filter(session => !isExcluded(session))
    const keep = new Set(sessions.map(session => session.sessionId))

    const allEvents = await ctx.db
      .query('events')
      .withIndex('by_article_ts', q => q.eq('articleId', args.articleId).gte('ts', from))
      .order('desc')
      .take(MAX_EVENTS)
    const events = allEvents.filter(event => keep.has(event.sessionId))

    const reachedBy = (milestone: number) => sessions.filter(s => s.maxScroll >= milestone).length
    const interactions = events.filter(e => ['click', 'bibtex_copy', 'copy'].includes(e.type))

    return {
      from,
      truncated: all.length === MAX_SESSIONS || allEvents.length === MAX_EVENTS,
      summary: summarize(sessions),
      scroll: [25, 50, 75, 100].map(milestone => ({ milestone, sessions: reachedBy(milestone) })),
      sections: tally(
        events.filter(e => e.type === 'section'),
        e => e.target,
      ),
      interactions: tally(interactions, e => `${e.type}:${e.target ?? 'unknown'}`).slice(0, 30),
      outbound: tally(
        events.filter(e => e.type === 'outbound'),
        e => (typeof e.value === 'string' ? e.value : e.target),
      ).slice(0, 20),
      bibtexCopies: events.filter(e => e.type === 'bibtex_copy').length,
      countries: tally(sessions, s => s.country),
      places: sessions
        .filter(s => s.latitude !== undefined && s.longitude !== undefined)
        .map(s => ({
          lat: s.latitude as number,
          lon: s.longitude as number,
          city: s.city,
          country: s.country,
          sessions: 1,
        })),
    }
  },
})

/**
 * Aggregate reader path: nodes are sections, edges are the transitions between
 * consecutive sections inside one session, and `exits` counts sessions whose
 * last observed section was that node.
 */
export const journey = query({
  args: { articleId: v.string(), days: v.number() },
  handler: async (ctx, args) => {
    await requireOwner(ctx)
    const from = since(args.days)

    const events = await ctx.db
      .query('events')
      .withIndex('by_article_ts', q => q.eq('articleId', args.articleId).gte('ts', from))
      .order('desc')
      .take(MAX_EVENTS)

    const bySession = new Map<string, Doc<'events'>[]>()
    for (const event of events) {
      if (event.type !== 'section' || !event.target) continue
      const bucket = bySession.get(event.sessionId) ?? []
      bucket.push(event)
      bySession.set(event.sessionId, bucket)
    }

    const nodes = new Map<string, { id: string; sessions: number; exits: number; order: number }>()
    const edges = new Map<string, { from: string; to: string; count: number }>()

    for (const bucket of bySession.values()) {
      const path = bucket.sort((a, b) => a.seq - b.seq).map(event => event.target as string)
      path.forEach((id, index) => {
        const node = nodes.get(id) ?? { id, sessions: 0, exits: 0, order: index }
        node.sessions += 1
        node.order = Math.min(node.order, index)
        if (index === path.length - 1) node.exits += 1
        nodes.set(id, node)
        if (index === 0) return
        const key = `${path[index - 1]} ${id}`
        const edge = edges.get(key) ?? { from: path[index - 1], to: id, count: 0 }
        edge.count += 1
        edges.set(key, edge)
      })
    }

    return {
      from,
      truncated: events.length === MAX_EVENTS,
      sessions: bySession.size,
      nodes: [...nodes.values()].sort((a, b) => a.order - b.order || b.sessions - a.sessions),
      edges: [...edges.values()].sort((a, b) => b.count - a.count),
    }
  },
})

/** How many hops of a visit the flow diagram shows before it stops. */
const MAX_FLOW_STEPS = 6

/**
 * Page-to-page movement across the whole site, as a Sankey-ready graph.
 *
 * Real visits revisit pages (home, article, back to home), and a Sankey cannot
 * draw a cycle. Nodes are therefore keyed by page *and* hop number, which makes
 * the graph acyclic by construction and reads the way behaviour flow should:
 * each column is "where people were on their Nth page".
 */
export const flow = query({
  args: { days: v.number(), start: v.optional(v.string()), includeExcluded: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    await requireOwner(ctx)
    const from = since(args.days)

    const sessions = await ctx.db
      .query('sessions')
      .withIndex('by_started', q => q.gte('startedAt', from))
      .take(MAX_SESSIONS)

    const isExcluded = excludes(await loadExclusions(ctx))
    const skip = new Set<string>()
    if (!args.includeExcluded) {
      for (const session of sessions) if (isExcluded(session)) skip.add(session.sessionId)
    }

    const events = await ctx.db
      .query('events')
      .withIndex('by_type_ts', q => q.eq('type', 'pageview').gte('ts', from))
      .order('desc')
      .take(MAX_EVENTS)

    const bySession = new Map<string, Doc<'events'>[]>()
    for (const event of events) {
      if (skip.has(event.sessionId)) continue
      const bucket = bySession.get(event.sessionId) ?? []
      bucket.push(event)
      bySession.set(event.sessionId, bucket)
    }

    const nodes = new Map<string, { id: string; page: string; step: number; sessions: number; exits: number }>()
    const links = new Map<string, { source: string; target: string; value: number }>()
    const pages = new Set<string>()
    let counted = 0

    for (const bucket of bySession.values()) {
      // A reload repeats the page; collapsing repeats keeps self-loops out.
      const ordered = bucket.sort((a, b) => a.seq - b.seq).map(event => event.articleId)
      let path = ordered.filter((page, index) => index === 0 || page !== ordered[index - 1])
      for (const page of path) pages.add(page)

      if (args.start) {
        const entry = path.indexOf(args.start)
        if (entry === -1) continue
        path = path.slice(entry)
      }
      path = path.slice(0, MAX_FLOW_STEPS)
      if (path.length === 0) continue
      counted += 1

      path.forEach((page, step) => {
        const id = `${page}#${step}`
        const node = nodes.get(id) ?? { id, page, step, sessions: 0, exits: 0 }
        node.sessions += 1
        if (step === path.length - 1) node.exits += 1
        nodes.set(id, node)
        if (step === 0) return
        const source = `${path[step - 1]}#${step - 1}`
        const key = `${source}>${id}`
        const link = links.get(key) ?? { source, target: id, value: 0 }
        link.value += 1
        links.set(key, link)
      })
    }

    return {
      from,
      truncated: events.length === MAX_EVENTS,
      sessions: counted,
      // Every page seen in the window, so the start control can offer real options.
      pages: [...pages].sort(),
      nodes: [...nodes.values()].sort((a, b) => a.step - b.step || b.sessions - a.sessions),
      links: [...links.values()].sort((a, b) => b.value - a.value),
    }
  },
})

export const recentSessions = query({
  args: { articleId: v.optional(v.string()), limit: v.number() },
  handler: async (ctx, args) => {
    await requireOwner(ctx)
    const limit = Math.max(1, Math.min(50, args.limit))

    const sessions = args.articleId
      ? await ctx.db
          .query('sessions')
          .withIndex('by_article_started', q => q.eq('articleId', args.articleId as string))
          .order('desc')
          .take(limit)
      : await ctx.db.query('sessions').withIndex('by_started').order('desc').take(limit)

    const out = []
    for (const session of sessions) {
      const events = await ctx.db
        .query('events')
        .withIndex('by_session_seq', q => q.eq('sessionId', session.sessionId))
        .order('asc')
        .take(200)
      out.push({
        session,
        events: events
          .filter(event => event.articleId === session.articleId)
          .map(event => ({ seq: event.seq, ts: event.ts, type: event.type, target: event.target, value: event.value })),
      })
    }
    return out
  },
})
