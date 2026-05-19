# Nexus Reader

A mobile fanfiction and web novel reader app with a smart fandom shelf engine, local SQLite database, and a richly-organized multi-lane dashboard.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Mobile: React Native + Expo SDK 54, Expo Router
- Local DB: expo-sqlite (native) / AsyncStorage (web fallback)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/nexus-reader/` — Expo mobile app
  - `lib/database.ts` — AsyncStorage implementation (web)
  - `lib/database.native.ts` — expo-sqlite implementation (iOS/Android)
  - `lib/nexusEngine.ts` — Fandom shelf computation (Nexus Algorithm)
  - `hooks/useLibrary.ts` — React hook for library state
  - `components/BookCard.tsx` — Animated book card with needsReview glow
  - `components/ShelfLane.tsx` — Horizontal scrolling lane
  - `components/SplitShelf.tsx` — Fandom shelf with Active + To-Read sub-tracks
  - `components/SeriesCluster.tsx` — Series cluster container
  - `app/(tabs)/index.tsx` — Dashboard home screen
  - `app/(tabs)/library.tsx` — Library screen with search/filter

## Architecture decisions

- **Platform-specific DB files**: `database.native.ts` (SQLite) and `database.ts` (AsyncStorage). Metro automatically picks the correct one per platform. This avoids the `.wasm` bundling issue expo-sqlite has on web.
- **Nexus Algorithm**: Fic with 2+ fandoms is mirrored across individual fandom shelves AND a new auto-generated "Nexus — A × B" crossover shelf (fandoms sorted alphabetically).
- **Series Clustering**: If 3+ fics globally share a `seriesName`, they collapse into a `SeriesCluster` component inside their fandom shelf, sorted by `seriesOrder ASC`.
- **Split-Shelf Layout**: Each fandom shelf has two sub-tracks — Active (Currently Reading/Read, by `lastReadTimestamp DESC`) and To-Read (Unread, by `dateDownloaded DESC`).
- **"Original Fiction" override**: Fics with `shelves = []` or containing "original work" bypass all fandom matrix logic.

## Product

- **Dashboard**: 4 fixed lanes (New Updates with glow, Currently Reading, Recently Read, Read This Month) + dynamically computed fandom shelves below.
- **Fandom Shelves**: Per-fandom split views with Nexus crossover detection and series clustering.
- **Library**: Full searchable/filterable list of all works with status chips.
- **Local-first**: All data stored in expo-sqlite on device. No server required for core reading experience.

## User preferences

_Populate as you build._

## Gotchas

- expo-sqlite requires platform-specific files due to `.wasm` bundling issues in Metro on web.
- The `initDatabase()` call is idempotent — seeds only if DB is empty.
- Always run `pnpm install` from workspace root after adding new dependencies to any artifact.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
