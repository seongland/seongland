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
  bounceRate: number
  events: number
}

export interface Place {
  lat: number
  lon: number
  city?: string
  country?: string
  sessions: number
}

export interface FlowNode {
  id: string
  page: string
  step: number
  sessions: number
  exits: number
}

export interface Flow {
  from: number
  truncated: boolean
  sessions: number
  pages: string[]
  nodes: FlowNode[]
  links: { source: string; target: string; value: number }[]
}

export interface JourneyEvent {
  seq: number
  ts: number
  type: string
  page: string
  target?: string
  value?: number | string
}

export interface SessionJourney {
  sessionId: string
  visitorId?: string
  country?: string
  city?: string
  ip?: string
  device?: string
  language?: string
  referrer?: string
  startedAt: number
  activeMs: number
  pages: { page: string; startedAt: number; activeMs: number; maxScroll: number }[]
  events: JourneyEvent[]
}

export interface RecentRow {
  _id: string
  sessionId: string
  articleId: string
  startedAt: number
  activeMs: number
  maxScroll: number
  completed: boolean
  city?: string
  region?: string
  country?: string
  ip?: string
  device?: string
  referrer?: string
  language?: string
  visitorId: string
  owner: boolean
  excluded: boolean
}

export interface Exclusions {
  excludeOwner: boolean
  excludedIps: string[]
  excludedVisitors: string[]
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
  excludedCount: number
  totals: Summary
  articles: (Summary & { articleId: string; returning: number; fresh: number })[]
  geo: { country: string; sessions: number; cities: { city: string; sessions: number }[] }[]
  countries: Tally[]
  cities: Tally[]
  referrers: Tally[]
  devices: Tally[]
  languages: Tally[]
  timezones: Tally[]
  daily: { day: string; count: number }[]
  /** Sessions per UTC weekday (0 = Sunday) by hour. */
  hourly: number[][]
  places: Place[]
  scatter: { activeMs: number; maxScroll: number; articleId: string }[]
  depth: { bucket: number; count: number }[]
  visitors: { returning: number; fresh: number }
  recent: RecentRow[]
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
  places: Place[]
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
  ip?: string
  latitude?: number
  longitude?: number
  timezone?: string
  owner?: boolean
  events: { type: string; ts: number; target?: string; value?: number | string; meta?: unknown }[]
}

export const statsApi = {
  whoami: makeFunctionReference<'query', Record<string, never>, WhoAmI>('stats:whoami'),
  overview: makeFunctionReference<'query', { days: number; includeExcluded?: boolean }, Overview>('stats:overview'),
  getExclusions: makeFunctionReference<'query', Record<string, never>, Exclusions>('stats:getExclusions'),
  setExclusions: makeFunctionReference<'mutation', Exclusions, Exclusions>('stats:setExclusions'),
  articleDetail: makeFunctionReference<
    'query',
    { articleId: string; days: number; includeExcluded?: boolean },
    ArticleDetail
  >('stats:articleDetail'),
  journey: makeFunctionReference<'query', { articleId: string; days: number }, Journey>('stats:journey'),
  flow: makeFunctionReference<'query', { days: number; start?: string; includeExcluded?: boolean }, Flow>('stats:flow'),
  sessionJourney: makeFunctionReference<'query', { sessionId: string }, SessionJourney>('stats:sessionJourney'),
  recentSessions: makeFunctionReference<'query', { articleId?: string; limit: number }, RecentSession[]>(
    'stats:recentSessions',
  ),
}

export const eventsApi = {
  ingest: makeFunctionReference<'mutation', IngestArgs, { accepted: number }>('events:ingest'),
}
