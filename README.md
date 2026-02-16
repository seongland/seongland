# Seongland

Portfolio site for **Seonglae Cho** — Research & Engineering.

## Tech Stack

- **Astro 5** with static site generation
- **React Three Fiber** for 3D star background
- **Tailwind CSS v4** for styling
- **Vitest** for testing
- **Vercel** for deployment with analytics and speed insights

## Architecture

- `src/components/sections/` — Page sections (Welcome, Hero, News, SelectedWorks)
- `src/components/three/` — React Three Fiber 3D components
- `src/components/ui/` — Reusable UI components (Nav, Footer, Cards)
- `src/pages/` — Astro pages (index, publications, projects, apps, articles)
- `src/content/articles/` — MDX article content collection
- `src/data/` — Card metadata and profile data
- `scripts/` — Build helpers (article submodule builder)

## Development

```bash
pnpm install      # install dependencies
pnpm dev          # dev server on port 8080
pnpm build        # build (articles + astro)
pnpm preview      # preview built output
pnpm test         # run tests
pnpm lint         # eslint
pnpm format       # prettier
```

## Article Submodules

Interactive articles (e.g. CorrSteer) are built from git submodules at build time via `scripts/build-articles.sh`. Each `*-article` directory is built with the correct `base` path and copied to `public/article/<name>/`.
