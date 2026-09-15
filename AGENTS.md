# AGENTS.md

Guidance for AI agents working in this repository.

## What this is

SENTRY — a portfolio-quality security SaaS concept (fictional product, simulated data). Marketing homepage plus a security operations workspace: incidents, assets, team, settings. Stack: React 19, Vite 7, TypeScript (strict), React Router 7, Tailwind CSS 4, Lucide icons. No backend — data is mocked, but structured for a real API.

## Commands

`package.json` is the source of truth:

- `npm run dev` — dev server (must be running for the scripts below)
- `npm run build` — `tsc -b && vite build`; type errors fail the build, so run this before finishing any change
- `node scripts/smoke.mjs` — headless Chrome loads every route at 1440/768/390px and fails on any console/page error
- `node scripts/check-overflow.mjs` — asserts `document.documentElement.scrollWidth` equals the viewport width at 390px on every route (the smoke test catches errors but not overflow)
- `node scripts/shots.mjs` — regenerates `screenshots/` (portfolio JPEGs); keep them current after visual changes
- All three scripts need the dev server on `localhost:5173` and local Chrome (`puppeteer-core`)

## Architecture (do not break these seams)

- `src/types/index.ts` — the data model. Entities: User, Incident, Asset, Notification, Activity, Workspace, ApiKey.
- `src/data/mock.ts` — seed dataset. Dates are generated relative to load time (`daysAgo`/`hoursAgo`) so the demo always looks live.
- `src/lib/api.ts` — the only place allowed to "talk to a backend". Every call is async and returns fresh clones. To connect a real REST API, replace these bodies with `fetch()`; pages and the store must not change.
- `src/lib/store.tsx` — single `StoreProvider` holding all app state plus optimistic actions (status changes, invites, notifications, toasts). Add mutations here, not in pages.
- `src/lib/status.ts` — severity/status/risk/role → visual token maps. Badge and dot styling for any entity lives here, not inline.
- Path alias `@/*` is wired in **both** `tsconfig.json` (paths) and `vite.config.ts` (resolve.alias) — update both together.

## Design system rules

The visual direction is Linear × Vercel: calm, neutral, precise.

- Neutrals only (`zinc`) for chrome, text, and surfaces. **Color communicates security status and severity only**: red = critical/open, orange = high, amber = medium/investigating, emerald = healthy/resolved, sky = contained/info. Never introduce accent colors for decoration.
- In dense lists (tables, feeds), severity keeps its colored badge; incident status renders as a neutral dot + text (`IncidentStatusText` in `src/components/app/Badges.tsx`), so the eye reads severity, not two competing pills per row. Colored status pills are reserved for detail panels.
- No gradients, no glassmorphism, no neon, no decorative illustrations. Buttons and primary elements are flat zinc-950; surfaces are white with `border-zinc-200` hairlines and minimal shadows.
- Sharp-but-soft geometry: `rounded-md`/`rounded-lg` only; avoid pill-shaped cards. Badges may use `rounded-full`.
- Icons come from `lucide-react` at `size={15–17} strokeWidth={1.8}`, wrapped in `aria-hidden`.
- New reusable UI goes in `src/components/ui/`; page-specific composition in the page or its feature folder (`src/components/incidents/`, `assets/`, `landing/`).

## Conventions

- TypeScript is strict with `noUnusedLocals`/`noUnusedParameters` — no dead imports or variables.
- Reuse before creating: check `src/components/ui/` for Button, Badge, Panel, Input/Select/Field, Modal/Drawer, Menu, Avatar, EmptyState, Toaster before writing new markup. Duplicate table/card layouts deliberately (desktop table + mobile card list is the established responsive pattern).
- Charts are hand-rolled SVG (`src/components/charts/`) with `role="img"` + `aria-label` summarizing the data. Keep that pattern instead of adding a chart library.
- Numbers users compare go in `tabular` (tabular-nums) and `font-mono` for IDs.
- Dates render through `relativeTime`/`formatDate`/`formatDateTime` from `src/lib/utils.ts` — never raw ISO strings.
- Toast feedback for every user-triggered mutation (`toast()` from `useStore`).
- Accessibility: semantic elements, labeled controls (`aria-label` on icon-only buttons and unlabeled selects), visible focus (`:focus-visible` is global), keyboard dismissal for Modal/Drawer/Menu (handled by `useDismiss`).
- Every page calls `usePageTitle(title)`; the landing page also sets the meta description.

## Gotchas

- Tailwind is v4: theme tokens live in `src/index.css` under `@theme`; fractional utilities like `h-9.5` and `size-4.5` are valid.
- Grid/flex children containing truncate rows need `min-w-0` on the item, or min-content sizing overflows the viewport on mobile (this bit the dashboard already — re-check with the smoke test after layout changes).
- `Drawer`/`Modal` call `useDismiss` **before** any conditional return — keep hooks above early returns.
- `api.ts` mock latency exists to surface loading states; the app shell gates on it (`loading`/`error` in the store). Don't render store data outside the `AppShell` gate.
- Demo mutations persist as patches under the `sentry.demo.v1` localStorage key (`src/lib/store.tsx`) and are re-applied onto a fresh bootstrap on load — persist deltas, never full entities, so relative mock dates stay live. `resetDemo()` clears the key and reloads.

## Verification loop

For any change that affects rendering: `npm run build` must pass, then run the smoke test. After layout or responsive changes, also confirm `document.documentElement.scrollWidth` equals the viewport width at 390px (`scripts/check-overflow.mjs`; the smoke test catches errors but not overflow; a full-page screenshot wider than the viewport is the tell).
