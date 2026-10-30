import { hc } from "hono/client";
import { render, useEffect, useState } from "hono/jsx/dom";
import type { AppType } from "./index";
import { Book } from "./book";

const TOKEN_KEY = "apiToken";
const client = hc<AppType>("/", {
  // Writes require the API token; reads are public
  headers: (): Record<string, string> => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});

function checkWrite(res: Response): boolean {
  if (res.ok) return true;
  alert(res.status === 401 ? "Invalid or missing API token" : `Request failed (${res.status})`);
  return false;
}

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [token, setToken] = useState(sessionStorage.getItem(TOKEN_KEY) ?? "");
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
    if (!checkWrite(res)) return;
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
    const res = await client.book[":id"].$put({
      param: { id: String(id) },
      json: { title: editTitle, author: editAuthor },
    });
    if (!checkWrite(res)) return;
    await fetchBooks();
    cancelEdit();
  }

  async function deleteBook(id: string) {
    const res = await client.book[":id"].$delete({
      param: { id: String(id) },
    });
    if (!checkWrite(res)) return;
    setBooks((prev) => prev.filter((b) => b.id !== id));
  }
  return (
    <>
      <label>
        API token (required to add, edit or delete)
        <input
          type="password"
          style="width: 100%"
          value={token}
          onInput={(e) => {
            const value = (e.target as HTMLInputElement).value;
            setToken(value);
            sessionStorage.setItem(TOKEN_KEY, value);
          }}
        />
      </label>
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
