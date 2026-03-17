# AGENTS.md

## Repo quick facts
- Next.js 14 App Router project.
- Styling: Tailwind tokens in `tailwind.config.ts` + base utilities in `app/globals.css`.
- Scroll/animation: Lenis + GSAP ScrollTrigger.
- State: Zustand persisted to `sessionStorage`.
- Charts: Recharts.

## Common commands
```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
```

## Notes
- Satoshi is self-hosted via `next/font/local` from `public/fonts/satoshi/*.woff2` (no `@fontsource/satoshi` package).
- `/tests/[id]` is a fixed layout page and disables Lenis using the Lenis manager context.
