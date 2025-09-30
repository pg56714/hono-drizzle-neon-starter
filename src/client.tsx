import { hc } from "hono/client";
import { render, useEffect, useState } from "hono/jsx/dom";
import type { AppType } from "./index";
import { Book } from "./book";

const client = hc<AppType>("/");

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    const res = await client.book.$get();
    const data = await res.json();
    setBooks(data);
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const res = await client.book.$post({
      json: {
        title,
        author,
      },
    });
    await res.json();
    // Redirect
    window.location.href = "/";
  }

  function startEdit(book: Book) {
    setEditingId(book.id);
    setEditTitle(book.title ?? "");
    setEditAuthor(book.author ?? "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditAuthor("");
  }

  async function saveEdit(id: string) {
    await client.book[":id"].$put({
      param: { id: String(id) },
      json: { title: editTitle, author: editAuthor },
    });
    await fetchBooks();
    cancelEdit();
  }

  async function deleteBook(id: string) {
    await client.book[":id"].$delete({
      param: { id: String(id) },
    });
    setBooks((prev) => prev.filter((b) => b.id !== id));
  }
  return (
    <>
      <h2>Add books</h2>
      <form onSubmit={handleSubmit} class="book-row">
        <div class="book-left">
          <input type="text" name="title" placeholder="Title" />
          <input type="text" name="author" placeholder="Author" />
        </div>
        <div class="book-actions">
          <button type="submit">Add</button>
        </div>
      </form>
      <h2>Books</h2>
      <div>
        {books.map((book) => (
          <div key={book.id} class="book-row">
            {editingId === book.id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveEdit(book.id);
                }}
              >
                <div class="book-row">
                  <div class="book-left">
                    <input
                      type="text"
                      name="title"
                      placeholder="Title"
                      value={editTitle}
                      onInput={(e) =>
                        setEditTitle((e.target as HTMLInputElement).value)
                      }
                    />
                    <input
                      type="text"
                      name="author"
                      placeholder="Author"
                      value={editAuthor}
                      onInput={(e) =>
                        setEditAuthor((e.target as HTMLInputElement).value)
                      }
                    />
                  </div>
                  <div class="book-actions">
                    <button type="submit">Save</button>
                    <button type="button" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <>
                <div class="book-left">
                  {book.title} - {book.author}
                </div>
                <div class="book-actions">
                  <button type="button" onClick={() => startEdit(book)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => deleteBook(book.id)}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
const root = document.getElementById("root")!;
render(<App />, root);
