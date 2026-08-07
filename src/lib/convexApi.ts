// Typed references to the Convex functions, declared by name so neither the
// site build nor the endpoint depends on `convex/_generated` being present.
// The shapes here are the contract with convex/stats.ts and convex/events.ts.

import { makeFunctionReference } from 'convex/server'

export interface Tally {
  name: string
  count: number
}

export interface Summary {
  sessions: number
  visitors: number
  medianActiveMs: number
  medianScroll: number
  completionRate: number
}

export interface WhoAmI {
  authenticated: boolean
  isOwner: boolean
  configured: boolean
  subject?: string
  email?: string
  name?: string
}

export interface Overview {
  from: number
  truncated: boolean
  totals: Summary
  articles: (Summary & { articleId: string })[]
  countries: Tally[]
  cities: Tally[]
  referrers: Tally[]
  devices: Tally[]
  daily: { day: string; count: number }[]
}

export interface ArticleDetail {
  from: number
  truncated: boolean
  summary: Summary
  scroll: { milestone: number; sessions: number }[]
  sections: Tally[]
  interactions: Tally[]
  outbound: Tally[]
  bibtexCopies: number
  countries: Tally[]
}

export interface Journey {
  from: number
  truncated: boolean
  sessions: number
  nodes: { id: string; sessions: number; exits: number; order: number }[]
  edges: { from: string; to: string; count: number }[]
}

export interface SessionEvent {
  seq: number
  ts: number
  type: string
  target?: string
  value?: number | string
}

export interface RecentSession {
  session: {
    _id: string
    sessionId: string
    visitorId: string
    articleId: string
    startedAt: number
    lastAt: number
    country?: string
    region?: string
    city?: string
    referrer?: string
    device?: string
    activeMs: number
    maxScroll: number
    deepestSection?: string
    completed: boolean
  }
  events: SessionEvent[]
}

export interface IngestArgs {
  ingestKey: string
  articleId: string
  sessionId: string
  visitorId: string
  country?: string
  region?: string
  city?: string
  events: { type: string; ts: number; target?: string; value?: number | string; meta?: unknown }[]
}

export const statsApi = {
  whoami: makeFunctionReference<'query', Record<string, never>, WhoAmI>('stats:whoami'),
  overview: makeFunctionReference<'query', { days: number }, Overview>('stats:overview'),
  articleDetail: makeFunctionReference<'query', { articleId: string; days: number }, ArticleDetail>('stats:articleDetail'),
  journey: makeFunctionReference<'query', { articleId: string; days: number }, Journey>('stats:journey'),
  recentSessions: makeFunctionReference<'query', { articleId?: string; limit: number }, RecentSession[]>(
    'stats:recentSessions',
  ),
}

export const eventsApi = {
  ingest: makeFunctionReference<'mutation', IngestArgs, { accepted: number }>('events:ingest'),
}
