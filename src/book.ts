import { Hono } from "hono";
// import { customLogger } from "./middleware/customLogger";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

export interface Book {
  id: number;
  title: string;
  author: string;
}

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
});

const books: Book[] = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee" },
];

let nextId = books.length + 1;

// Apply logger middleware to all book routes
// book.use("*", customLogger);

const bookRoute = new Hono()
  // List all books
  .get(
    "/",
    async (c, next) => {
      console.log("GET /book before");
      await next();
      console.log("GET /book after");
    },
    (c) => {
      console.log("GET /book");
      return c.json(books);
    }
  )
  // Get a single book by id
  .get("/:id", (c) => {
    const id = Number(c.req.param("id"));
    const found = books.find((b) => b.id === id);
    if (!found) return c.json({ message: "Book not found" }, 404);
    return c.json(found);
  })
  // Create a new book
  .post("/", zValidator("json", bookSchema), (c) => {
    const { title, author } = c.req.valid("json");
    const created: Book = { id: nextId++, title, author };
    books.push(created);
    return c.json(created, 201);
  })
  // Update a book fully
  .put("/:id", zValidator("json", bookSchema), (c) => {
    const id = Number(c.req.param("id"));
    const idx = books.findIndex((b) => b.id === id);
    if (idx === -1) return c.json({ message: "Book not found" }, 404);

    const { title, author } = c.req.valid("json");
    const updated: Book = { id, title, author };
    books[idx] = updated;
    return c.json(updated);
  })
  // Delete a book
  .delete("/:id", (c) => {
    const id = Number(c.req.param("id"));
    const idx = books.findIndex((b) => b.id === id);
    if (idx === -1) return c.json({ message: "Book not found" }, 404);
    const [removed] = books.splice(idx, 1);
    return c.json(removed);
  });

export default bookRoute;
