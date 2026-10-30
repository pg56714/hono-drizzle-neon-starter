import { createMiddleware } from "hono/factory";
import { timingSafeEqual } from "hono/utils/buffer";

// Requires "Authorization: Bearer <API_TOKEN>". Without API_TOKEN configured, every request is rejected.
export const requireToken = createMiddleware<{
  Bindings: { API_TOKEN?: string };
}>(async (c, next) => {
  const token = c.env.API_TOKEN;
  if (!token) return c.json({ message: "API_TOKEN is not configured" }, 503);
  const header = c.req.header("Authorization") ?? "";
  const given = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!given || !(await timingSafeEqual(given, token))) {
    c.header("WWW-Authenticate", 'Bearer realm=""');
    return c.json({ message: "Unauthorized" }, 401);
  }
  await next();
});
