# 安全性紀錄

[English](security-log.md) | 繁體中文

- 日期: 2026-10-25
- 分支: `fix/security-upgrades`
- 範圍: `package.json`、`bun.lock`、`src/`

## 摘要

依賴全部升級，修正 greet 範例的 XSS，並加上書籍 id 驗證。仍有一個專案實際用不到的建置工具漏洞，且書籍 API 仍沒有身分驗證。

## 修改內容

| 項目 | 修改前 | 修改後 | 原因 |
|---|---|---|---|
| hono | 4.9.9 | 4.13.14 | 多個漏洞 |
| drizzle-orm | 0.44.5 | 0.45.4 | SQL injection 漏洞 |
| vite | 7.1.7 | 8.3.5 | 開發伺服器任意讀檔、路徑穿越漏洞 |
| wrangler | 4.40.2 | 4.152.0 | 更新 |
| zod / @hono/zod-validator | 4.1.11 / 0.7.3 | 4.6.7 / 0.9.1 | 更新 |
| undici (override) | 7.14.0 | 7.30.1 | miniflare 固定了有漏洞的 undici |
| dotenv | dependency | devDependency | 只有 `drizzle.config.ts` 使用 |
| `src/greet.ts` | raw template string | hono `html` tag | `:name` 參數未經跳脫直接放進 HTML（XSS） |
| `src/book.ts` | any `:id` | UUID validated with zod | 不合法的 id 回應 400，不再造成資料庫錯誤 |
| simple.css | unversioned cdn.simplecss.org | jsDelivr 2.3.7 + SRI | 固定版本並加上完整性雜湊 |

## 尚未解決的問題

### 被上游限制的套件版本

| 套件 | 版本 | 漏洞 | 無法修正的原因 | 影響與因應 |
|---|---|---|---|---|
| esbuild | 0.18.20 | GHSA-67mh-4wv8-2f99（0.25.0 修正） | drizzle-kit 使用的已棄用 `@esbuild-kit` 載入器要求此版本。 | 漏洞在 esbuild 的開發伺服器，而該載入器不會啟動它，實際上沒有影響。 |

### 需要修改程式才能解決

- `/book` API 沒有身分驗證，任何能連到的人都可以新增、修改、刪除書籍。公開部署前請加上驗證 middleware。

## 驗證方式

- `vite build`（client 與 worker）成功。
- `wrangler pages dev` 能提供頁面與靜態資源；不合法的 id 與 body 回應 400。
- greet 會跳脫 `<script>` 輸入。
- `drizzle-kit generate` 顯示 schema 沒有變動。

## 未驗證項目

- 對實際 Neon 資料庫的查詢（測試環境無法連線）。
