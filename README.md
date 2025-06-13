# Seongland

![Seongland screenshot](https://user-images.githubusercontent.com/27716524/153127047-f2b9f817-650b-4b26-8b1f-9d093b7ca7e1.png)

Portfolio site for **Seonglae Cho** built with Next.js and React Three.

## Philosophy

- Atomic Design Pattern
- Minimalism

## Tech Stack

- **Next.js** with **TypeScript**
- **Windi CSS** for styling
- **React Spring** and **React Three** for animations and 3D scenes
- **zustand** for global state
- **use-sound** for audio effects
- **Vitest** for testing

## Architecture

- `src/components` contains atomic-design layers: atoms, molecules, organisms and templates.
- `src/pages` defines the Next.js pages; `index.tsx` assembles the landing page from reusable parts.
- `scripts/` holds build helpers like `cards.ts` and `build.ts`.
- `src/store` implements lightweight state with zustand.
- Configuration values live in `site-config.js`.

## Data Flow

1. Build scripts prepare static assets and card metadata.
2. `getStaticProps` loads the cards during the build and passes them to `index.tsx`.
3. Components like `ScrollPage` react to user scroll to drive the 3D scene.
4. Background music state is shared through `usePlayStore`.

## Security

- `next.config.js` sets headers such as `X-Frame-Options`, `X-XSS-Protection`, `Access-Control-Allow-Origin` and `X-Content-Type-Options`.
- `_app.tsx` injects a strict Content Security Policy for runtime pages.

## Development

```bash
pnpm install      # install dependencies
pnpm dev          # run the development server
pnpm test         # execute unit tests
pnpm build        # build for production
pnpm start        # start the production server
pnpm lint         # run ESLint
pnpm format       # format using Prettier
```

## How to Contribute

See the [Code Structure](https://app.codesee.io/maps/public/69f7dc50-7824-11ec-9a06-254b579c0ec0) visualization for module relationships.
Pull requests are welcome—please run `pnpm lint`, `pnpm format` and `pnpm test` before submitting.

![Code Structure](https://user-images.githubusercontent.com/27716524/153126956-5aab4f44-066a-4666-a147-fedb4d15a238.png)

## Reference

- [Next Windi](https://github.com/seonglae/next-windicss)
- [Next Notion](https://github.com/transitive-bullshit/nextjs-notion-starter-kit)
