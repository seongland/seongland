# Article analytics, shared chrome, and owner dashboard

Date: 2026-08-07
Status: approved

## Problem

The seven interactive articles under `/article/<name>/` are prebuilt static HTML copied into
`public/article/` by `scripts/build-articles.sh`. They carry no analytics of any kind: no GA4, no
Vercel Web Analytics, no self-hosted counter. Article readership is therefore invisible. There is
also no owner-facing place to look at any of it, and the articles share no navigation or branding
with the rest of the site.

Three things are being built together because they all hang off the same build-time injection point:

1. Telemetry on every article page, including geo, and a private dashboard to read it.
2. Shared seongland header and footer on every article page.
3. A BibTeX copy button, which does not exist today.

## Decisions

| Question       | Decision                                                                                                                                                    |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ingest path    | Browser posts to `/api/track` (Astro route, `prerender = false`, runs as a Vercel function), which reads the Vercel edge geo headers and forwards to Convex |
| Backend        | New Convex project for seongland; auth reuses the existing Clerk instance already domain-locked to seongland.com                                            |
| Events         | Pageview, scroll depth, section reached, active dwell, interaction clicks, outbound clicks, copy, BibTeX copy, exit                                         |
| Login surface  | Hidden `/login`, dashboard at `/admin`, no entry point anywhere on the public site                                                                          |
| Article chrome | Full shared header plus the seongland footer appended after the article's own citation footer                                                               |

## Architecture

```
public/article/<name>/index.html          (prebuilt, gitignored, rewritten at build time)
  head    <base href="/article/<name>/">
          <link rel="stylesheet" href="/article-chrome.css">
          GA4 gtag snippet
          /_vercel/insights/script.js
          <script type="module" src="/telemetry.js">
          <script type="module" src="/article-chrome.js">
  body    injected seongland header (first child)
          ... article content, unchanged ...
          injected seongland footer (last child)

/telemetry.js ── batched POST (sendBeacon) ──▶ /api/track ──▶ Convex events:ingest
                                                 reads x-vercel-ip-country/-region/-city
                                                 validates, bot-filters, caps, INGEST_KEY

/login  Clerk SignIn island
/admin  ConvexProviderWithClerk + OwnerGate + dashboard (live via Convex reactivity)
```

Injection happens only during the seongland build. The article submodules are untouched, so the
standalone HuggingFace Spaces keep shipping without seongland chrome or tracking.

## Components

### 1. Shared chrome source of truth

`src/data/nav.ts` holds the nav tabs and footer links. `src/components/ui/Nav.astro` and
`src/components/ui/Footer.astro` import it, and so does the article chrome renderer, so the two
surfaces cannot drift apart on links.

`scripts/article-chrome.ts` renders the header and footer to plain HTML strings. Styling lives in
`public/article-chrome.css`, hand written because article pages do not load the site's Tailwind
bundle. Its colors come from the article template's own tokens (`--page-bg`, `--text-color`,
`--muted-color`, `--border-color`) rather than the site's cream palette, so the header and footer
sit flush with the article in both themes and carry no divider rules.
`public/article-chrome.js` wires the mobile menu, the theme toggle, and adds the BibTeX copy button.

Article pages already use `localStorage["theme"]` and `data-theme` on `<html>`, exactly like the
site, so the header toggle needs no translation layer.

Layout adjustments carried by `article-chrome.css`:

