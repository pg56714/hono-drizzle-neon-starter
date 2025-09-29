import { Hono } from "hono";
// import { renderer } from "./renderer";
// import greet from "./greet";
import bookRoute from "./book";

const app = new Hono();

// app.use(renderer);

app.notFound((c) => {
  return c.html(<h1>404 Not Found</h1>);
});

// // 500 Internal Server Error
// app.onError((err, c) => {
//   return c.html(<h1>Error: {err.message}</h1>);
// });

const routes = app
  .get("/", (c) => {
    return c.html(
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          <link
            rel="stylesheet"
            href="https://cdn.simplecss.org/simple.min.css"
          />
          <link rel="stylesheet" href="/static/style.css" />
          {import.meta.env.PROD ? (
            <script type="module" src="/static/client.js" />
          ) : (
            <script type="module" src="/src/client.tsx" />
          )}
        </head>
        <body>
          <div id="root" />
        </body>
      </html>
    );
  })
  .route("/book", bookRoute);

// app
//   .get("/", (c) => {
//     const userAgent = c.req.header("user-agent");
//     c.header("X-Custom-Header", "Hono");
//     c.status(201);
//     // q=xxx&limit=10&offset=0
//     // const q = c.req.query("q");
//     // const limit = c.req.query("limit");
//     // const offset = c.req.query("offset");
//     const { q, limit, offset } = c.req.query();
//     return c.json({ message: `Hello! from ${userAgent}`, q, limit, offset });
//     // return c.json({ message: `Hello! from ${userAgent}` });
//     // return c.html(<h1>Hello! from {userAgent}</h1>);
//   })
//   .post("/", async (c) => {
//     const { name, age } = await c.req.json();
//     return c.json({ message: `Hello! from ${name} ${age}` });
//   })
//   .route("/greet", greet);

// app.get("/", (c) => {
//   // return c.render(<h1>Hello!</h1>);
//   return c.html(<h1>Hello!</h1>);
// });

// // change to all to handle all methods
// app.all("/", (c) => {
//   // return c.render(<h1>Hello!</h1>);
//   return c.html(<h1>Hello!</h1>);
// });

// app.on("GET", ["/hello", "/hi"], (c) => {
//   return c.html(<h1>Greeting to Hono!</h1>);
// });

// /user/xxx
// app.get("/user/:name", (c) => {
//   const name = c.req.param("name");
//   return c.html(<h1>Hello {name}!</h1>);
// });

// Add ? to replace
// app.on("GET", ["/user/:name", "/user"], (c) => {
//   const name = c.req.param("name");
//   if (!name) {
//     return c.html(<h1>Hello World!</h1>);
//   }
//   return c.html(<h1>Greeting to Hono!</h1>);
// });

// // add ? to make the parameter optional
// app.get("/user/:name?", (c) => {
//   const name = c.req.param("name");
//   if (!name) {
//     return c.html(<h1>Hello World!</h1>);
//   }
//   return c.html(<h1>Hello {name}!</h1>);
// });

// Type safety is guaranteed here
export type AppType = typeof routes;
export default app;
