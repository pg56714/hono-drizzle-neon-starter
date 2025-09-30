import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const book = pgTable("book", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title"),
  author: text("author"),
});
