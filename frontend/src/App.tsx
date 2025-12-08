import { useEffect, useState } from "react";
import "./App.css";
import { api } from "./api";
import type {
  Author,
  AuthorCreate,
  AuthorDetail,
  BookCreate,
  BookDetail,
  Genre,
  Publisher,
} from "./types";
import { AuthorSidebar } from "./components/AuthorSidebar";
import { AuthorForm } from "./components/AuthorForm";
import { AuthorDetailView } from "./components/AuthorDetailView";
import { BookList } from "./components/BookList";
import { BookForm } from "./components/BookForm";
import { BookDetailView } from "./components/BookDetailView";

function App() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [selectedAuthorId, setSelectedAuthorId] = useState<number | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<AuthorDetail | null>(
    null
  );
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [selectedBook, setSelectedBook] = useState<BookDetail | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

    const [showAuthorForm, setShowAuthorForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<
    (AuthorCreate & { id?: number }) | null
  >(null);
  const [showBookForm, setShowBookForm] = useState(false);
  const [editingBook, setEditingBook] = useState<
    (BookCreate & { id?: number }) | null
  >(null);

    useEffect(() => {
    loadAuthors();
    loadGenres();
    loadPublishers();
  }, []);

    useEffect(() => {
    if (selectedAuthorId) {
      loadAuthorDetails(selectedAuthorId);
    }
  }, [selectedAuthorId]);

  useEffect(() => {
    if (selectedBookId) {
      loadBookDetails(selectedBookId);
    }
  }, [selectedBookId]);

  const loadAuthors = async () => {
    setLoading(true);
    try {
      const data = await api.getAuthors();
      setAuthors(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load authors");
    }
    setLoading(false);
  };

  const loadAuthorDetails = async (id: number) => {
    try {
      const data = await api.getAuthor(id);
      setSelectedAuthor(data);
      setSelectedBookId(null);
      setSelectedBook(null);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load author details"
      );
    }
  };

  const loadBookDetails = async (id: number) => {
    try {
      const data = await api.getBook(id);
      setSelectedBook(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load book details"
      );
    }
  };

  const loadGenres = async () => {
    try {
      const data = await api.getGenres();
      setGenres(data);
    } catch (err) {
      console.error("Failed to load genres:", err);
    }
  };

  const loadPublishers = async () => {
    try {
      const data = await api.getPublishers();
      setPublishers(data);
    } catch (err) {
      console.error("Failed to load publishers:", err);
    }
  };

  const handleAddAuthor = () => {
    setEditingAuthor(null);
    setShowAuthorForm(true);
  };

  const handleEditAuthor = () => {
    if (selectedAuthor) {
      setEditingAuthor({
        id: selectedAuthor.id,
        name: selectedAuthor.name,
        surname: selectedAuthor.surname,
        birth_year: selectedAuthor.birth_year,
      });
      setShowAuthorForm(true);
    }
  };

  const handleSaveAuthor = async (author: AuthorCreate) => {
    try {
      if (editingAuthor?.id) {
        await api.updateAuthor(editingAuthor.id, author);
      } else {
        const newAuthor = await api.createAuthor(author);
        setSelectedAuthorId(newAuthor.id);
      }
      loadAuthors();
      if (selectedAuthorId) {
        await loadAuthorDetails(selectedAuthorId);
      }
      setShowAuthorForm(false);
      setEditingAuthor(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save author");
    }
  };

  const handleDeleteAuthor = async () => {
    if (!selectedAuthor) return;

    if (
      !confirm(
        `Are you sure you want to delete ${selectedAuthor.name} ${selectedAuthor.surname}?`
      )
    ) {
      return;
    }

    try {
      await api.deleteAuthor(selectedAuthor.id);
      setSelectedAuthorId(null);
      setSelectedAuthor(null);
      await loadAuthors();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete author");
    }
  };

    const handleAddBook = () => {
    setEditingBook(null);
    setShowBookForm(true);
  };

  const handleEditBook = () => {
    if (selectedBook && selectedAuthorId) {
      setEditingBook({
        id: selectedBook.id,
        title: selectedBook.title,
        edition: selectedBook.edition,
        published_date: selectedBook.published_date,
        publisher_id: selectedBook.publisher_id,
        genre_id: selectedBook.genre_id,
        author_ids: selectedBook.authors.map((a) => a.id),
      });
      setShowBookForm(true);
    }
  };

  const handleSaveBook = async (book: BookCreate) => {
    try {
      if (editingBook?.id) {
        await api.updateBook(editingBook.id, book);
      } else {
        await api.createBook(book);
      }
      if (selectedAuthorId) {
        await loadAuthorDetails(selectedAuthorId);
      }
      setShowBookForm(false);
      setEditingBook(null);
      setSelectedBookId(null);
      setSelectedBook(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save book");
    }
  };

  const handleDeleteBook = async () => {
    if (!selectedBook) return;

    if (
      !confirm(`Are you sure you want to delete "${selectedBook.title}"?`)
    ) {
      return;
    }

    try {
      await api.deleteBook(selectedBook.id);
      setSelectedBookId(null);
      setSelectedBook(null);
      if (selectedAuthorId) {
        await loadAuthorDetails(selectedAuthorId);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete book");
    }
  };

  return (
    <div className="app">
      <AuthorSidebar
        authors={authors}
        selectedAuthorId={selectedAuthorId}
        onSelectAuthor={setSelectedAuthorId}
        onAddAuthor={handleAddAuthor}
        loading={loading}
      />
      <div className="main-content">
        <div style={{ background: "white", padding: "1.5em", borderBottom: "1px solid #ddd", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
          <h1 style={{ margin: 0 }}>Book Catalog</h1>
        </div>
        <div style={{ padding: "1.5em", backgroundColor: "#f5f5f5", minHeight: "calc(100vh - 80px)" }}>
          {error && (
            <div style={{ padding: "1em", background: "#f2dede", color: "#a94442", borderRadius: "4px", marginBottom: "1em" }}>
              {error}
            </div>
          )}
          {!selectedAuthorId && !error && (
            <div style={{ padding: "3em", textAlign: "center", color: "#666" }}>
              Please select an author from the sidebar
            </div>
          )}
          {selectedAuthor && (
            <>
              <AuthorDetailView
                author={selectedAuthor}
                onEdit={handleEditAuthor}
                onDelete={handleDeleteAuthor}
              />
              <BookList
                books={selectedAuthor.books}
                selectedBookId={selectedBookId}
                onSelectBook={setSelectedBookId}
                onAddBook={handleAddBook}
              />
              {selectedBook && (
                <BookDetailView
                  book={selectedBook}
                  onEdit={handleEditBook}
                  onDelete={handleDeleteBook}
                />
              )}
            </>
          )}
        </div>
      </div>

      {showAuthorForm && (
        <AuthorForm
          author={editingAuthor || undefined}
          onSave={handleSaveAuthor}
          onCancel={() => {
            setShowAuthorForm(false);
            setEditingAuthor(null);
          }}
          title={editingAuthor ? "Edit Author" : "Add New Author"}
        />
      )}

      {showBookForm && selectedAuthorId && (
        <BookForm
          book={editingBook || undefined}
          genres={genres}
          publishers={publishers}
          currentAuthorId={selectedAuthorId}
          onSave={handleSaveBook}
          onCancel={() => {
            setShowBookForm(false);
            setEditingBook(null);
          }}
          title={editingBook ? "Edit Book" : "Add New Book"}
        />
      )}
    </div>
  );
}

export default App;
