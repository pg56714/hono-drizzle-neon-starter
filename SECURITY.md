# Security

## Known issues

Last checked: 2026-10-30.

| Package | Version | Fixed in | Held back by | Impact and mitigation |
|---|---|---|---|---|
| esbuild | 0.18.20 | 0.25.0 | drizzle-kit's deprecated `@esbuild-kit` loader | The advisory (GHSA-67mh-4wv8-2f99) concerns esbuild's development server, which that loader never starts. No practical impact. |

## No authentication on `/book`

Anyone who can reach the `/book` API can create, update and delete books. Add auth middleware before deploying it publicly.
