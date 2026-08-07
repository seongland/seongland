# Convex backend for article analytics

Stores what `/api/track` collects from article pages and serves the owner-only
dashboard at `/admin`.

| File | Role |
| --- | --- |
| `schema.ts` | `sessions` (one row per article visit) and `events` (the ordered stream) |
| `events.ts` | `ingest`, the only writer, gated on `TRACK_INGEST_KEY` |
| `stats.ts` | `whoami` (ungated) plus the owner-gated dashboard queries |
| `auth.ts` | `requireOwner`, and the ingest key check |
| `auth.config.ts` | Clerk bridge on `CLERK_ISSUER_URL` |

`_generated/` is produced by the Convex CLI and is not needed by the site build:
`src/lib/convexApi.ts` addresses these functions by name through
`makeFunctionReference`, so `pnpm build` never depends on codegen having run.

## First-time setup

```bash
npx convex dev            # creates the deployment, writes CONVEX_DEPLOYMENT, generates _generated/

npx convex env set CLERK_ISSUER_URL      "<same value as letter-automation>"
npx convex env set SEONGLAND_OWNER_EMAIL "sungle3737@gmail.com"
npx convex env set TRACK_INGEST_KEY      "<random secret>"

npx convex deploy         # production
```

Then give the site the matching variables (local `.env.local` and Vercel):

```
PUBLIC_CONVEX_URL=https://<deployment>.convex.cloud
PUBLIC_CLERK_PUBLISHABLE_KEY=<existing seongland.com Clerk key>
CONVEX_URL=https://<deployment>.convex.cloud
TRACK_INGEST_KEY=<the same secret>
```

Until `SEONGLAND_OWNER_EMAIL` (or `SEONGLAND_OWNER_USER_ID`) is set, any
authenticated identity is treated as the owner. Sign in once and read the claims
off `/admin`, which prints them when access is refused, then pin the value.
