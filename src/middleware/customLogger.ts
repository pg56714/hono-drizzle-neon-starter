import { createMiddleware } from "hono/factory";

export const customLogger = createMiddleware(async (c, next) => {
  const url = c.req.url;
  const method = c.req.method;
  console.log(`<- ${method} ${url}`);
  await next();
  console.log(`${method} ${url} ->`);
});
