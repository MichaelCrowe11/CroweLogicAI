# CroweLogicAI

CroweLogicAI is an unfinished Next.js app from mid 2025 with a mushroom cultivation chat that calls OpenAI and a grow log stored in Upstash Redis.

## Status

`experimental`

Work stopped on 2025-06-18. First commit 2025-05-19, 29 commits on `main`. Three `codex/` branches and one dependabot branch were pushed later and never merged.

What does not work:

- `pnpm install` fails. `pnpm-lock.yaml` is lockfile version 6.0 and current pnpm refuses it. The CI workflow pins pnpm 8.
- `npm run build` fails without `OPENAI_API_KEY`: `lib/openai-config.ts` throws at import time, and Next.js imports it while collecting page data for `/api/test-openai`.
- `npm run build` fails even with the key set: `app/chat/page.tsx` calls `useSearchParams()` without a Suspense boundary, so prerendering `/chat` aborts the build.
- Every API route returns HTTP 500 unless `KV_REST_API_URL` and `KV_REST_API_TOKEN` point at an Upstash Redis database. `lib/redis.ts` falls back to empty strings and fails on "Invalid URL".
- `lib/auth.ts` reads `cookies()` synchronously. Next.js 15 logs an error for this on every API call.
- `next.config.mjs` turns off type checking and lint during builds, so the CI workflow's `pnpm lint` and `pnpm build` are the only checks and they do not run on `main` pushes.

## Install and first run

Run on 2026-09-11 with Node 26.5.0 and npm.

```
npm ci
OPENAI_API_KEY=placeholder npx next dev -p 3119
```

Output:

```
Ready in 1277ms
$ curl http://127.0.0.1:3119/            -> HTTP 200, page title from app/layout.tsx
$ curl http://127.0.0.1:3119/dashboard   -> HTTP 200
$ curl http://127.0.0.1:3119/chat        -> HTTP 200
$ curl http://127.0.0.1:3119/api/chats   -> {"error":"Failed to fetch chats"} HTTP 500
$ curl http://127.0.0.1:3119/api/farms   -> {"error":"Failed to fetch farms"} HTTP 500
```

Also run, and failed:

```
pnpm install --frozen-lockfile
 ERR_PNPM_LOCKFILE_BREAKING_CHANGE  Lockfile pnpm-lock.yaml not compatible with current pnpm

npm run build
Error: OPENAI_API_KEY environment variable is required
[Error: Failed to collect page data for /api/test-openai]

OPENAI_API_KEY=placeholder npm run build
 ⨯ useSearchParams() should be wrapped in a suspense boundary at page "/chat"
Export encountered an error on /chat/page: /chat, exiting the build.
```

Not run: `scripts/setup.sh` (it scaffolds a new project with `npx create-next-app@latest` and `pnpm add` of packages that are not in this repository's lockfile); `npm run docker:build` (no Dockerfile exists in the repository); a chat with a real OpenAI key or a real Upstash database.

## What runs today

- The dev server renders the home page, `/dashboard`, `/chat`, `/farm`, `/tasks`, `/scanner`, `/analyze` and `/settings` from `app/`.
- API routes in `app/api/` (`chat`, `chats`, `farms`, `tasks`, `analyze`, `strains/recommend`, `test-openai`) exist and respond, but only with errors until Redis and OpenAI variables are set. Not verified with real credentials.
- `lib/ai.ts` builds prompts and calls `gpt-4o` through Vercel's SDK (`streamText`, `generateObject`) for chat, image assessment, strain suggestions and daily task lists.
- There are no tests in the repository.

## Roadmap

- Wrap the `useSearchParams()` call in `app/chat/page.tsx` in a Suspense boundary so `next build` completes.
- Stop throwing at import time in `lib/openai-config.ts`; check the key inside the request handler.
- `await cookies()` in `lib/auth.ts`.
- Regenerate or delete `pnpm-lock.yaml`; keep one lockfile.
- Pin the six dependencies that use the range `latest` in `package.json`.

## Limits

- This is a prototype. It has no accounts. `lib/auth.ts` identifies a visitor by a random `userId` cookie, so anyone holding that cookie sees that visitor's chats, farms and tasks.
- The chat, image assessment and strain suggestions are text generated from prompts in `lib/ai.ts`. They are not measurements, tests or inspections. Do not use them to decide whether a culture is contaminated or safe to eat.
- Do not store real farm records in it.
- `vercel.json` references environment secrets by name; no deployment URL is recorded in the repository.
- `ROADMAP.md` describes modules (MycoIntel, LabFlow, EcoLogic, BizGenesis) that do not exist in the code.

## License and contact

MIT. See `LICENSE`.

Contact: michael@crowelogic.com
