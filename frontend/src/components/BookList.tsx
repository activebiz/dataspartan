import type { BookSummary } from "../types";

interface BookListProps {
  books: BookSummary[];
  selectedBookId: number | null;
  onSelectBook: (id: number) => void;
  onAddBook: () => void;
}

export function BookList({
  books,
  selectedBookId,
  onSelectBook,
  onAddBook,
}: BookListProps) {
  return (
    <div style={{ background: "white", borderRadius: "4px", padding: "1.5em", marginTop: "1em"}}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1em" }}>
        <h3 style={{ margin: 0 }}>Books ({books.length})</h3>
        <button className="pure-button pure-button-primary" onClick={onAddBook}>
          + Add Book
        </button>
      </div>
      {books.length === 0 ? (
        <div style={{ padding: "2em", textAlign: "center", color: "#999" }}>
          No books available
        </div>
      ) : (
        <div className="pure-g" style={{ marginLeft: "-0.5em", marginRight: "-0.5em" }}>
          {books.map((book) => (
            <div key={book.id} className="pure-u-1 pure-u-md-1-2 pure-u-lg-1-3" style={{ padding: "0.5em" }}>
              <div
                className={`book-card ${selectedBookId === book.id ? "selected" : ""}`}
                onClick={() => onSelectBook(book.id)}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  padding: "1em",
                  cursor: "pointer",
                  height: "100%",
                  transition: "all 0.2s",
                  boxShadow: selectedBookId === book.id ? "0 2px 4px rgba(0,0,0,0.1)" : "none"
                }}
              >
                <h4 style={{ margin: "0 0 0.5em 0", fontSize: "16px" }}>{book.title}</h4>
                <p style={{ margin: "0.25em 0", fontSize: "0.9em", color: "#555" }}>
                  <strong>Edition:</strong> {book.edition || "N/A"}
                </p>
                <p style={{ margin: "0.25em 0", fontSize: "0.9em", color: "#555" }}>
                  <strong>Genre:</strong> {book.genre.name}
                </p>
                <p style={{ margin: "0.25em 0", fontSize: "0.9em", color: "#555" }}>
                  <strong>Publisher:</strong> {book.publisher.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