- `#theme-toggle` (the article's own absolutely positioned top-left toggle) is hidden, since the
  shared header now owns that control.
- `.table-of-contents` sticky offset moves from `32px` to `calc(32px + var(--sl-header-h))`.
- `html { scroll-padding-top: calc(var(--sl-header-h) + 8px) }` so in-page anchors clear the header.

### 2. Build-time injector

`scripts/inject-article-chrome.ts` exports a pure `injectArticleChrome(html, options)` and a CLI
wrapper. `scripts/build-articles.sh` calls the CLI instead of its current single `sed` line. Beyond
chrome and script tags, the injector fixes the `http://localhost:4321` canonical and `og:url` that
the article template currently bakes in. Injection is idempotent, guarded by a `data-sl-chrome`
marker on the header.

`asg-browser` (the sub-app at `/article/asg/browser`) gets telemetry only. It is a full-viewport
tool and a sticky header would fight its layout.

### 3. Tracker

`public/telemetry-core.js` holds the pure logic (event labeling, batching, active-time accounting,
bot heuristics) and is unit tested. `public/telemetry.js` is the side-effectful entry that wires DOM
listeners and flushes.

Envelope, so new event types never need a schema migration:

```
{ articleId, sessionId, visitorId, seq, ts, type, target?, value?, meta? }
```

| type          | source                                                                                              |
| ------------- | --------------------------------------------------------------------------------------------------- |
| `pageview`    | load: referrer, UTM, language, viewport, device class                                               |
| `scroll`      | 25 / 50 / 75 / 100 percent milestones                                                               |
| `section`     | IntersectionObserver over `section[id]`, `h2[id]`                                                   |
| `dwell`       | active-only accumulator, paused on `visibilitychange`                                               |
| `click`       | delegated on button/input/select/summary/canvas, labeled by nearest `id`, `data-*`, or `aria-label` |
| `outbound`    | anchors to external hosts                                                                           |
| `copy`        | `copy` event, records selection length                                                              |
| `bibtex_copy` | the injected copy button                                                                            |
| `exit`        | final flush with max scroll and total active ms                                                     |

`sessionId` lives in `sessionStorage`, `visitorId` (random UUID) in `localStorage`. No cookies, no
IP storage, geo stays coarse.

### 4. Ingest endpoint

`src/pages/api/track.ts`, `export const prerender = false`. Validates without a new dependency:
64KB body cap, 100 events per batch, `articleId` must be in the allowlist, unknown event types are
dropped. Reads `x-vercel-ip-country`, `-region`, `-city`. Always answers 204, so nothing about the
backend leaks. Forwards to Convex with `ConvexHttpClient` and `TRACK_INGEST_KEY`.

### 5. Convex

- `convex/schema.ts`: `sessions` (sessionId, visitorId, articleId, startedAt, lastAt, country,
  region, city, referrer, utm, device, activeMs, maxScroll, completed, bot) indexed by
  `articleId + startedAt` and by `sessionId`; `events` (sessionId, articleId, seq, ts, type, target,
  value, meta) indexed by `sessionId + seq` and `articleId + ts`.
- `convex/events.ts`: `ingest` mutation, gated on `TRACK_INGEST_KEY`, upserts the session and
  appends events.
- `convex/stats.ts`: owner-gated queries for the dashboard (overview, per-article detail, journey
  edges, recent sessions).
- `convex/auth.ts`: `requireOwner` keyed on `SEONGLAND_OWNER_EMAIL`, mirroring
  `../letter-automation/convex/auth.ts`.
- `convex/auth.config.ts`: Clerk bridge on `CLERK_ISSUER_URL`, empty providers when unset so a
  fresh checkout still builds.

No rollup tables. At this traffic volume indexed range queries are enough, and rollups can be added
later if they get slow.

### 6. Dashboard

`/admin` mounts one `client:only` React island: `ClerkProvider` → `SignedOut`/`SignedIn` →
`ConvexProviderWithClerk` → `OwnerGate` → dashboard. A signed-in non-owner sees a card with their
identity claims and a sign-out button rather than a crash, which is the letter-automation pattern.

Views:

- Overview: per-article visitors, views, median active read time, completion rate, geo table,
  referrers.
- Article detail: scroll funnel, section drop-off, interaction leaderboard, BibTeX copies, outbound
  clicks.
- Journey: aggregate flow graph (nodes are sections in document order, edge width is session count,
  drop-off stub per node) plus an expandable per-session tree. Rendered as plain SVG, since document
  order gives a natural column layout and no graph library is needed.

## Environment

Site (`.env.local` and Vercel):

```
PUBLIC_CONVEX_URL              https://<deployment>.convex.cloud
PUBLIC_CLERK_PUBLISHABLE_KEY   pk_live_... (existing seongland.com Clerk instance)
CONVEX_URL                     same as PUBLIC_CONVEX_URL, used server side by /api/track
TRACK_INGEST_KEY               shared secret
PUBLIC_GA_ID                   G-CRRP8E78TC
```

Convex deployment:

```
CLERK_ISSUER_URL               copied from letter-automation
SEONGLAND_OWNER_EMAIL          sungle3737@gmail.com
TRACK_INGEST_KEY               same shared secret
```

Every piece degrades safely when its variable is missing: the tracker no-ops without an ingest
target, `/api/track` returns 204 without writing, `/admin` shows a configuration notice instead of
crashing.

## Error handling

Telemetry never throws into the page: the entry wraps setup in try/catch and a failed flush is
dropped, not retried into a loop. `/api/track` swallows Convex errors and still returns 204. The
dashboard treats `undefined` query results as loading and empty arrays as no data.

## Testing

- `test/telemetry-core.test.ts`: labeling, batching, active-time accounting, bot heuristics.
- `test/inject-article-chrome.test.ts`: injection against a fixture article head/body, idempotency,
  canonical rewrite, base href preservation.
- `test/track-endpoint.test.ts`: handler with mocked geo headers, oversize body, unknown article,
  missing env.
- `test/build.test.ts`: extended to assert every built article carries all injected pieces.

## Out of scope

Provisioning the Convex deployment and setting Clerk and Vercel environment variables require the
owner's accounts and are documented as a setup step rather than automated here.
