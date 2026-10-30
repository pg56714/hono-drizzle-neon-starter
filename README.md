# hono-drizzle-neon-starter

> **Security:** see [SECURITY.md](SECURITY.md) for known dependency issues.

A serverless API starter on Cloudflare Workers with Hono, Drizzle ORM, and Neon Postgres—Type-safe schema, edge-first routing, and zero-cold-start DX.

![repo preview](./assets/01.png)

```txt
bun install
bun run dev
```

```txt
bun run build
bun run preview
bun run deploy
```

---

```ts
bun i zod
bun i @hono/zod-validator
```

zod → The core validation library (for defining schemas).

@hono/zod-validator → Hono’s glue code that connects those schemas to route requests.

File creation order: index -> book -> client

connect to neon postgresql

```ts
bun i drizzle-orm @neondatabase/serverless
bun i -D drizzle-kit dotenv
```

```
bun run db:generate to generate the schema
bun run db:migrate to migrate the schema
```

Copy `.dev.vars.sample` to `.dev.vars` and set `DATABASE_URL` (used by `bun run dev`, `wrangler pages dev` and drizzle-kit). In production, set it as a Cloudflare secret instead of committing it.

## Notes

- `/book/:id` only accepts UUIDs (validated with zod before querying the database).
- The `/book` API has no authentication; add auth middleware before exposing it publicly.
