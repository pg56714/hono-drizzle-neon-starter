import { Hono } from "hono";

const greet = new Hono();

greet
  .get("/user/:name?", (c) => {
    const name = c.req.param("name");
    if (!name) {
      return c.html(`<h1>Hello Hono!</h1>`);
    }
    return c.html(`<h1>Hello ${name}!</h1>`);
  })
  .get("/user/:name/:age", (c) => {
    // const name = c.req.param("name");
    // const age = c.req.param("age");
    const { name, age } = c.req.param();
    return c.json({ name, age });
  });

export default greet;
