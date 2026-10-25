# Security Log

English | [繁體中文](security-log.zh-TW.md)

- Date: 2026-10-25
- Branch: `fix/security-upgrades`
- Scope: `package.json`, `bun.lock`, `src/`

## Summary

All dependencies were upgraded, an XSS in the greet example was fixed, and book ids are now validated. One build-tool advisory remains that the project does not exercise, and the book API still has no authentication.

## Changes

| Item | Before | After | Reason |
|---|---|---|---|
| hono | 4.9.9 | 4.13.14 | Multiple advisories |
| drizzle-orm | 0.44.5 | 0.45.4 | SQL injection advisory |
| vite | 7.1.7 | 8.3.5 | Dev server file read / path traversal advisories |
| wrangler | 4.40.2 | 4.152.0 | Refreshed |
| zod / @hono/zod-validator | 4.1.11 / 0.7.3 | 4.6.7 / 0.9.1 | Refreshed |
| undici (override) | 7.14.0 | 7.30.1 | miniflare pins a vulnerable undici |
| dotenv | dependency | devDependency | Only `drizzle.config.ts` uses it |
| `src/greet.ts` | raw template string | hono `html` tag | The `:name` parameter was inserted into HTML unescaped (XSS) |
| `src/book.ts` | any `:id` | UUID validated with zod | Invalid ids now return 400 instead of a database error |
| simple.css | unversioned cdn.simplecss.org | jsDelivr 2.3.7 + SRI | Pinned version with an integrity hash |

## Remaining issues

### Dependency versions held back upstream

| Package | Version | Advisories | Why it is not fixed | Impact and mitigation |
|---|---|---|---|---|
| esbuild | 0.18.20 | GHSA-67mh-4wv8-2f99 (fixed in 0.25.0) | Required by drizzle-kit's deprecated `@esbuild-kit` loader. | The advisory concerns esbuild's development server, which that loader never starts. No practical impact. |

### Requires code changes

- The `/book` API has no authentication: anyone who can reach it can create, update and delete books. Add auth middleware before deploying it publicly.

## How it was verified

- `vite build` (client and worker) succeeds.
- `wrangler pages dev` serves the page and static assets; invalid ids and bodies return 400.
- greet escapes `<script>` input.
- `drizzle-kit generate` reports no schema changes.

## Not verified

- Queries against a real Neon database (not reachable from the test environment).
