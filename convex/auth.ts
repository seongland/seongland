import type { MutationCtx, QueryCtx } from './_generated/server'

type AuthCtx = QueryCtx | MutationCtx

export interface Identity {
  subject: string
  email?: string
  name?: string
}

/**
 * The dashboard is single-owner. Ownership is decided by SEONGLAND_OWNER_EMAIL
 * (preferred) or SEONGLAND_OWNER_USER_ID on the Convex deployment. With neither
 * set the deployment is unconfigured and any authenticated identity is accepted,
 * which is what a fresh local deployment wants. Use `whoami` to read the claims
 * a token actually carries before pinning one.
 */
export async function requireOwner(ctx: AuthCtx): Promise<string> {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) throw new Error('not authenticated')

  const ownerEmail = process.env.SEONGLAND_OWNER_EMAIL
  const ownerId = process.env.SEONGLAND_OWNER_USER_ID
  if (!ownerEmail && !ownerId) return identity.subject

  const email = typeof identity.email === 'string' ? identity.email.toLowerCase() : undefined
  if (ownerEmail && email === ownerEmail.toLowerCase()) return identity.subject
  if (ownerId && identity.subject === ownerId) return identity.subject
  throw new Error('forbidden')
}

export function requireIngestKey(key: string): void {
  const expected = process.env.TRACK_INGEST_KEY
  if (!expected) throw new Error('TRACK_INGEST_KEY not configured')
  if (key !== expected) throw new Error('forbidden')
}
