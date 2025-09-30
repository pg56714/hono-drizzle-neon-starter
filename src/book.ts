import { Hono } from "hono";
// import { customLogger } from "./middleware/customLogger";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { book } from "./db/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
interface Env {
  DATABASE_URL: string;
}

export interface Book {
  id: string;
  title: string | null;
  author: string | null;
}

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
});

// In-memory store removed; using Drizzle + Neon

// Apply logger middleware to all book routes
// book.use("*", customLogger);

const bookRoute = new Hono<{ Bindings: Env }>()
  // List all books
  .get(
    "/",
    async (c, next) => {
      console.log("GET /book before");
      await next();
      console.log("GET /book after");
    },
    async (c) => {
      const db = drizzle(c.env.DATABASE_URL);
      const rows = await db.select().from(book);
      return c.json(rows);
    }
  )
  // Get a single book by id
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    if (!id) return c.json({ message: "Invalid id" }, 400);
    const db = drizzle(c.env.DATABASE_URL);
    const rows = await db.select().from(book).where(eq(book.id, id)).limit(1);
    const found = rows[0];
    if (!found) return c.json({ message: "Book not found" }, 404);
    return c.json(found);
  })
  // Create a new book
  .post("/", zValidator("json", bookSchema), async (c) => {
    const { title, author } = c.req.valid("json");
    const db = drizzle(c.env.DATABASE_URL);
    const [created] = await db
      .insert(book)
      .values({ title, author })
      .returning();
    return c.json(created, 201);
  })
  // Update a book fully
  .put("/:id", zValidator("json", bookSchema), async (c) => {
    const id = c.req.param("id");
    if (!id) return c.json({ message: "Invalid id" }, 400);
    const { title, author } = c.req.valid("json");
    const db = drizzle(c.env.DATABASE_URL);
    const [updated] = await db
      .update(book)
      .set({ title, author })
      .where(eq(book.id, id))
      .returning();
    if (!updated) return c.json({ message: "Book not found" }, 404);
    return c.json(updated);
  })
  // Delete a book
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    if (!id) return c.json({ message: "Invalid id" }, 400);
    const db = drizzle(c.env.DATABASE_URL);
    const [removed] = await db.delete(book).where(eq(book.id, id)).returning();
    if (!removed) return c.json({ message: "Book not found" }, 404);
    return c.json(removed);
  });

export default bookRoute;
