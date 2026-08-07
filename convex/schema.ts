import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

// One row per article visit, plus the raw ordered event stream behind it. The
// event envelope stays generic so a new event type never needs a migration.
export default defineSchema({
  sessions: defineTable({
    sessionId: v.string(),
    visitorId: v.string(),
    articleId: v.string(),
    startedAt: v.number(),
    lastAt: v.number(),
    country: v.optional(v.string()),
    region: v.optional(v.string()),
    city: v.optional(v.string()),
    referrer: v.optional(v.string()),
    language: v.optional(v.string()),
    device: v.optional(v.string()),
    viewport: v.optional(v.string()),
    utm: v.optional(v.record(v.string(), v.string())),
    eventCount: v.number(),
    activeMs: v.number(),
    maxScroll: v.number(),
    deepestSection: v.optional(v.string()),
    completed: v.boolean(),
  })
    // A tab (one sessionId) can read several articles, so the pair is the key.
    .index('by_session_article', ['sessionId', 'articleId'])
    .index('by_article_started', ['articleId', 'startedAt'])
    .index('by_started', ['startedAt']),

  events: defineTable({
    sessionId: v.string(),
    articleId: v.string(),
    seq: v.number(),
    ts: v.number(),
    type: v.string(),
    target: v.optional(v.string()),
    value: v.optional(v.union(v.number(), v.string())),
    meta: v.optional(v.any()),
  })
    .index('by_session_seq', ['sessionId', 'seq'])
    .index('by_article_ts', ['articleId', 'ts'])
    .index('by_article_type', ['articleId', 'type']),
})
