# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Development server on port 8080
pnpm build        # Full build (scripts + Next.js)
pnpm test         # Run Vitest tests (watch mode)
pnpm coverage     # Run tests with coverage report
pnpm lint         # ESLint with auto-fix
pnpm format       # Prettier formatting
```

## Architecture

This is a Next.js 15 portfolio site with React Three Fiber for 3D animations. It uses Static Site Generation (SSG) - no API routes.

### Component Structure (Atomic Design)

- `src/components/atoms/` - Basic UI elements (ThemeBtn, GridTitle, SpringCard)
- `src/components/molecules/` - Composite components (Header, Footer, Stars, Wall)
- `src/components/organisms/` - Complex sections (Cards, ScrollSpace)
- `src/components/templates/` - Page layouts (ScrollPage wraps content in Three.js Canvas)

### Key Data Flow

1. `scripts/cards.ts` defines project card metadata with static image imports
2. `getStaticProps` in `src/pages/index.tsx` loads cards at build time
3. `ScrollPage` template integrates Three.js Canvas with scroll-driven animations
4. `usePlayStore` (zustand) manages global audio playback state

### Path Aliases

- `@/*` → `./src/*`
- `~/*` → `./`
- `lib/*` → `./lib/*`

## Styling

Uses Tailwind CSS v4 with standard className syntax:

```tsx
<div className="p-4 mx-auto dark:text-white flex-col-reverse">
```

Dark mode via `dark:` prefix. Responsive via `max-sm:`, `max-md:`, `max-lg:` prefixes (mobile-first).

## Key Patterns

- Theme management: `next-themes` with flash prevention script in `_document.tsx`
- 3D scenes: `@react-three/fiber` + `@react-three/drei` + `@react-spring/three`
- Animations: React Spring connects scroll position to 3D transforms via `ScrollControls`
- Pre-commit hooks (Husky): runs `pnpm format && pnpm lint` automatically

## Configuration

- Site metadata: `site-config.js` (pulls from `package.json`)
- Security headers: `next.config.js` (X-Frame-Options, CSP, HSTS)
- TypeScript: strict mode enabled
- Node version: >=24.12.0
