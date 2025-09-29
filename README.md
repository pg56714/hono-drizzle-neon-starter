# hono-drizzle-neon-starter

A serverless API starter on Cloudflare Workers with Hono, Drizzle ORM, and Neon Postgres—Type-safe schema, edge-first routing, and zero-cold-start DX.

```txt
bun install
bun run dev
```

```txt
bun run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
bun run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>();
```

---

```ts
bun i zod
bun i @hono/zod-validator
```

zod → The core validation library (for defining schemas).

@hono/zod-validator → Hono’s glue code that connects those schemas to route requests.

File creation order: index -> book -> client
